import { Router } from "express";
import * as finanzasCtrl from "../controllers/finanzas.controller.js";
import * as authMid from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMid.verificarAcceso);
router.use(authMid.validarFincaSeleccionada);

router.get("/resumen", finanzasCtrl.obtenerResumenFinanzas);
router.get("/estadisticas", finanzasCtrl.obtenerEstadisticasFinanzas);
router.post("/", finanzasCtrl.registrarTransaccion);
router.get("/", finanzasCtrl.obtenerResumenFinanzas);
router.get("/:id", finanzasCtrl.obtenerDetalleTransaccion);
router.put("/:id", finanzasCtrl.editarTransaccion);
router.delete("/:id", finanzasCtrl.eliminarTransaccion);

export default router;