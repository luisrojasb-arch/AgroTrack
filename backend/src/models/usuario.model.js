import mongoose from "mongoose";
import { encriptarContrasenha } from "./hooks/usuario.hook.js";
import bcrypt from "bcrypt";

/**
 * @description Esquema para representar un usuario en el sistema.
 * @typedef {Object} Usuario
 * @property {string} nombre - Nombre del usuario.
 * @property {string} apellido - Apellido del usuario.
 * @property {string} correo - Correo electrónico único del usuario.
 * @property {string} contrasenha - Contraseña del usuario (encriptada antes de guardar).
 * @property {string|null} telefono - Número de teléfono del usuario en formato internacional.
 * @property {boolean} acepto_terminos - Indica si el usuario aceptó los términos y condiciones.
 * @property {string|null} foto_perfil_url - URL de la imagen de perfil del usuario.
 * @property {boolean} requiere_cambio_contrasenha - Indica si se requiere que el usuario cambie su contraseña.
 * @property {string|null} restablecer_contrasenha_token - Token generado para el proceso de recuperación de contraseña.
 * @property {Date|null} restablecer_contrasenha_expira - Fecha de expiración del token de recuperación.
 * @property {boolean} esta_eliminado - Indica si el registro ha sido eliminado lógicamente.
 * @property {Date|null} eliminado_at - Fecha en que el registro fue eliminado lógicamente.
 */
const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Za-zÀ-ÿ\s]+$/.test(v);
        },
        message: "El nombre solo puede contener letras.",
      },
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Za-zÀ-ÿ\s]+$/.test(v);
        },
        message: "El apellido solo puede contener letras.",
      },
    },
    correo: {
      type: String,
      unique: true,
      index: true,
      required: [true, "El correo electrónico es obligatorio"],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Por favor, ingresa un correo electrónico válido.",
      },
    },
    contrasenha: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            v,
          );
        },
        message:
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
      },
    },
    telefono: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: function (v) {
          return v === null || /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: "El formato del teléfono no es válido.",
      },
    },
    acepto_terminos: {
      type: Boolean,
      default: false,
    },
    foto_perfil_url: {
      type: String,
      default: null,
    },
    requiere_cambio_contrasenha: {
      type: Boolean,
      default: false,
    },
    restablecer_contrasenha_token: {
      type: String,
      default: null,
    },
    restablecer_contrasenha_expira: {
      type: Date,
      default: null,
    },
    esta_eliminado: {
      type: Boolean,
      default: false,
    },
    eliminado_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

usuarioSchema.pre("save", encriptarContrasenha);

usuarioSchema.methods.compararContrasenha = async function (
  contrasenhaCandidata,
) {
  return await bcrypt.compare(contrasenhaCandidata, this.contrasenha);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
