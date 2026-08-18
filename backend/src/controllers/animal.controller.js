import Animal from "../models/animal.model.js";
import CicloReproductivo from "../models/reproduccion.model.js";
import Lote from "../models/lote.model.js";
import Finanzas from "../models/finanzas.model.js";
import { catchAsync } from "../middlewares/catch_async.middleware.js";

/**
 * @description Registrar un nuevo animal en la finca.
 */
export const registrarAnimal = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;

  const existeCodigo = await Animal.findOne({
    codigo: req.body.codigo,
    finca_id: fincaId,
    esta_eliminado: false,
  });

  if (existeCodigo) {
    return res
      .status(400)
      .json({ msg: "Ya existe un animal con ese código en esta finca." });
  }

  const nuevoAnimal = await Animal.create({
    ...req.body,
    finca_id: fincaId,
  });

  res.status(201).json({
    msg: "Animal registrado exitosamente.",
    animal: nuevoAnimal,
  });
});

/**
 * @description Obtener los detalles de un animal, incluyendo sus métricas reproductivas.
 */
export const obtenerDetalleAnimal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const animal = await Animal.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  })
    .populate("madre_id", "codigo nombre")
    .populate("padre_id", "codigo nombre");

  if (!animal) {
    return res.status(404).json({ msg: "Animal no encontrado." });
  }

  const respuesta = {
    datos_basicos: animal,
    estadisticas_reproductivas: null,
    historial_ciclos: [],
  };

  if (animal.sexo === "Hembra") {
    const ciclos = await CicloReproductivo.find({
      hembra_id: animal._id,
      esta_eliminado: false,
    })
      .populate("padrote_id", "codigo nombre")
      .sort({ fecha_celo: -1 });

    const partos = ciclos.filter((c) => c.estado === "Nacimiento");
    const total_ciclos = ciclos.length;
    const total_partos = partos.length;
    const lechones_vivos = partos.reduce(
      (acc, c) => acc + (c.lechones_vivos || 0),
      0,
    );
    const lechones_muertos = partos.reduce(
      (acc, c) => acc + (c.lechones_muertos || 0),
      0,
    );
    const total_nacidos = lechones_vivos + lechones_muertos;

    const camada_promedio =
      total_partos > 0 ? (lechones_vivos / total_partos).toFixed(1) : 0;
    const supervivencia =
      total_nacidos > 0
        ? Math.round((lechones_vivos / total_nacidos) * 100)
        : 0;

    const partos_distocicos = partos.filter(
      (c) => c.tipo_parto === "Distócico",
    ).length;

    respuesta.estadisticas_reproductivas = {
      total_ciclos,
      partos: total_partos,
      lechones_vivos,
      lechones_muertos,
      camada_promedio,
      partos_distocicos,
      supervivencia: `${supervivencia}%`,
      utilidad_reproductiva: "0%",
    };

    respuesta.historial_ciclos = ciclos.map((c) => ({
      id: c._id,
      estado: c.estado,
      celo: c.fecha_celo,
      servicio: c.fecha_servicio,
      parto: c.fecha_parto,
      tipo: c.tipo_parto || "-",
      vivos: c.lechones_vivos || "-",
      muertos: c.lechones_muertos || "-",
      padrote: c.padrote_id ? c.padrote_id.nombre || c.padrote_id.codigo : "-",
    }));
  }

  res.status(200).json(respuesta);
});

/**
 * @description Editar la información básica del animal.
 */
export const editarAnimal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const animalActual = await Animal.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  });

  if (!animalActual) {
    return res.status(404).json({ msg: "Animal no encontrado." });
  }

  if (animalActual.estado !== "Vivo") {
    return res.status(400).json({
      msg: `No se puede editar un animal que se encuentra en estado: ${animalActual.estado}.`,
    });
  }

  if (req.body.codigo && req.body.codigo !== animalActual.codigo) {
    const existeCodigo = await Animal.findOne({
      codigo: req.body.codigo,
      finca_id: fincaId,
      esta_eliminado: false,
    });
    if (existeCodigo) {
      return res
        .status(400)
        .json({ msg: "El código ingresado ya pertenece a otro animal." });
    }
  }

  const animalActualizado = await Animal.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    msg: "Animal actualizado correctamente.",
    animal: animalActualizado,
  });
});

/**
 * @description Eliminar un animal (Soft Delete).
 */
