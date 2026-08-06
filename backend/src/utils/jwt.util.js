import jwt from "jsonwebtoken";

/**
 * @description Genera un token JWT para la sesión del usuario con información de su contexto.
 * @param {Object} usuario - Objeto del usuario proveniente de la base de datos.
 * @param {string|null} fincaId - ID de la finca con la que está operando actualmente (opcional).
 * @param {string|null} rol - Rol del usuario en la finca específica (opcional).
 * @returns {string} - Token JWT firmado.
 */
export const generarToken = (usuario, fincaId = null, rol = null) => {
  return jwt.sign(
    {
      id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      finca_actual_id: fincaId,
      rol: rol,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};