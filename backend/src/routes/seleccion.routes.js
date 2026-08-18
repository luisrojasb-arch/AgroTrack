import { Router } from "express";
import * as seleccionCtrl from "../controllers/seleccion.controller.js";
import * as authMid from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMid.verificarAcceso);
router.use(authMid.validarFincaSeleccionada);

router.post("/", seleccionCtrl.registrarSeleccion);
router.get("/", seleccionCtrl.obtenerSelecciones);
router.get("/dashboard", seleccionCtrl.obtenerDashboardSeleccion);
router.get("/:id", seleccionCtrl.obtenerDetalleSeleccion);
router.put("/:id", seleccionCtrl.editarSeleccion);
router.delete("/:id", seleccionCtrl.eliminarSeleccion);

router.post("/:id/pesos", seleccionCtrl.registrarPeso);
router.post("/:id/aprobar", seleccionCtrl.aprobarSeleccion);

export default router;
