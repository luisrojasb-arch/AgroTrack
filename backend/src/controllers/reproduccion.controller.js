import CicloReproductivo from "../models/reproduccion.model.js";
import Animal from "../models/animal.model.js";
import Lote from "../models/lote.model.js";
import { catchAsync } from "../middlewares/catch_async.middleware.js";

/**
 * @description Registrar el inicio del celo para una hembra.
 * Calcula automáticamente el próximo celo esperado a los 21 días.
 */
export const registrarCelo = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { hembra_id, fecha_celo, nota_celo } = req.body;

  const hembra = await Animal.findOne({
    _id: hembra_id,
    finca_id: fincaId,
    esta_eliminado: false,
  });
  if (!hembra) {
    return res.status(404).json({
      msg: "La hembra seleccionada no existe o no pertenece a esta finca.",
    });
  }

  const fechaCeloDate = new Date(fecha_celo);

  const proximoCeloEsperado = new Date(fechaCeloDate);
  proximoCeloEsperado.setDate(proximoCeloEsperado.getDate() + 21);

  const nuevoCiclo = await CicloReproductivo.create({
    finca_id: fincaId,
    hembra_id,
    estado: "Celo",
    fecha_celo: fechaCeloDate,
    proximo_celo_esperado: proximoCeloEsperado,
    nota_celo: nota_celo || null,
  });

  res.status(201).json({
    msg: "Registro de celo guardado exitosamente.",
    ciclo: nuevoCiclo,
  });
});

/**
 * @description Editar un registro de celo.
 * Recalcula la fecha del próximo celo si la fecha de celo cambia.
 */
export const editarCelo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;
  const { fecha_celo, nota_celo, hembra_id } = req.body;

  const ciclo = await CicloReproductivo.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  });
  if (!ciclo) {
    return res.status(404).json({ msg: "Registro de celo no encontrado." });
  }

  if (hembra_id) ciclo.hembra_id = hembra_id;
  if (nota_celo !== undefined) ciclo.nota_celo = nota_celo;

  if (fecha_celo) {
    const nuevaFechaCelo = new Date(fecha_celo);
    ciclo.fecha_celo = nuevaFechaCelo;

    const proximoCelo = new Date(nuevaFechaCelo);
    proximoCelo.setDate(proximoCelo.getDate() + 21);
    ciclo.proximo_celo_esperado = proximoCelo;
  }

  await ciclo.save();

  res.status(200).json({
    msg: "Celo actualizado correctamente.",
    ciclo,
  });
});

/**
 * @description Confirmar preñez para un celo existente.
 * Cambia el estado a 'Preñez' y calcula el parto probable a los 114 días.
 */
export const confirmarPrenez = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;
  const { fecha_servicio, padrote_id, metodo_deteccion_prenez, nota_prenez } =
    req.body;

  const ciclo = await CicloReproductivo.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  });
  if (!ciclo) {
    return res.status(404).json({ msg: "Registro de ciclo no encontrado." });
  }

  const fechaServicioDate = new Date(fecha_servicio);

  if (ciclo.fecha_celo && fechaServicioDate < new Date(ciclo.fecha_celo)) {
    return res.status(400).json({
      msg: "La fecha de servicio/monta no puede ser anterior a la fecha de celo.",
    });
  }

  const fechaProbableParto = new Date(fechaServicioDate);
  fechaProbableParto.setDate(fechaProbableParto.getDate() + 114);

  ciclo.estado = "Preñez";
  ciclo.fecha_servicio = fechaServicioDate;
  ciclo.fecha_probable_parto = fechaProbableParto;
  ciclo.padrote_id = padrote_id || null;
  ciclo.metodo_deteccion_prenez = metodo_deteccion_prenez || null;
  ciclo.nota_prenez = nota_prenez || null;

  await ciclo.save();

  res.status(200).json({
    msg: "Preñez confirmada exitosamente.",
    ciclo,
  });
});

/**
 * @description Editar un registro de preñez.
 * Recalcula la fecha probable de parto si cambia la fecha de servicio.
 */
