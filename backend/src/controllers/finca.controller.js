import Finca from "../models/finca.model.js";
import MiembroFinca from "../models/miembroFinca.model.js";
import Animal from "../models/animal.model.js";
import Lote from "../models/lote.model.js";
import Salud from "../models/salud.model.js";
import Finanzas from "../models/finanzas.model.js";
import { catchAsync } from "../middlewares/catch_async.middleware.js";

/**
 * @description Obtener los detalles de la finca actual para poblar el formulario "Mi Granja".
 */
export const obtenerFinca = catchAsync(async (req, res) => {
  const finca = req.finca;

  res.status(200).json({
    finca: {
      id: finca._id,
      nombre_finca: finca.nombre_finca,
      direccion_finca: finca.direccion_finca || "",
      tamanho_hectareas: finca.tamanho_hectareas || 0,
      telefono_finca: finca.telefono_finca || "",
      tasas_cambio: finca.tasas_cambio,
    },
  });
});

/**
 * @description Actualizar los datos de la finca desde el formulario.
 */
export const actualizarFinca = catchAsync(async (req, res) => {
  const { nombre_finca, direccion_finca, tamanho_hectareas, telefono_finca } =
    req.body;

  const fincaActualizada = await Finca.findByIdAndUpdate(
    req.finca._id,
    { nombre_finca, direccion_finca, tamanho_hectareas, telefono_finca },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    msg: "Datos de la finca guardados correctamente.",
    finca: fincaActualizada,
  });
});

/**
 * @description Eliminar una finca lógicamente (Soft Delete). Solo el dueño puede hacerlo.
 */
export const eliminarFinca = catchAsync(async (req, res) => {
  if (req.finca.propietario_id.toString() !== req.usuario._id.toString()) {
    return res.status(403).json({
      msg: "Acción denegada. Solo el creador original de la propiedad puede eliminarla del sistema.",
    });
  }

  await Finca.findByIdAndUpdate(
    req.finca._id,
    { esta_eliminado: true, eliminado_at: new Date() },
    { new: true },
  );

  await MiembroFinca.updateMany(
    { finca_id: req.finca._id },
    { esta_eliminado: true, eliminado_at: new Date() },
  );

  res.status(200).json({
    msg: "La finca y todos sus accesos han sido eliminados exitosamente.",
  });
});

/**
 * @description Actualizar las tasas de cambio de la finca (USD a COP / Bs a COP).
 */
export const actualizarTasasCambio = catchAsync(async (req, res) => {
  const { usd_a_cop, bs_a_cop } = req.body;
  const fincaId = req.finca._id;

  const nuevasTasas = {};
  if (usd_a_cop !== undefined) {
    if (usd_a_cop < 0)
      return res
        .status(400)
        .json({ msg: "La tasa USD a COP no puede ser negativa." });
    nuevasTasas["tasas_cambio.usd_a_cop"] = Number(usd_a_cop);
  }
  if (bs_a_cop !== undefined) {
    if (bs_a_cop < 0)
      return res
        .status(400)
        .json({ msg: "La tasa Bs a COP no puede ser negativa." });
    nuevasTasas["tasas_cambio.bs_a_cop"] = Number(bs_a_cop);
  }

  const fincaActualizada = await Finca.findByIdAndUpdate(
    fincaId,
    { $set: nuevasTasas },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    msg: "Tasas de cambio actualizadas correctamente.",
    tasas_cambio: fincaActualizada.tasas_cambio,
  });
});

/**
 * @description Obtener únicamente las tasas de cambio configuradas en la finca.
 */
export const obtenerTasasCambio = catchAsync(async (req, res) => {
  const finca = req.finca;

  res.status(200).json({
    tasas_cambio: finca.tasas_cambio || { usd_a_cop: null, bs_a_cop: null },
  });
});

/**
 * @description Obtener toda la información general para la pantalla de inicio (Dashboard).
 */

