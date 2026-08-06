import bcrypt from "bcrypt";

/**
 * @description Hook para encriptar la contraseña antes de guardarla en la base de datos.
 */
export const encriptarContrasenha = async function () {
  if (!this.isModified("contrasenha")) return;

  const salt = await bcrypt.genSalt(10);
  this.contrasenha = await bcrypt.hash(this.contrasenha, salt);
};