export const editarPrenez = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;
  const { fecha_servicio, padrote_id, metodo_deteccion_prenez, nota_prenez } =
    req.body;

  const ciclo = await CicloReproductivo.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  });
  if (!ciclo) {
    return res.status(404).json({ msg: "Registro de preñez no encontrado." });
  }

  if (padrote_id !== undefined) ciclo.padrote_id = padrote_id;
  if (metodo_deteccion_prenez !== undefined)
    ciclo.metodo_deteccion_prenez = metodo_deteccion_prenez;
  if (nota_prenez !== undefined) ciclo.nota_prenez = nota_prenez;

  if (fecha_servicio) {
    const nuevaFechaServicio = new Date(fecha_servicio);
    ciclo.fecha_servicio = nuevaFechaServicio;

    const fechaProbable = new Date(nuevaFechaServicio);
    fechaProbable.setDate(fechaProbable.getDate() + 114);
    ciclo.fecha_probable_parto = fechaProbable;
  }

  await ciclo.save();

  res.status(200).json({
    msg: "Registro de preñez actualizado correctamente.",
    ciclo,
  });
});

/**
 * @description Confirmar nacimiento/parto para una preñez.
 * Registra lechones, valida totales y opcionalmente genera un nuevo Lote.
 */
export const confirmarNacimiento = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;
  const {
    fecha_parto,
    tipo_parto,
    lechones_vivos,
    lechones_muertos,
    machos,
    hembras,
    peso_promedio,
    nota_nacimiento,
    crear_lote_automatico = true,
  } = req.body;

  const ciclo = await CicloReproductivo.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  });
  if (!ciclo) {
    return res.status(404).json({ msg: "Registro de preñez no encontrado." });
  }

  const numMachos = Number(machos || 0);
  const numHembras = Number(hembras || 0);
  const numVivos = Number(lechones_vivos || 0);

  let tipoPartoFinal = tipo_parto;
  if (tipo_parto === "Natural") tipoPartoFinal = "Normal";

  if (numVivos !== numMachos + numHembras) {
    return res.status(400).json({
      msg: `La cantidad de lechones vivos (${numVivos}) debe ser exactamente la suma de machos (${numMachos}) y hembras (${numHembras}).`,
    });
  }

  ciclo.estado = "Nacimiento";
  ciclo.fecha_parto = new Date(fecha_parto);
  ciclo.tipo_parto = tipoPartoFinal;
  ciclo.lechones_vivos = numVivos;
  ciclo.lechones_muertos = Number(lechones_muertos || 0);
  ciclo.machos = numMachos;
  ciclo.hembras = numHembras;
  ciclo.peso_promedio = peso_promedio ? Number(peso_promedio) : null;
  ciclo.nota_nacimiento = nota_nacimiento || null;

  if (crear_lote_automatico && numVivos > 0) {
    const contadorLotes = await Lote.countDocuments({ finca_id: fincaId });
    const nuevoLote = await Lote.create({
      finca_id: fincaId,
      codigo_lote: `LOTE-CAMADA-${contadorLotes + 1}`,
      fecha: new Date(fecha_parto),
      cantidad_total: numVivos,
      cantidad_machos: numMachos,
      cantidad_hembras: numHembras,
      peso_promedio: peso_promedio ? Number(peso_promedio) : 0,
      nota: `Camada nacida el ${fecha_parto}. Generada automáticamente desde el módulo de reproducción.`,
    });
    ciclo.lote_creado_id = nuevoLote._id;
  }

  await ciclo.save();

  res.status(200).json({
    msg: "Nacimiento registrado exitosamente.",
    ciclo,
  });
});

/**
 * @description Editar un registro de nacimiento.
 */