export const eliminarAnimal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;

  const animalEliminado = await Animal.findOneAndUpdate(
    { _id: id, finca_id: fincaId, esta_eliminado: false },
    { esta_eliminado: true, eliminado_at: new Date() },
    { new: true },
  );

  if (!animalEliminado) {
    return res.status(404).json({ msg: "Animal no encontrado." });
  }

  res.status(200).json({ msg: "El animal ha sido eliminado exitosamente." });
});

/**
 * @description Obtener la lista de animales de la finca con paginación y filtros.
 */
export const obtenerAnimales = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;

  const { page = 1, limit = 10, search = "", sexo = "" } = req.query;

  const query = {
    finca_id: fincaId,
    esta_eliminado: false,
  };

  if (sexo && sexo !== "Todos los sexos" && sexo !== "Todos") {
    query.sexo = sexo;
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
    select: "codigo nombre sexo estado raza fecha_nacimiento peso cantidad_pezones",
  };

  const resultado = await Animal.paginate(query, options);

  res.status(200).json({
    animales: resultado.docs,
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
 * @description Obtener estadísticas generales de animales sumando individuales y lotes.
 */
export const obtenerEstadisticasAnimales = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;

  const [totalIndiv, hembrasIndiv, machosIndiv] = await Promise.all([
    Animal.countDocuments({ finca_id: fincaId, esta_eliminado: false }),
    Animal.countDocuments({
      finca_id: fincaId,
      sexo: "Hembra",
      esta_eliminado: false,
    }),
    Animal.countDocuments({
      finca_id: fincaId,
      sexo: "Macho",
      esta_eliminado: false,
    }),
  ]);

  const agregacionLotes = await Lote.aggregate([
    { $match: { finca_id: fincaId, esta_eliminado: false } },
    {
      $group: {
        _id: null,
        total_animales_lote: { $sum: "$cantidad_total" },
        total_hembras_lote: { $sum: "$cantidad_hembras" },
        total_machos_lote: { $sum: "$cantidad_machos" },
        total_lotes: { $sum: 1 },
      },
    },
  ]);

  const statsLotes = agregacionLotes[0] || {
    total_animales_lote: 0,
    total_hembras_lote: 0,
    total_machos_lote: 0,
    total_lotes: 0,
  };

  res.status(200).json({
    estadisticas: {
      total_animales: totalIndiv + statsLotes.total_animales_lote,
      hembras: hembrasIndiv + statsLotes.total_hembras_lote,
      machos: machosIndiv + statsLotes.total_machos_lote,
      lotes: statsLotes.total_lotes,

      desglose: {
        animales_individuales: totalIndiv,
        animales_en_lotes: statsLotes.total_animales_lote,
      },
    },
  });
});

/**
 * @description Registrar la situación de un animal (Vendido o Muerto) y generar finanza automáticamente.
 */
export const registrarSituacionAnimal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const fincaId = req.finca._id;
  const { estado, fecha, nota, finanza, causa_muerte } = req.body;

  const animal = await Animal.findOne({
    _id: id,
    finca_id: fincaId,
    esta_eliminado: false,
  });

  if (!animal) {
    return res.status(404).json({ msg: "Animal no encontrado." });
  }

  if (animal.estado !== "Vivo") {
    return res.status(400).json({
      msg: `Este animal ya se encuentra registrado como ${animal.estado} y no admite nuevas situaciones.`,
    });
  }

  let notaActualizada = animal.nota || "";
  const separador = notaActualizada ? "\n\n" : "";

  let detalleNota = `[Situación: ${estado} - Fecha: ${fecha}]`;
  if (estado === "Muerto" && causa_muerte) {
    detalleNota += `\nCausa: ${causa_muerte}`;
  }
  if (nota) {
    detalleNota += `\nDetalles: ${nota}`;
  }

  animal.estado = estado;
  animal.nota = notaActualizada + separador + detalleNota;
  await animal.save();

  if (estado === "Vendido" && finanza) {
    await Finanzas.create({
      finca_id: fincaId,
      concepto: finanza.concepto,
      monto: finanza.monto,
      tipo_moneda: "COP",
      tipo_movimiento: finanza.tipo_movimiento,
      categoria: finanza.categoria,
      metodo_pago: finanza.metodo_pago,
      fecha_pago: finanza.fecha_pago,
    });
  }

  res.status(200).json({
    msg: `El animal ha sido marcado como ${estado} exitosamente.`,
    animal,
  });
});
