import Seleccion from "../models/seleccion.model.js";
import Animal from "../models/animal.model.js";
import Lote from "../models/lote.model.js";
import { catchAsync } from "../middlewares/catch_async.middleware.js";

/**
 * @description Obtener la lista de animales en selección con paginación y filtros.
 */
export const obtenerSelecciones = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const {
    page = 1,
    limit = 10,
    search = "",
    estado = "En Evaluación",
  } = req.query;

  const query = {
    finca_id: fincaId,
    esta_eliminado: false,
  };

  if (estado && estado !== "Todos") {
    query.estado_evaluacion = estado;
  }

  if (search) {
    query.$or = [
      { codigo: { $regex: search, $options: "i" } },
      { nombre: { $regex: search, $options: "i" } },
    ];
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: {
      path: "lote_origen_id",
      select: "codigo_lote madre_id padre_id",
      populate: [
        { path: "madre_id", select: "codigo nombre" },
        { path: "padre_id", select: "codigo nombre" },
      ],
    },
  };

  const resultado = await Seleccion.paginate(query, options);

  res.status(200).json({
    selecciones: resultado.docs,
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
 * @description Registrar una hembra en evaluación desde un lote.
 */
export const registrarSeleccion = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { codigo, peso, ...restData } = req.body;

  const existeEnSeleccion = await Seleccion.findOne({
    codigo,
    finca_id: fincaId,
    esta_eliminado: false,
  });
  const existeEnAnimal = await Animal.findOne({
    codigo,
    finca_id: fincaId,
    esta_eliminado: false,
  });

  if (existeEnSeleccion || existeEnAnimal) {
    return res
      .status(400)
      .json({
        msg: "Ya existe un animal o prospecto con ese código en esta finca.",
      });
  }

  const nuevaSeleccion = await Seleccion.create({
    ...restData,
    codigo,
    finca_id: fincaId,
    historial_pesos: peso ? [{ peso: Number(peso), fecha: Date.now() }] : [],
  });

  res.status(201).json({
    msg: "Prospecto registrado en selección exitosamente.",
    seleccion: nuevaSeleccion,
  });
});

/**
 * @description Obtener los detalles de la selección y su historial de pesos.
 */
export const obtenerDetalleSeleccion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const seleccion = await Seleccion.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  }).populate("lote_origen_id", "codigo_lote cantidad_total fecha");

  if (!seleccion) {
    return res
      .status(404)
      .json({ msg: "Registro de selección no encontrado." });
  }

  const pesoActual =
    seleccion.historial_pesos.length > 0
      ? seleccion.historial_pesos[seleccion.historial_pesos.length - 1].peso
      : 0;

  res.status(200).json({
    datos_basicos: seleccion,
    peso_actual: pesoActual,
    historial_pesos: seleccion.historial_pesos,
  });
});

/**
 * @description Agregar un nuevo peso al historial (Modal: Registrar Peso Nuevo).
 */
export const registrarPeso = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;
  const { peso } = req.body;

  if (peso === undefined || peso < 0) {
    return res.status(400).json({ msg: "Debe proporcionar un peso válido." });
  }

  const seleccionActualizada = await Seleccion.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    { $push: { historial_pesos: { peso: Number(peso), fecha: Date.now() } } },
    { new: true, runValidators: true },
  );

  if (!seleccionActualizada) {
    return res
      .status(404)
      .json({ msg: "Registro de selección no encontrado." });
  }

  res.status(200).json({
    msg: "Nuevo peso registrado correctamente.",
    peso_actual: peso,
    historial_pesos: seleccionActualizada.historial_pesos,
  });
});

/**
 * @description Editar los datos básicos de la evaluación.
 */
export const editarSeleccion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  if (req.body.codigo) {
    const existeCodigo = await Seleccion.findOne({
      codigo: req.body.codigo,
      finca_id: fincaId,
      _id: { $ne: id },
      esta_eliminado: false,
    });
    if (existeCodigo) {
      return res
        .status(400)
        .json({
          msg: "El código ingresado ya pertenece a otro registro en evaluación.",
        });
    }
  }

  const seleccionActualizada = await Seleccion.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    req.body,
    { new: true, runValidators: true },
  );

  if (!seleccionActualizada) {
    return res
      .status(404)
      .json({ msg: "Registro de selección no encontrado." });
  }

  res.status(200).json({
    msg: "Datos actualizados correctamente.",
    seleccion: seleccionActualizada,
  });
});

/**
 * @description Eliminar la selección (Soft Delete).
 */
export const eliminarSeleccion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const seleccionEliminada = await Seleccion.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    { esta_eliminado: true, eliminado_at: new Date() },
    { new: true },
  );

  if (!seleccionEliminada) {
    return res.status(404).json({ msg: "Registro no encontrado." });
  }

  res.status(200).json({ msg: "El registro de selección ha sido eliminado." });
});

/**
 * @description Aprobar a la hembra (La convierte en un Animal oficial).
 */
export const aprobarSeleccion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  // 1. Buscamos a la hembra en evaluación
  const seleccion = await Seleccion.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
    estado_evaluacion: "En Evaluación",
  }).populate("lote_origen_id");

  if (!seleccion) {
    return res
      .status(404)
      .json({
        msg: "Prospecto no encontrado o ya ha sido evaluado previamente.",
      });
  }

  const pesoFinal =
    seleccion.historial_pesos.length > 0
      ? seleccion.historial_pesos[seleccion.historial_pesos.length - 1].peso
      : 0;

  const nuevaMadre = await Animal.create({
    finca_id: fincaId,
    codigo: seleccion.codigo,
    nombre: seleccion.nombre,
    sexo: "Hembra",
    estado: "Vivo",
    raza: seleccion.raza,
    peso: pesoFinal,
    fecha_nacimiento: seleccion.fecha_nacimiento,
    cantidad_pezones: seleccion.cantidad_pezones,
    madre_id: seleccion.lote_origen_id?.madre_id || null,
    padre_id: seleccion.lote_origen_id?.padre_id || null,
    nota: `Proveniente del proceso de selección. Lote Origen: ${seleccion.lote_origen_id?.codigo_lote || "N/A"}. Patas Delanteras: ${seleccion.patas_delanteras}. Patas Traseras: ${seleccion.patas_traseras}.`,
  });

  seleccion.estado_evaluacion = "Seleccionada";
  await seleccion.save();

  res.status(200).json({
    msg: "¡Hembra seleccionada con éxito! Ha sido agregada a tu inventario de animales reproductores.",
    animal: nuevaMadre,
  });
});
