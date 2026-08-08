import Usuario from "../models/usuario.model.js";
import { catchAsync } from "./catch_async.middleware.js";

/**
 * @description Verifica que el correo electrónico no esté en uso por otra persona.
 */
export const verificarEmailUnico = catchAsync(async (req, res, next) => {
  const { correo } = req.body;
  const userId = req.usuario?._id;

  const existe = await Usuario.findOne({
    correo,
    ...(userId && { _id: { $ne: userId } }),
  });

  if (existe) {
    return res
      .status(400)
      .json({
        msg: "El correo electrónico ya está registrado en otra cuenta.",
      });
  }
  next();
});

/**
 * @description Verifica si la cuenta no ha sido desactivada lógicamente. Útil para el Login.
 */
export const usuarioEstaActivo = catchAsync(async (req, res, next) => {
  const { correo } = req.body;

  const usuario = await Usuario.findOne({ correo });

  if (usuario && usuario.esta_eliminado) {
    return res.status(403).json({ msg: "Tu cuenta ha sido desactivada." });
  }

  next();
});
