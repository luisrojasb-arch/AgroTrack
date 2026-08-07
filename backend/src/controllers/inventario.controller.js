import Inventario from "../models/inventario.model.js";
import Finanzas from "../models/finanzas.model.js";
import { catchAsync } from "../middlewares/catch_async.middleware.js";

/**
 * @description Listar artículos del inventario con paginación y filtros.
 */
export const obtenerInventario = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { page = 1, limit = 10, search = "", categoria = "" } = req.query;

  const query = { finca_id: fincaId, esta_eliminado: false };

  if (categoria && categoria !== "Todas" && categoria !== "Todos") {
    query.categoria = categoria;
  }

  if (search) {
    query.$or = [
      { nombre: { $regex: search, $options: "i" } },
      { codigo: { $regex: search, $options: "i" } },
    ];
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
  };

  const resultado = await Inventario.paginate(query, options);

  res.status(200).json({
    inventario: resultado.docs,
    paginacion: {
      totalRegistros: resultado.totalDocs,
      totalPaginas: resultado.totalPages,
      paginaActual: resultado.page,
      limite: resultado.limit,
      tienePaginaAnterior: resultado.hasPrevPage,
      tienePaginaSiguiente: resultado.hasNextPage,
    },
  });
});

/**
 * @description Registrar un nuevo artículo y generar automáticamente el egreso en Finanzas conservando su moneda original.
 */
export const registrarArticulo = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const finca = req.finca;
  const {
    codigo,
    nombre,
    categoria,
    unidad,
    cantidad,
    costo_unitario,
    tipo_moneda = "COP",
    ...restoDatos
  } = req.body;

  if (codigo) {
    const existeCodigo = await Inventario.findOne({
      codigo,
      finca_id: fincaId,
      esta_eliminado: false,
    });
    if (existeCodigo) {
      return res.status(400).json({
        msg: "Ya existe un artículo con ese código en el inventario.",
      });
    }
  }

  if (tipo_moneda !== "COP" && costo_unitario > 0) {
    const tasas = finca.tasas_cambio || {};
    let tasaCambio = 0;

    if (tipo_moneda === "USD") tasaCambio = tasas.usd_a_cop;
    if (tipo_moneda === "Bs") tasaCambio = tasas.bs_a_cop;

    if (!tasaCambio || tasaCambio <= 0) {
      return res.status(400).json({
        msg: `No se puede registrar en ${tipo_moneda}. Debe configurar primero la tasa de cambio en la sección de configuración de la finca.`,
      });
    }
  }

  const nuevoArticulo = await Inventario.create({
    ...restoDatos,
    codigo,
    nombre,
    categoria,
    unidad,
    cantidad,
    costo_unitario: costo_unitario || 0,
    tipo_moneda,
    finca_id: fincaId,
  });

  if (cantidad > 0 && costo_unitario > 0) {
    const montoTotalOriginal = cantidad * costo_unitario;

    const categoriaFinanza = ["Alimento", "Vacuna", "Medicamento"].includes(
      categoria,
    )
      ? categoria
      : "Insumos";

    await Finanzas.create({
      finca_id: fincaId,
      concepto: `Compra inventario: ${nombre} (${cantidad} ${unidad})`,
      tipo_moneda: tipo_moneda,
      monto: montoTotalOriginal,
      tipo_movimiento: "Egreso",
      categoria: categoriaFinanza,
      metodo_pago: "Efectivo",
      fecha_pago: new Date(),
      nota: `Generado automáticamente por el módulo de inventario.`,
    });
  }

  res.status(201).json({
    msg: "Artículo registrado y movimiento financiero generado exitosamente.",
    articulo: nuevoArticulo,
  });
});

/**
 * @description Obtener detalles de un artículo específico.
 */
export const obtenerDetalleArticulo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const articulo = await Inventario.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  });

  if (!articulo) {
    return res.status(404).json({ msg: "Artículo no encontrado." });
  }

  res.status(200).json({ articulo });
});

/**
 * @description Editar un artículo del inventario.
 */
export const editarArticulo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  if (req.body.codigo) {
    const existeCodigo = await Inventario.findOne({
      codigo: req.body.codigo,
      finca_id: fincaId,
      _id: { $ne: id },
      esta_eliminado: false,
    });
    if (existeCodigo) {
      return res
        .status(400)
        .json({ msg: "El código ingresado ya pertenece a otro artículo." });
    }
  }

  const articuloActualizado = await Inventario.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    req.body,
    { new: true, runValidators: true },
  );

  if (!articuloActualizado) {
    return res.status(404).json({ msg: "Artículo no encontrado." });
  }

  res.status(200).json({
    msg: "Artículo actualizado correctamente.",
    articulo: articuloActualizado,
  });
});

/**
 * @description Ajustar el Stock (Entrada / Salida rápida).
 */