export const editarNacimiento = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;
  const {
    fecha_parto,
    tipo_parto,
    lechones_vivos,
    lechones_muertos,
    machos,
    hembras,
    peso_promedio,
    nota_nacimiento,
  } = req.body;

  const ciclo = await CicloReproductivo.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  });
  if (!ciclo) {
    return res
      .status(404)
      .json({ msg: "Registro de nacimiento no encontrado." });
  }

  const numMachos = machos !== undefined ? Number(machos) : ciclo.machos;
  const numHembras = hembras !== undefined ? Number(hembras) : ciclo.hembras;
  const numVivos =
    lechones_vivos !== undefined
      ? Number(lechones_vivos)
      : ciclo.lechones_vivos;

  if (numVivos !== numMachos + numHembras) {
    return res.status(400).json({
      msg: `La cantidad de lechones vivos (${numVivos}) debe ser exactamente la suma de machos (${numMachos}) y hembras (${numHembras}).`,
    });
  }

  if (fecha_parto) ciclo.fecha_parto = new Date(fecha_parto);
  if (tipo_parto)
    ciclo.tipo_parto = tipo_parto === "Natural" ? "Normal" : tipo_parto;
  ciclo.lechones_vivos = numVivos;
  ciclo.machos = numMachos;
  ciclo.hembras = numHembras;
  if (lechones_muertos !== undefined)
    ciclo.lechones_muertos = Number(lechones_muertos);
  if (peso_promedio !== undefined) ciclo.peso_promedio = Number(peso_promedio);
  if (nota_nacimiento !== undefined) ciclo.nota_nacimiento = nota_nacimiento;

  await ciclo.save();

  res.status(200).json({
    msg: "Registro de nacimiento actualizado correctamente.",
    ciclo,
  });
});

/**
 * @description Obtener el detalle individual de un ciclo por ID.
 */
export const obtenerDetalleCiclo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const ciclo = await CicloReproductivo.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  })
    .populate("hembra_id", "codigo nombre raza")
    .populate("padrote_id", "codigo nombre raza");

  if (!ciclo) {
    return res
      .status(404)
      .json({ msg: "Registro de ciclo reproductivo no encontrado." });
  }

  res.status(200).json({ ciclo });
});

/**
 * @description Eliminar (Soft Delete) un registro de la etapa actual (Celo, Preñez o Nacimiento).
 */
export const eliminarCiclo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const cicloEliminado = await CicloReproductivo.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    { esta_eliminado: true, eliminado_at: new Date() },
    { new: true },
  );

  if (!cicloEliminado) {
    return res.status(404).json({ msg: "Registro no encontrado." });
  }

  res
    .status(200)
    .json({ msg: "Registro eliminado exitosamente del ciclo reproductivo." });
});

/**
 * @description Obtener listado de Celos paginado (10 en 10) con búsqueda por nombre/código de hembra.
 */
