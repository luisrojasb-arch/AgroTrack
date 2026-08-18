import { Router } from "express";
import * as reportesCtrl from "../controllers/reportes.controller.js";
import * as authMid from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMid.verificarAcceso);
router.use(authMid.validarFincaSeleccionada);

router.get("/produccion", reportesCtrl.generarReporteProduccion);
router.get("/salud", reportesCtrl.generarReporteSalud);
router.get("/financiero", reportesCtrl.generarReporteFinanciero);
router.get("/inventario", reportesCtrl.generarReporteInventario);
router.get("/reproductivo", reportesCtrl.generarReporteReproductivo);
router.get("/anual", reportesCtrl.generarReporteAnual);

export default router;