export const ajustarStock = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;
  const { tipo_ajuste, cantidad, nota } = req.body;

  const articulo = await Inventario.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  });
  if (!articulo) {
    return res.status(404).json({ msg: "Artículo no encontrado." });
  }

  const cantNum = Number(cantidad);
  if (cantNum <= 0) {
    return res
      .status(400)
      .json({ msg: "La cantidad del ajuste debe ser mayor a 0." });
  }

  if (tipo_ajuste === "Salida" && articulo.cantidad < cantNum) {
    return res.status(400).json({
      msg: `Stock insuficiente. Cantidad actual: ${articulo.cantidad} ${articulo.unidad}.`,
    });
  }

  articulo.cantidad =
    tipo_ajuste === "Entrada"
      ? articulo.cantidad + cantNum
      : articulo.cantidad - cantNum;
  if (nota) articulo.nota = nota;

  await articulo.save();

  res.status(200).json({
    msg: `Stock ajustado correctamente (${tipo_ajuste}).`,
    articulo,
  });
});

/**
 * @description Eliminar un artículo (Soft Delete).
 */
export const eliminarArticulo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const articuloEliminado = await Inventario.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    { esta_eliminado: true, eliminado_at: new Date() },
    { new: true },
  );

  if (!articuloEliminado) {
    return res.status(404).json({ msg: "Artículo no encontrado." });
  }

  res
    .status(200)
    .json({ msg: "El artículo ha sido eliminado del inventario." });
});

/**
 * @description Obtener el resumen del inventario formateado para la tabla principal (Convirtiendo a pesos al vuelo).
 */
export const obtenerResumenInventario = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const finca = req.finca;
  const { page = 1, limit = 10, search = "", categoria = "" } = req.query;

  const query = { finca_id: fincaId, esta_eliminado: false };

  if (categoria && categoria !== "Todas" && categoria !== "Todos") {
    query.categoria = categoria;
  }

  if (search) {
    query.$or = [
      { nombre: { $regex: search, $options: "i" } },
      { codigo: { $regex: search, $options: "i" } },
    ];
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
  };

  const resultado = await Inventario.paginate(query, options);
  const tasas = finca.tasas_cambio || {};

  const inventarioFormateado = resultado.docs.map((item) => {
    let estado = "Disponible";

    if (item.cantidad === 0) {
      estado = "No disponible";
    } else if (item.cantidad <= item.stock_minimo) {
      estado = "Stock mínimo";
    }

    let costoEnCOP = item.costo_unitario;
    if (item.tipo_moneda === "USD") {
      costoEnCOP = item.costo_unitario * (tasas.usd_a_cop || 1);
    } else if (item.tipo_moneda === "Bs") {
      costoEnCOP = item.costo_unitario * (tasas.bs_a_cop || 1);
    }

    return {
      id: item._id,
      codigo: item.codigo || "-",
      nombre: item.nombre,
      categoria: item.categoria,
      cantidad: item.cantidad,
      stock_min: item.stock_minimo,
      costo: `$${costoEnCOP.toLocaleString()} COP`,
      costo_original: `${item.costo_unitario} ${item.tipo_moneda}`,
      estado: estado,
      unidad: item.unidad,
    };
  });

  res.status(200).json({
    inventario: inventarioFormateado,
    paginacion: {
      totalRegistros: resultado.totalDocs,
      totalPaginas: resultado.totalPages,
      paginaActual: resultado.page,
      limite: resultado.limit,
      tienePaginaAnterior: resultado.hasPrevPage,
      tienePaginaSiguiente: resultado.hasNextPage,
    },
  });
});

/**
 * @description Obtener estadísticas generales del inventario (Tarjetas resumen).
 */
export const obtenerEstadisticasInventario = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const finca = req.finca;
  const tasas = finca.tasas_cambio || {};
  const ahora = new Date();

  const articulos = await Inventario.find({ finca_id: fincaId, esta_eliminado: false });

  let total_articulos = articulos.length;
  let alertas_stock_bajo = 0;
  let articulos_vencidos = 0;
  let valor_total = 0;

  articulos.forEach((item) => {
    if (item.cantidad <= item.stock_minimo) {
      alertas_stock_bajo++;
    }

    if (item.fecha_vencimiento && new Date(item.fecha_vencimiento) < ahora) {
      articulos_vencidos++;
    }

    let costoEnCOP = item.costo_unitario || 0;
    if (item.tipo_moneda === "USD") {
      costoEnCOP = costoEnCOP * (tasas.usd_a_cop || 1);
    } else if (item.tipo_moneda === "Bs") {
      costoEnCOP = costoEnCOP * (tasas.bs_a_cop || 1);
    }

    valor_total += (item.cantidad * costoEnCOP);
  });

  res.status(200).json({
    estadisticas: {
      total_articulos,
      alertas_stock_bajo,
      articulos_vencidos,
      valor_total: `$${valor_total.toLocaleString()} COP`,
    },
  });
});