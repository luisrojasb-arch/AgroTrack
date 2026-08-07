import { Router } from "express";
import * as loteCtrl from "../controllers/lote.controller.js";
import * as authMid from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMid.verificarAcceso);
router.use(authMid.validarFincaSeleccionada);

router.post("/", loteCtrl.registrarLote);
router.get("/", loteCtrl.obtenerLotes);
router.get("/:id", loteCtrl.obtenerDetalleLote);
router.put("/:id", loteCtrl.editarLote);
router.delete("/:id", loteCtrl.eliminarLote);

export default router;
