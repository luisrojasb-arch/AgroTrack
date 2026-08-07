import { Router } from "express";
import * as saludCtrl from "../controllers/salud.controller.js";
import * as authMid from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMid.verificarAcceso);
router.use(authMid.validarFincaSeleccionada);

router.get("/estadisticas", saludCtrl.obtenerEstadisticasSalud);
router.get("/resumen-lotes", saludCtrl.obtenerResumenSaludLotes);
router.get("/resumen-animales", saludCtrl.obtenerResumenSaludAnimales);

router.post("/", saludCtrl.registrarSalud);
router.get("/", saludCtrl.obtenerTareasSalud);
router.get("/:id", saludCtrl.obtenerDetalleSalud);
router.put("/:id", saludCtrl.editarSalud);
router.delete("/:id", saludCtrl.eliminarSalud);

export default router;
