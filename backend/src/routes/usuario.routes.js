import { Router } from "express";
import * as usuarioCtrl from "../controllers/usuario.controller.js";
import * as authMid from "../middlewares/auth.middleware.js";
import * as usuarioMid from "../middlewares/usuario.middleware.js";

const router = Router();

router.post(
  "/registrar",
  usuarioMid.verificarEmailUnico,
  usuarioCtrl.registrarUsuario,
);
router.post("/login", usuarioMid.usuarioEstaActivo, usuarioCtrl.loginUsuario);
router.post("/olvide-contrasenha", usuarioCtrl.solicitarRecuperacion);
router.post(
  "/restablecer-contrasenha/:token",
  usuarioCtrl.restablecerContrasenha,
);

router.post(
  "/activar-cuenta",
  authMid.verificarAcceso,
  usuarioCtrl.activarCuenta,
);
router.get(
  "/perfil",
  authMid.verificarAcceso,
  authMid.bloquearSiDebeCambiarContrasenha,
  usuarioCtrl.obtenerPerfil,
);
router.put(
  "/actualizar",
  authMid.verificarAcceso,
  authMid.bloquearSiDebeCambiarContrasenha,
  usuarioCtrl.actualizarPerfil,
);

router.get(
  "/estadisticas",
  authMid.verificarAcceso,
  authMid.validarFincaSeleccionada,
  authMid.permitirRoles("admin"),
  usuarioCtrl.obtenerEstadisticasUsuarios,
);

router.get(
  "/miembros",
  authMid.verificarAcceso,
  authMid.validarFincaSeleccionada,
  authMid.permitirRoles("admin"),
  usuarioCtrl.obtenerMiembros,
);

router.post(
  "/registrar-miembro",
  authMid.verificarAcceso,
  authMid.bloquearSiDebeCambiarContrasenha,
  authMid.validarFincaSeleccionada,
  authMid.permitirRoles("admin"),
  usuarioMid.verificarEmailUnico,
  usuarioCtrl.registrarMiembro,
);

router.put(
  "/miembros/:miembroId",
  authMid.verificarAcceso,
  authMid.validarFincaSeleccionada,
  authMid.permitirRoles("admin"),
  usuarioCtrl.editarMiembro,
);

router.delete(
  "/miembros/:miembroId",
  authMid.verificarAcceso,
  authMid.validarFincaSeleccionada,
  authMid.permitirRoles("admin"),
  usuarioCtrl.eliminarMiembro,
);

export default router;
