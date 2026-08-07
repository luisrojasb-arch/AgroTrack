import { Router } from "express";
import * as inventarioCtrl from "../controllers/inventario.controller.js";
import * as authMid from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMid.verificarAcceso);
router.use(authMid.validarFincaSeleccionada);

router.get("/resumen", inventarioCtrl.obtenerResumenInventario);
router.get("/estadisticas", inventarioCtrl.obtenerEstadisticasInventario);
router.post("/", inventarioCtrl.registrarArticulo);
router.get("/", inventarioCtrl.obtenerInventario);
router.get("/:id", inventarioCtrl.obtenerDetalleArticulo);
router.put("/:id", inventarioCtrl.editarArticulo);
router.delete("/:id", inventarioCtrl.eliminarArticulo);

router.post("/:id/ajustar-stock", inventarioCtrl.ajustarStock);

export default router;