export const obtenerDashboardGeneral = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const tasas = req.finca.tasas_cambio || {};

  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();

  const fechaLimiteAlertas = new Date(ahora);
  fechaLimiteAlertas.setDate(ahora.getDate() + 4);

  const indivStats = await Animal.aggregate([
    { $match: { finca_id: fincaId, esta_eliminado: false } },
    { $group: { _id: "$sexo", count: { $sum: 1 } } },
  ]);
  let machosIndiv = 0;
  let hembrasIndiv = 0;
  indivStats.forEach((s) => {
    if (s._id === "Macho") machosIndiv = s.count;
    if (s._id === "Hembra") hembrasIndiv = s.count;
  });

  const loteStats = await Lote.aggregate([
    { $match: { finca_id: fincaId, esta_eliminado: false } },
    {
      $group: {
        _id: null,
        totalMachos: { $sum: "$cantidad_machos" },
        totalHembras: { $sum: "$cantidad_hembras" },
      },
    },
  ]);
  const machosLotes = loteStats[0]?.totalMachos || 0;
  const hembrasLotes = loteStats[0]?.totalHembras || 0;

  const totalMachos = machosIndiv + machosLotes;
  const totalHembras = hembrasIndiv + hembrasLotes;
  const totalAnimales = totalMachos + totalHembras;

  const totalAlertas = await Salud.countDocuments({
    finca_id: fincaId,
    esta_eliminado: false,
    estado: { $ne: "Completado" },
    fecha: { $lte: fechaLimiteAlertas },
  });

  const transacciones = await Finanzas.find({
    finca_id: fincaId,
    esta_eliminado: false,
  });
  let ingresosMes = 0;
  let gastosMes = 0;

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
    if (t.tipo_moneda === "USD") montoCOP *= tasas.usd_a_cop || 1;
    else if (t.tipo_moneda === "Bs") montoCOP *= tasas.bs_a_cop || 1;

    if (tMes === mesActual && tAnio === anioActual) {
      if (t.tipo_movimiento === "Ingreso") ingresosMes += montoCOP;
      if (t.tipo_movimiento === "Egreso") gastosMes += montoCOP;
    }

    const mesIndex = ultimos6Meses.findIndex(
      (m) => m.mesNum === tMes && m.anio === tAnio,
    );
    if (mesIndex !== -1) {
      if (t.tipo_movimiento === "Ingreso")
        ultimos6Meses[mesIndex].ingresos += montoCOP;
      if (t.tipo_movimiento === "Egreso")
        ultimos6Meses[mesIndex].gastos += montoCOP;
    }
  });

  const grafico6Meses = ultimos6Meses.map((m) => ({
    mes: m.mes,
    ingresos: m.ingresos,
    gastos: m.gastos,
  }));

  res.status(200).json({
    tarjetas: {
      animales_activos: totalAnimales,
      alertas_pendientes: totalAlertas,
      gastos_mes: `$${gastosMes.toLocaleString()} COP`,
      ingresos_mes: `$${ingresosMes.toLocaleString()} COP`,
    },
    distribucion_sexo: {
      machos: totalMachos,
      hembras: totalHembras,
    },
    ingresos_vs_gastos: grafico6Meses,
  });
});

/**
 * @description Obtener la lista paginada (de 5 en 5) de alertas de salud para el Dashboard.
 */
export const obtenerAlertasDashboard = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { page = 1, limit = 5 } = req.query;

  const ahora = new Date();
  const hoyInicio = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate(),
  );

  const limiteDias = new Date(hoyInicio);
  limiteDias.setDate(limiteDias.getDate() + 4);
  limiteDias.setHours(23, 59, 59, 999);

  const query = {
    finca_id: fincaId,
    esta_eliminado: false,
    estado: { $ne: "Completado" },
    fecha: { $lte: limiteDias },
  };

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { fecha: 1 },
    populate: [
      { path: "animal_id", select: "codigo" },
      { path: "lote_id", select: "codigo_lote" },
    ],
  };

  const resultado = await Salud.paginate(query, options);

  const alertasFormateadas = resultado.docs.map((t) => {
    const fechaTarea = new Date(t.fecha);
    const fechaTareaInicio = new Date(
      fechaTarea.getFullYear(),
      fechaTarea.getMonth(),
      fechaTarea.getDate(),
    );

    const diffTiempo = fechaTareaInicio.getTime() - hoyInicio.getTime();
    const diffDias = Math.ceil(diffTiempo / (1000 * 3600 * 24));

    let estadoRelativo = "";
    if (diffDias < 0) estadoRelativo = "Vencido";
    else if (diffDias === 0) estadoRelativo = "Hoy";
    else if (diffDias === 1) estadoRelativo = "Mañana";
    else estadoRelativo = `En ${diffDias} días`;

    const objetivo = t.lote_id
      ? `Lote ${t.lote_id.codigo_lote}`
      : t.animal_id
        ? `Animal ${t.animal_id.codigo}`
        : "General";

    return {
      id: t._id,
      titulo: `${t.tipo} - ${t.producto || t.nota || "Pendiente"}`,
      subtitulo: objetivo,
      fecha: fechaTarea.toISOString().split("T")[0],
      estado_relativo: estadoRelativo,
    };
  });

  res.status(200).json({
    alertas: alertasFormateadas,
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
