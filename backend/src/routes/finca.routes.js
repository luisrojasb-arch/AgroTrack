import { Router } from "express";
import * as fincaCtrl from "../controllers/finca.controller.js";
import * as authMid from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMid.verificarAcceso);
router.use(authMid.validarFincaSeleccionada);

//router.get("/dashboard", fincaCtrl.obtenerDashboardGeneral);
//router.get("/dashboard/alertas", fincaCtrl.obtenerAlertasDashboard);
router.get("/", fincaCtrl.obtenerFinca);

router.put("/", authMid.permitirRoles("admin"), fincaCtrl.actualizarFinca);

router.delete("/", authMid.permitirRoles("admin"), fincaCtrl.eliminarFinca);

router.get(
  "/tasas-cambio",
  fincaCtrl.obtenerTasasCambio
);

router.put(
  "/tasas-cambio",
  authMid.permitirRoles("admin"),
  fincaCtrl.actualizarTasasCambio
);

export default router;
