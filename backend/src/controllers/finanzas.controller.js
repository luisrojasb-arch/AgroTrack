import Finanzas from "../models/finanzas.model.js";
import { catchAsync } from "../middlewares/catch_async.middleware.js";

export const obtenerResumenFinanzas = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const finca = req.finca;
  const {
    page = 1,
    limit = 10,
    search = "",
    tipo = "",
    categoria = "",
  } = req.query;

  const query = { finca_id: fincaId, esta_eliminado: false };

  if (tipo && tipo !== "Todos" && tipo !== "Todos los tipos") {
    query.tipo_movimiento = tipo;
  }

  if (
    categoria &&
    categoria !== "Todas" &&
    categoria !== "Todas las categorias" &&
    categoria !== "Todas las categorías"
  ) {
    query.categoria = categoria;
  }

  if (search) {
    query.concepto = { $regex: search, $options: "i" };
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { fecha_pago: -1 },
  };

  const resultado = await Finanzas.paginate(query, options);
  const tasas = finca.tasas_cambio || {};

  const transaccionesFormateadas = resultado.docs.map((item) => {
    let montoEnCOP = item.monto;

    if (item.tipo_moneda === "USD") {
      const tasaUSD = tasas.usd_a_cop || 1;
      montoEnCOP = item.monto * tasaUSD;
    } else if (item.tipo_moneda === "Bs") {
      const tasaBs = tasas.bs_a_cop || 1;
      montoEnCOP = item.monto * tasaBs;
    }

    const signo = item.tipo_movimiento === "Egreso" ? "-" : "";
    const montoFormateado = `${signo}$${montoEnCOP.toLocaleString()} COP`;

    return {
      id: item._id,
      fecha: item.fecha_pago
        ? item.fecha_pago
            .toISOString()
            .split("T")[0]
            .split("-")
            .reverse()
            .join("/")
        : "-",
      tipo: item.tipo_movimiento,
      categoria: item.categoria,
      descripcion: item.concepto,
      monto: montoFormateado,
      monto_original: `${item.monto} ${item.tipo_moneda}`,
      metodo_pago: item.metodo_pago,
    };
  });

  res.status(200).json({
    transacciones: transaccionesFormateadas,
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

export const registrarTransaccion = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const finca = req.finca;
  const { monto, tipo_moneda = "COP", ...restoDatos } = req.body;

  if (tipo_moneda !== "COP") {
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

  const nuevaTransaccion = await Finanzas.create({
    ...restoDatos,
    monto: Number(monto),
    tipo_moneda,
    finca_id: fincaId,
  });

  res.status(201).json({
    msg: "Transacción registrada exitosamente.",
    transaccion: nuevaTransaccion,
  });
});

export const obtenerDetalleTransaccion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const transaccion = await Finanzas.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  });

  if (!transaccion) {
    return res.status(404).json({ msg: "Transacción no encontrada." });
  }

  res.status(200).json({ transaccion });
});

export const editarTransaccion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const transaccionActualizada = await Finanzas.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    req.body,
    { new: true, runValidators: true }
  );

  if (!transaccionActualizada) {
    return res.status(404).json({ msg: "Transacción no encontrada." });
  }

  res.status(200).json({
    msg: "Transacción actualizada correctamente.",
    transaccion: transaccionActualizada,
  });
});

export const eliminarTransaccion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const transaccionEliminada = await Finanzas.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    { esta_eliminado: true, eliminado_at: new Date() },
    { new: true }
  );

  if (!transaccionEliminada) {
    return res.status(404).json({ msg: "Transacción no encontrada." });
  }

  res.status(200).json({ msg: "La transacción ha sido eliminada exitosamente." });
});

export const obtenerEstadisticasFinanzas = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const tasas = req.finca.tasas_cambio || {};

  const transacciones = await Finanzas.find({
    finca_id: fincaId,
    esta_eliminado: false,
  });

  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();

  let ingresosMes = 0;
  let gastosMes = 0;

  const desgloseGastos = {};

  const ultimos6Meses = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(anioActual, mesActual - i, 1);
    const mesNombre = d.toLocaleString("es-ES", { month: "short" });
    ultimos6Meses.push({
      mes: mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1),
      mesNum: d.getMonth(),
      anio: d.getFullYear(),
      ingresos: 0,
      gastos: 0,
    });
  }

  transacciones.forEach((t) => {
    const fechaT = new Date(t.fecha_pago);
    const tMes = fechaT.getMonth();
    const tAnio = fechaT.getFullYear();

    let montoCOP = t.monto;
    if (t.tipo_moneda === "USD") {
      montoCOP = t.monto * (tasas.usd_a_cop || 1);
    } else if (t.tipo_moneda === "Bs") {
      montoCOP = t.monto * (tasas.bs_a_cop || 1);
    }

    if (tMes === mesActual && tAnio === anioActual) {
      if (t.tipo_movimiento === "Ingreso") ingresosMes += montoCOP;
      if (t.tipo_movimiento === "Egreso") gastosMes += montoCOP;
    }

    // Acumulamos únicamente si es un Egreso para el desglose
    if (t.tipo_movimiento === "Egreso") {
      if (!desgloseGastos[t.categoria]) {
        desgloseGastos[t.categoria] = 0;
      }
      desgloseGastos[t.categoria] += montoCOP;
    }

    const mesIndex = ultimos6Meses.findIndex(
      (m) => m.mesNum === tMes && m.anio === tAnio
    );
    if (mesIndex !== -1) {
      if (t.tipo_movimiento === "Ingreso") {
        ultimos6Meses[mesIndex].ingresos += montoCOP;
      } else if (t.tipo_movimiento === "Egreso") {
        ultimos6Meses[mesIndex].gastos += montoCOP;
      }
    }
  });

  const gananciaNeta = ingresosMes - gastosMes;
  let margenGanancia = 0;
  if (ingresosMes > 0) {
    margenGanancia = ((gananciaNeta / ingresosMes) * 100).toFixed(1);
  }

  const desgloseFormateado = Object.keys(desgloseGastos)
    .map((categoria) => ({
      categoria,
      total: desgloseGastos[categoria],
    }))
    .sort((a, b) => b.total - a.total);

  const grafico6Meses = ultimos6Meses.map((m) => ({
    mes: m.mes,
    ingresos: m.ingresos,
    gastos: m.gastos,
  }));

  res.status(200).json({
    tarjetas: {
      ingresos_totales: `$${ingresosMes.toLocaleString()} COP`,
      gastos_totales: `$${gastosMes.toLocaleString()} COP`,
      ganancia_neta: `$${gananciaNeta.toLocaleString()} COP`,
      margen_ganancia: `${margenGanancia}%`,
    },
    desglose_gastos: desgloseFormateado,
    ingresos_vs_gastos: grafico6Meses,
  });
});