export const obtenerTablaCelos = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { page = 1, limit = 10, search = "" } = req.query;

  const query = { finca_id: fincaId, estado: "Celo", esta_eliminado: false };

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { fecha_celo: -1 },
    populate: { path: "hembra_id", select: "codigo nombre" },
  };

  if (search) {
    const hembrasCoincidentes = await Animal.find({
      finca_id: fincaId,
      esta_eliminado: false,
      $or: [
        { nombre: { $regex: search, $options: "i" } },
        { codigo: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    query.hembra_id = { $in: hembrasCoincidentes.map((h) => h._id) };
  }

  const resultado = await CicloReproductivo.paginate(query, options);

  const celosFormateados = resultado.docs.map((item) => ({
    id: item._id,
    codigo: item.hembra_id?.codigo || "-",
    nombre: item.hembra_id?.nombre || "-",
    fecha_celo: item.fecha_celo
      ? item.fecha_celo
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/")
      : "-",
    proximo_celo: item.proximo_celo_esperado
      ? item.proximo_celo_esperado
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/")
      : "-",
    notas: item.nota_celo || "Sin notas",
  }));

  res.status(200).json({
    celos: celosFormateados,
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
 * @description Obtener listado de Preñeces paginado (10 en 10) con filtro por método de detección y búsqueda.
 */
export const obtenerTablaPreneces = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { page = 1, limit = 10, search = "", metodo = "" } = req.query;

  const query = { finca_id: fincaId, estado: "Preñez", esta_eliminado: false };

  if (metodo && metodo !== "Todos" && metodo !== "Todos los metodos") {
    query.metodo_deteccion_prenez = metodo;
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { fecha_servicio: -1 },
    populate: [
      { path: "hembra_id", select: "codigo nombre" },
      { path: "padrote_id", select: "codigo nombre" },
    ],
  };

  if (search) {
    const hembrasCoincidentes = await Animal.find({
      finca_id: fincaId,
      esta_eliminado: false,
      $or: [
        { nombre: { $regex: search, $options: "i" } },
        { codigo: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    query.hembra_id = { $in: hembrasCoincidentes.map((h) => h._id) };
  }

  const resultado = await CicloReproductivo.paginate(query, options);

  const prenecesFormateadas = resultado.docs.map((item) => ({
    id: item._id,
    madre: `${item.hembra_id?.codigo || "-"} - ${item.hembra_id?.nombre || "-"}`,
    padrote: item.padrote_id
      ? `${item.padrote_id.codigo} - ${item.padrote_id.nombre}`
      : "Sin asignar",
    fecha_servicio: item.fecha_servicio
      ? item.fecha_servicio
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/")
      : "-",
    metodo_deteccion: item.metodo_deteccion_prenez || "-",
    parto_probable: item.fecha_probable_parto
      ? item.fecha_probable_parto
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/")
      : "-",
  }));

  res.status(200).json({
    preneces: prenecesFormateadas,
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
 * @description Obtener listado de Nacimientos paginado (10 en 10) con filtro por tipo de parto y búsqueda.
 */
export const obtenerTablaNacimientos = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { page = 1, limit = 10, search = "", tipo = "" } = req.query;

  const query = {
    finca_id: fincaId,
    estado: "Nacimiento",
    esta_eliminado: false,
  };

  if (tipo && tipo !== "Todos" && tipo !== "Todos los tipos") {
    query.tipo_parto = tipo;
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { fecha_parto: -1 },
    populate: [
      { path: "hembra_id", select: "codigo nombre" },
      { path: "padrote_id", select: "codigo nombre" },
    ],
  };

  if (search) {
    const hembrasCoincidentes = await Animal.find({
      finca_id: fincaId,
      esta_eliminado: false,
      $or: [
        { nombre: { $regex: search, $options: "i" } },
        { codigo: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    query.hembra_id = { $in: hembrasCoincidentes.map((h) => h._id) };
  }

  const resultado = await CicloReproductivo.paginate(query, options);

  const nacimientosFormateados = resultado.docs.map((item) => ({
    id: item._id,
    madre: `${item.hembra_id?.codigo || "-"} - ${item.hembra_id?.nombre || "-"}`,
    padrote: item.padrote_id
      ? `${item.padrote_id.codigo} - ${item.padrote_id.nombre}`
      : "Sin asignar",
    fecha_parto: item.fecha_parto
      ? item.fecha_parto
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/")
      : "-",
    tipo: item.tipo_parto || "-",
    vivos: item.lechones_vivos ?? 0,
    muertos: item.lechones_muertos ?? 0,
    m_h: `${item.machos ?? 0} / ${item.hembras ?? 0}`,
    peso_prom: `${item.peso_promedio ?? 0}kg`,
  }));

  res.status(200).json({
    nacimientos: nacimientosFormateados,
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
 * @description Obtener las estadísticas generales de reproducción para las tarjetas resumen.
 */
export const obtenerEstadisticasReproduccion = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;

  const [enCelo, prenadas, nacimientos, totalCiclos] = await Promise.all([
    CicloReproductivo.countDocuments({
      finca_id: fincaId,
      estado: "Celo",
      esta_eliminado: false,
    }),
    CicloReproductivo.countDocuments({
      finca_id: fincaId,
      estado: "Preñez",
      esta_eliminado: false,
    }),
    CicloReproductivo.countDocuments({
      finca_id: fincaId,
      estado: "Nacimiento",
      esta_eliminado: false,
    }),
    CicloReproductivo.countDocuments({
      finca_id: fincaId,
      esta_eliminado: false,
    }),
  ]);

  res.status(200).json({
    estadisticas: {
      en_celo: enCelo,
      prenadas: prenadas,
      nacimientos: nacimientos,
      total_ciclos: totalCiclos,
    },
  });
});