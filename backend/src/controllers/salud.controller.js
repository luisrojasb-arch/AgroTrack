import Salud from "../models/salud.model.js";
import Animal from "../models/animal.model.js";
import Lote from "../models/lote.model.js";
import { catchAsync } from "../middlewares/catch_async.middleware.js";

/**
 * @description Obtener la lista de tareas de salud (Paginadas de 5 en 5).
 * Se puede filtrar pasando ?animal_id=... o ?lote_id=... en la URL.
 */
export const obtenerTareasSalud = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { page = 1, limit = 5, animal_id, lote_id } = req.query;

  const query = {
    finca_id: fincaId,
    esta_eliminado: false,
  };

  if (animal_id) query.animal_id = animal_id;
  if (lote_id) query.lote_id = lote_id;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { fecha: -1 },
    populate: [
      { path: "animal_id", select: "codigo nombre" },
      { path: "lote_id", select: "codigo_lote" },
    ],
  };

  const resultado = await Salud.paginate(query, options);

  res.status(200).json({
    tareas: resultado.docs,
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
 * @description Registrar un nuevo evento de salud (Vacuna, Tratamiento, etc.).
 */
export const registrarSalud = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;

  const nuevaTarea = await Salud.create({
    ...req.body,
    finca_id: fincaId,
  });

  res.status(201).json({
    msg: "Evento de salud registrado exitosamente.",
    tarea: nuevaTarea,
  });
});

/**
 * @description Obtener los detalles de una tarea específica (Modal: Detalles de Salud).
 */
export const obtenerDetalleSalud = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const tarea = await Salud.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  })
    .populate("animal_id", "codigo nombre")
    .populate("lote_id", "codigo_lote");

  if (!tarea) {
    return res.status(404).json({ msg: "Evento de salud no encontrado." });
  }

  res.status(200).json({ tarea });
});

/**
 * @description Editar un evento de salud (Modal: Editar Evento de Salud).
 */
export const editarSalud = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const tareaActualizada = await Salud.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    req.body,
    { new: true, runValidators: true },
  );

  if (!tareaActualizada) {
    return res.status(404).json({ msg: "Evento de salud no encontrado." });
  }

  res.status(200).json({
    msg: "Evento de salud actualizado correctamente.",
    tarea: tareaActualizada,
  });
});

/**
 * @description Eliminar una tarea de salud (Soft Delete).
 */
export const eliminarSalud = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const tareaEliminada = await Salud.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    { esta_eliminado: true, eliminado_at: new Date() },
    { new: true },
  );

  if (!tareaEliminada) {
    return res.status(404).json({ msg: "Evento de salud no encontrado." });
  }

  res.status(200).json({ msg: "La tarea ha sido eliminada exitosamente." });
});

/**
 * @description Obtener el resumen de salud para la tabla principal de LOTES.
 * Calcula el progreso (ej. 0/9) y la próxima tarea pendiente.
 */
export const obtenerResumenSaludLotes = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { page = 1, limit = 10, search = "" } = req.query;

  const query = { finca_id: fincaId, esta_eliminado: false };

  if (search) {
    query.codigo_lote = { $regex: search, $options: "i" };
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
  };

  const resultado = await Lote.paginate(query, options);
  const ahora = new Date();

  const lotesConResumen = await Promise.all(
    resultado.docs.map(async (lote) => {
      const tareas = await Salud.find({
        lote_id: lote._id,
        esta_eliminado: false,
      }).sort({ fecha: 1 });

      const total = tareas.length;
      const completadas = tareas.filter((t) => t.fecha <= ahora);
      const pendientes = tareas.filter((t) => t.fecha > ahora);

      const proxima = pendientes.length > 0 ? pendientes[0] : null;

      return {
        id: lote._id,
        codigo: lote.codigo_lote,
        progreso: `${completadas.length}/${total}`,
        proxima_tarea: proxima
          ? proxima.tipo
          : total > 0
            ? "Completado"
            : "Sin cronograma",
        fecha: proxima ? proxima.fecha : null,
        estado: proxima ? "Próximo" : total > 0 ? "Completado" : "N/A",
      };
    }),
  );

  res.status(200).json({
    registros: lotesConResumen,
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
 * @description Obtener el resumen de salud para la tabla principal de ANIMALES.
 * Muestra la tarea más inminente (o la última aplicada) por animal.
 */
export const obtenerResumenSaludAnimales = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { page = 1, limit = 10, search = "" } = req.query;

  const query = { finca_id: fincaId, esta_eliminado: false };

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
  };

  const resultado = await Animal.paginate(query, options);
  const ahora = new Date();

  const animalesConResumen = await Promise.all(
    resultado.docs.map(async (animal) => {
      const tareas = await Salud.find({
        animal_id: animal._id,
        esta_eliminado: false,
      }).sort({ fecha: 1 });

      const completadas = tareas.filter((t) => t.fecha <= ahora);
      const pendientes = tareas.filter((t) => t.fecha > ahora);

      const proxima = pendientes.length > 0 ? pendientes[0] : null;
      const ultima =
        completadas.length > 0 ? completadas[completadas.length - 1] : null;
      const tareaMostrar = proxima || ultima;

      return {
        id: animal._id,
        codigo: animal.codigo,
        nombre: animal.nombre || "-",
        fecha: tareaMostrar ? tareaMostrar.fecha : null,
        tipo: tareaMostrar ? tareaMostrar.tipo : "-",
        producto: tareaMostrar ? tareaMostrar.producto || "-" : "-",
        dosis: tareaMostrar ? tareaMostrar.dosis || "-" : "-",
        estado: proxima ? "Pendiente" : ultima ? "Aplicado" : "Sin registros",
      };
    }),
  );

  res.status(200).json({
    registros: animalesConResumen,
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
 * @description Obtener estadísticas generales de salud (Tarjetas resumen).
 */
export const obtenerEstadisticasSalud = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const ahora = new Date();

  const tareas = await Salud.find({ finca_id: fincaId, esta_eliminado: false });

  let pendientes = 0;
  let vencidos = 0;
  let completados = 0;
  const total = tareas.length;

  tareas.forEach((tarea) => {
    if (tarea.estado === "Completado") {
      completados++;
    } else {
      const fechaTarea = new Date(tarea.fecha);

      if (fechaTarea < ahora) {
        vencidos++;
      } else {
        pendientes++;
      }
    }
  });

  res.status(200).json({
    estadisticas: {
      pendientes,
      vencidos,
      completados,
      total,
    },
  });
});
