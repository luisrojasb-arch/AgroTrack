import Seleccion from "../models/seleccion.model.js";
import Animal from "../models/animal.model.js";
import { catchAsync } from "../middlewares/catch_async.middleware.js";

/**
 * @description Obtener la lista de grupos de selección con paginación.
 */
export const obtenerSelecciones = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { page = 1, limit = 10, search = "" } = req.query;

  const query = {
    finca_id: fincaId,
    esta_eliminado: false,
  };

  if (search) {
    query.codigo_grupo = { $regex: search, $options: "i" };
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: {
      path: "lote_origen_id",
      select: "codigo_lote madre_id padre_id cantidad_total",
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
    },
  });
});

/**
 * @description Registrar un nuevo grupo de selección con su lista de animales.
 */
export const registrarSeleccion = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { lote_origen_id, animales } = req.body;

  if (!animales || animales.length === 0) {
    return res
      .status(400)
      .json({ msg: "Debe incluir al menos un animal en la selección." });
  }

  const codigo_grupo = `SEL-${Date.now().toString().slice(-6)}`;
  const codigosAnimales = animales.map((a) => a.codigo);
  const existenOficiales = await Animal.find({
    codigo: { $in: codigosAnimales },
    finca_id: fincaId,
    esta_eliminado: false,
  });

  if (existenOficiales.length > 0) {
    const repetidos = existenOficiales.map((a) => a.codigo).join(", ");
    return res.status(400).json({
      msg: `Los siguientes códigos ya existen en el inventario oficial: ${repetidos}`,
    });
  }

  const animalesProcesados = animales.map((animal) => ({
    ...animal,
    peso_inicial: Number(animal.peso) || 0,
    historial_pesos: animal.peso
      ? [{ peso: Number(animal.peso), fecha: Date.now() }]
      : [],
  }));

  const nuevoGrupo = await Seleccion.create({
    finca_id: fincaId,
    lote_origen_id,
    codigo_grupo,
    animales: animalesProcesados,
  });

  res.status(201).json({
    msg: "Grupo de selección registrado exitosamente.",
    seleccion: nuevoGrupo,
  });
});

/**
 * @description Obtener los detalles de un grupo de selección (incluye todos sus animales).
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
    return res.status(404).json({ msg: "Grupo de selección no encontrado." });
  }

  res.status(200).json({
    datos_basicos: seleccion,
    animales: seleccion.animales,
  });
});

/**
 * @description Agregar un nuevo peso al historial de un animal específico dentro del grupo.
 */
export const registrarPeso = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;
  const { animal_id, peso } = req.body;

  if (peso === undefined || peso < 0 || !animal_id) {
    return res
      .status(400)
      .json({ msg: "Debe proporcionar un peso válido y el ID del animal." });
  }

  const grupo = await Seleccion.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  });
  if (!grupo) return res.status(404).json({ msg: "Grupo no encontrado." });

  const animal = grupo.animales.id(animal_id);
  if (!animal)
    return res
      .status(404)
      .json({ msg: "Animal no encontrado dentro del grupo." });

  animal.historial_pesos.push({ peso: Number(peso), fecha: Date.now() });
  await grupo.save();

  res.status(200).json({
    msg: "Nuevo peso registrado correctamente.",
    animal_actualizado: animal,
  });
});

/**
 * @description Editar los datos de un grupo (Reemplaza la lista de animales).
 */
export const editarSeleccion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const seleccionActualizada = await Seleccion.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    req.body,
    { new: true, runValidators: true },
  );

  if (!seleccionActualizada) {
    return res.status(404).json({ msg: "Grupo no encontrado." });
  }

  res.status(200).json({
    msg: "Datos actualizados correctamente.",
    seleccion: seleccionActualizada,
  });
});

/**
 * @description Eliminar el grupo completo (Soft Delete).
 */
export const eliminarSeleccion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const seleccionEliminada = await Seleccion.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    { esta_eliminado: true, eliminado_at: new Date() },
    { new: true },
  );

  if (!seleccionEliminada)
    return res.status(404).json({ msg: "Grupo no encontrado." });

  res.status(200).json({ msg: "El grupo de selección ha sido eliminado." });
});

/**
 * @description Aprobar a una hembra específica dentro del grupo (La convierte en Animal oficial).
 */
export const aprobarSeleccion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;
  const { animal_id } = req.body;

  if (!animal_id)
    return res
      .status(400)
      .json({ msg: "Debe proporcionar el ID del animal a aprobar." });

  const grupo = await Seleccion.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  }).populate("lote_origen_id");
  if (!grupo) return res.status(404).json({ msg: "Grupo no encontrado." });

  const animalEvaluado = grupo.animales.id(animal_id);
  if (!animalEvaluado)
    return res.status(404).json({ msg: "Animal no encontrado." });
  if (animalEvaluado.estado_evaluacion !== "En Evaluación") {
    return res
      .status(400)
      .json({ msg: "Este animal ya ha sido evaluado previamente." });
  }

  const pesoFinal =
    animalEvaluado.historial_pesos.length > 0
      ? animalEvaluado.historial_pesos[
          animalEvaluado.historial_pesos.length - 1
        ].peso
      : animalEvaluado.peso_inicial;

  const nuevaMadre = await Animal.create({
    finca_id: fincaId,
    codigo: animalEvaluado.codigo,
    nombre: animalEvaluado.nombre,
    sexo: "Hembra",
    estado: "Vivo",
    raza: animalEvaluado.raza,
    peso: pesoFinal,
    fecha_nacimiento: animalEvaluado.fecha_nacimiento,
    cantidad_pezones: animalEvaluado.cantidad_pezones,
    madre_id: grupo.lote_origen_id?.madre_id || null,
    padre_id: grupo.lote_origen_id?.padre_id || null,
    nota: `Proveniente de Selección. Lote Origen: ${grupo.lote_origen_id?.codigo_lote || "N/A"}. Patas D: ${animalEvaluado.patas_delanteras}. Patas T: ${animalEvaluado.patas_traseras}.`,
  });

  animalEvaluado.estado_evaluacion = "Seleccionada";
  await grupo.save();

  res.status(200).json({
    msg: `¡${animalEvaluado.codigo} seleccionada con éxito! Agregada a reproductoras.`,
    animal: nuevaMadre,
  });
});
