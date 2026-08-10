import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.model.js";
import Finca from "../models/finca.model.js";
import MiembroFinca from "../models/miembroFinca.model.js";
import { catchAsync } from "./catch_async.middleware.js";

/**
 * @description Paso 1: Verifica el token JWT, obtiene el usuario y su contexto de finca.
 */
export const verificarAcceso = catchAsync(async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ msg: "Acceso denegado. No se encontró un token." });
  }

  const decodificado = jwt.verify(token, process.env.JWT_SECRET);
  const usuario = await Usuario.findById(decodificado.id);

  if (!usuario || usuario.esta_eliminado) {
    return res.status(403).json({ msg: "Usuario no encontrado." });
  }

  req.usuario = usuario;

  if (decodificado.finca_actual_id) {
    const finca = await Finca.findById(decodificado.finca_actual_id);
    if (finca && !finca.esta_eliminado) {
      req.finca = finca;
      req.rol_finca = decodificado.rol;
    }
  }

  next();
});

/**
 * @description Paso 2: Valida que el usuario pertenezca a la finca sobre la que intenta operar.
 */
export const validarFincaSeleccionada = catchAsync(async (req, res, next) => {
  const fincaId =
    req.params.fincaId ||
    req.header("x-finca-id") ||
    req.body?.finca_id ||
    req.finca?._id;

  if (!fincaId) {
    return res
      .status(400)
      .json({ msg: "No se ha especificado la finca para esta operación." });
  }

  const vinculacion = await MiembroFinca.findOne({
    usuario_id: req.usuario._id,
    finca_id: fincaId,
    esta_eliminado: false,
  });

  if (!vinculacion) {
    return res.status(403).json({ msg: "No tienes acceso a esta finca." });
  }

  const finca = await Finca.findOne({ _id: fincaId, esta_eliminado: false });
  if (!finca) {
    return res.status(404).json({ msg: "La finca no existe o fue eliminada." });
  }

  req.finca = finca;
  req.rol_finca = vinculacion.rol;

  next();
});

/**
 * @description Paso 3: Permite el acceso solo a ciertos roles dentro de la finca (admin, veterinario, trabajador).
 * @param {...string} rolesPermitidos
 */
export const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.rol_finca)) {
      return res.status(403).json({
        msg: `Acceso denegado: Tu rol de '${req.rol_finca}' no tiene permiso para realizar esta acción.`,
      });
    }
    next();
  };
};

/**
 * @description (Opcional) Bloquea acciones si el usuario debe cambiar su contraseña por seguridad.
 */
export const bloquearSiDebeCambiarContrasenha = (req, res, next) => {
  if (req.usuario && req.usuario.requiere_cambio_contrasenha) {
    return res.status(403).json({
      msg: "Debes cambiar tu contraseña antes de realizar cualquier otra acción.",
      debeCambiarContrasenha: true,
    });
  }
  next();
};
