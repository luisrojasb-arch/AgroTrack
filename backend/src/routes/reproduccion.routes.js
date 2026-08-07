import { Router } from "express";
import * as repCtrl from "../controllers/reproduccion.controller.js";
import * as authMid from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMid.verificarAcceso);
router.use(authMid.validarFincaSeleccionada);

router.get("/estadisticas", repCtrl.obtenerEstadisticasReproduccion);
router.get("/celos", repCtrl.obtenerTablaCelos);
router.get("/preneces", repCtrl.obtenerTablaPreneces);
router.get("/nacimientos", repCtrl.obtenerTablaNacimientos);

router.post("/celo", repCtrl.registrarCelo);
router.put("/celo/:id", repCtrl.editarCelo);

router.put("/celo/:id/confirmar-prenez", repCtrl.confirmarPrenez);
router.put("/prenez/:id", repCtrl.editarPrenez);

router.put("/prenez/:id/confirmar-nacimiento", repCtrl.confirmarNacimiento);
router.put("/nacimiento/:id", repCtrl.editarNacimiento);

router.get("/:id", repCtrl.obtenerDetalleCiclo);
router.delete("/:id", repCtrl.eliminarCiclo);

export default router;