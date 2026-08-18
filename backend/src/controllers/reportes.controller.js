import Animal from "../models/animal.model.js";
import CicloReproductivo from "../models/reproduccion.model.js";
import Lote from "../models/lote.model.js";
import Finanzas from "../models/finanzas.model.js";
import Salud from "../models/salud.model.js";
import Inventario from "../models/inventario.model.js";
import { catchAsync } from "../middlewares/catch_async.middleware.js";

export const generarReporteProduccion = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { fecha_inicio, fecha_fin } = req.query;

  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);

  const animalesNacidos = await Animal.find({
    finca_id: fincaId,
    fecha_nacimiento: { $gte: inicio, $lte: fin },
    esta_eliminado: false,
  });

  const lotes = await Lote.find({
    finca_id: fincaId,
    fecha: { $gte: inicio, $lte: fin },
    esta_eliminado: false,
  });

  res.status(200).json({ animalesNacidos, lotes });
});

export const generarReporteSalud = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { fecha_inicio, fecha_fin } = req.query;

  const registrosSalud = await Salud.find({
    finca_id: fincaId,
    fecha: { $gte: new Date(fecha_inicio), $lte: new Date(fecha_fin) },
    esta_eliminado: false,
  }).populate("animal_id", "codigo nombre").populate("lote_id", "codigo_lote");

  res.status(200).json({ registrosSalud });
});

export const generarReporteFinanciero = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { fecha_inicio, fecha_fin } = req.query;

  const transacciones = await Finanzas.find({
    finca_id: fincaId,
    fecha_pago: { $gte: new Date(fecha_inicio), $lte: new Date(fecha_fin) },
    esta_eliminado: false,
  }).sort({ fecha_pago: 1 });

  const ingresos = transacciones.filter(t => t.tipo_movimiento === "Ingreso");
  const egresos = transacciones.filter(t => t.tipo_movimiento === "Egreso");

  res.status(200).json({ ingresos, egresos });
});

export const generarReporteInventario = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { fecha_inicio, fecha_fin } = req.query;

  const query = { finca_id: fincaId, esta_eliminado: false };
  if (fecha_inicio && fecha_fin) {
    query.updatedAt = { $gte: new Date(fecha_inicio), $lte: new Date(fecha_fin) };
  }

  const articulos = await Inventario.find(query).sort({ categoria: 1 });

  res.status(200).json({ articulos });
});

export const generarReporteReproductivo = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { fecha_inicio, fecha_fin } = req.query;

  const ciclos = await CicloReproductivo.find({
    finca_id: fincaId,
    fecha_celo: { $gte: new Date(fecha_inicio), $lte: new Date(fecha_fin) },
    esta_eliminado: false,
  }).populate("hembra_id", "codigo nombre");

  res.status(200).json({ ciclos });
});

export const generarReporteAnual = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { anio } = req.query;
  
  const inicio = new Date(`${anio}-01-01T00:00:00.000Z`);
  const fin = new Date(`${anio}-12-31T23:59:59.999Z`);

  const [transacciones, nacimientos] = await Promise.all([
    Finanzas.find({ finca_id: fincaId, fecha_pago: { $gte: inicio, $lte: fin }, esta_eliminado: false }),
    CicloReproductivo.find({ finca_id: fincaId, estado: "Nacimiento", fecha_parto: { $gte: inicio, $lte: fin }, esta_eliminado: false })
  ]);

  res.status(200).json({ transacciones, nacimientos });
});