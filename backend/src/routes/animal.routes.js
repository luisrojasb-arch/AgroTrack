import { Router } from "express";
import * as animalCtrl from "../controllers/animal.controller.js";
import * as authMid from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMid.verificarAcceso);
router.use(authMid.validarFincaSeleccionada);

router.get("/estadisticas", animalCtrl.obtenerEstadisticasAnimales);
router.post("/", animalCtrl.registrarAnimal);
router.get("/", animalCtrl.obtenerAnimales);
router.get("/:id", animalCtrl.obtenerDetalleAnimal);
router.put("/:id", animalCtrl.editarAnimal);
router.delete("/:id", animalCtrl.eliminarAnimal);
router.patch("/:id/situacion", animalCtrl.registrarSituacionAnimal);

export default router;
