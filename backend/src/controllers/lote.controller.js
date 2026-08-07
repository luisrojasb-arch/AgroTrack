import Lote from "../models/lote.model.js";
import Salud from "../models/salud.model.js";
import { catchAsync } from "../middlewares/catch_async.middleware.js";

/**
 * @description Obtener la lista de lotes con paginación y búsqueda.
 */
export const obtenerLotes = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { page = 1, limit = 10, search = "" } = req.query;

  const query = {
    finca_id: fincaId,
    esta_eliminado: false,
  };

  if (search) {
    query.codigo_lote = { $regex: search, $options: "i" };
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: [
      { path: "madre_id", select: "codigo nombre" },
      { path: "padre_id", select: "codigo nombre" },
    ],
  };

  const resultado = await Lote.paginate(query, options);

  res.status(200).json({
    lotes: resultado.docs,
    paginacion: {
      totalRegistros: resultado.totalDocs,
      totalPaginas: resultado.totalPages,
      paginaActual: resultado.page,
      limite: resultado.limit,
      tienePaginaAnterior: resultado.hasPrevPage,
      tienePaginaSiguiente: resultado.hasNextPage,
      paginaAnterior: resultado.prevPage,
      paginaSiguiente: resultado.nextPage,
    },
  });
});

/**
 * @description Registrar un nuevo lote y generar su cronograma sanitario.
 */
export const registrarLote = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { codigo_lote, fecha } = req.body;

  const existeLote = await Lote.findOne({
    codigo_lote,
    finca_id: fincaId,
    esta_eliminado: false,
  });

  if (existeLote) {
    return res
      .status(400)
      .json({ msg: "Ya existe un lote con ese código en esta finca." });
  }

  const nuevoLote = await Lote.create({
    ...req.body,
    finca_id: fincaId,
  });

  const tareasBase = [
    {
      dia: 2,
      tipo: "Descolmille",
      manejo: "Descolmillado y descola",
      producto: "Hierro dextrano + anticoccidial",
    },
    { dia: 5, tipo: "Vacuna", manejo: "Vacuna edemas", producto: "Bepure" },
    {
      dia: 12,
      tipo: "Tratamiento",
      manejo: "Vitaminas",
      producto: "Complejo B",
    },
    {
      dia: 15,
      tipo: "Castración",
      manejo: "Castración de machos",
      producto: "Castración quirúrgica",
    },
    {
      dia: 21,
      tipo: "Tratamiento",
      manejo: "Vitaminas",
      producto: "Vitamina AD3E",
    },
    {
      dia: 35,
      tipo: "Desparasitación",
      manejo: "Destete y desparasitación",
      producto: "Desparasitante oral",
    },
    {
      dia: 40,
      tipo: "Vacuna",
      manejo: "Vacuna cólera porcino",
      producto: "Vacuna PPC (obligatoria para salida)",
    },
  ];

  const fechaBase = new Date(fecha || Date.now());
  const registrosSalud = tareasBase.map((tarea) => {
    const fechaProgramada = new Date(fechaBase);
    fechaProgramada.setDate(fechaProgramada.getDate() + tarea.dia);

    return {
      finca_id: fincaId,
      lote_id: nuevoLote._id,
      tipo: tarea.tipo,
      producto: tarea.producto,
      fecha: fechaProgramada,
      nota: tarea.manejo,
    };
  });

  await Salud.insertMany(registrosSalud);

  res.status(201).json({
    msg: "Lote registrado y cronograma sanitario generado exitosamente.",
    lote: nuevoLote,
  });
});

/**
 * @description Obtener los detalles de un lote junto con su cronograma de salud.
 */
export const obtenerDetalleLote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const lote = await Lote.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  })
    .populate("madre_id", "codigo nombre")
    .populate("padre_id", "codigo nombre");

  if (!lote) {
    return res.status(404).json({ msg: "Lote no encontrado." });
  }

  const cronograma_sanitario = await Salud.find({
    lote_id: lote._id,
    esta_eliminado: false,
  }).sort({ fecha: 1 });

  res.status(200).json({
    datos_basicos: lote,
    cronograma_sanitario,
  });
});

/**
 * @description Editar la información del lote.
 */
export const editarLote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  // Ajustado a codigo_lote
  if (req.body.codigo_lote) {
    const existeLote = await Lote.findOne({
      codigo_lote: req.body.codigo_lote,
      finca_id: fincaId,
      _id: { $ne: id },
      esta_eliminado: false,
    });
    if (existeLote) {
      return res
        .status(400)
        .json({ msg: "El código de lote ya pertenece a otro registro." });
    }
  }

  const loteActualizado = await Lote.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    req.body,
    { new: true, runValidators: true },
  );

  if (!loteActualizado) {
    return res.status(404).json({ msg: "Lote no encontrado." });
  }

  res.status(200).json({
    msg: "Lote actualizado correctamente.",
    lote: loteActualizado,
  });
});

/**
 * @description Eliminar un lote y sus registros de salud (Soft Delete).
 */
export const eliminarLote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const loteEliminado = await Lote.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    { esta_eliminado: true, eliminado_at: new Date() },
    { new: true },
  );

  if (!loteEliminado) {
    return res.status(404).json({ msg: "Lote no encontrado." });
  }

  await Salud.updateMany(
    { lote_id: id, finca_id: fincaId, esta_eliminado: false },
    { esta_eliminado: true, eliminado_at: new Date() },
  );

  res
    .status(200)
    .json({ msg: "El lote y su cronograma sanitario han sido eliminados." });
});
