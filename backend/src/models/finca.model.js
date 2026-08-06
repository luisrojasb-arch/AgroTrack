import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * @description Esquema para representar fincas en el sistema.
 * @typedef {Object} Finca
 * @property {mongoose.Schema.Types.ObjectId} propietario_id - ID del usuario propietario de la finca.
 * @property {string} nombre_finca - Nombre de la finca.
 * @property {string} telefono_finca - Teléfono de contacto de la finca.
 * @property {string} direccion_finca - Dirección física de la finca.
 * @property {number} tamanho_hectareas - Tamaño de la finca en hectáreas.
 * @property {boolean} esta_eliminado - Indica si el registro ha sido eliminado lógicamente.
 * @property {Date} eliminado_at - Fecha en que el registro fue eliminado lógicamente.
 */

const fincaSchema = new mongoose.Schema(
  {
    propietario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El ID del propietario es obligatorio"],
    },
    nombre_finca: {
      type: String,
      required: [true, "El nombre de la finca es obligatorio"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-ZÀ-ÿ0-9\s]{2,50}$/.test(v);
        },
        message: "El nombre de la finca debe tener entre 2 y 50 caracteres alfanuméricos.",
      },
    },
    telefono_finca: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^\+?[0-9\s\-]{7,15}$/.test(v);
        },
        message: "El formato del teléfono no es válido.",
      },
    },
    direccion_finca: {
      type: String,
      trim: true,
      default: null,
      maxlength: [200, "La dirección no puede tener más de 200 caracteres"],
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[a-zA-ZÀ-ÿ0-9\s,.\-#]+$/.test(v);
        },
        message: "La dirección contiene caracteres no permitidos. Usa letras, números y signos básicos (, . - #).",
      },
    },
    tamanho_hectareas: {
      type: Number,
      min: [0, "El tamaño no puede ser un número negativo"],
      max: [100000, "El tamaño excede el límite razonable permitido"],
      default: 0,
    },
    tasas_cambio: {
      usd_a_cop: {
        type: Number,
        default: null,
        min: [0, "La tasa de cambio no puede ser negativa"]
      },
      bs_a_cop: {
        type: Number,
        default: null,
        min: [0, "La tasa de cambio no puede ser negativa"]
      }
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
    timestamps: true
  }
);

fincaSchema.plugin(mongoosePaginate);

const Finca = mongoose.model("Finca", fincaSchema);
export default Finca;