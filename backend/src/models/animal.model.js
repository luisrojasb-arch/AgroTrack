import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * @description Esquema para representar un animal individual en el sistema.
 * @typedef {Object} Animal
 * @property {mongoose.Schema.Types.ObjectId} finca_id - ID de la finca a la que pertenece.
 * @property {string} codigo - Código identificador, único dentro de la finca.
 * @property {string} nombre - Nombre del animal (opcional).
 * @property {string} sexo - Sexo del animal (Hembra, Macho).
 * @property {string} estado - Estado actual (Vivo, Muerto, Vendido).
 * @property {string} raza - Raza del animal.
 * @property {number} peso - Peso en kilogramos.
 * @property {Date} fecha_nacimiento - Fecha de nacimiento.
 * @property {number} cantidad_pezones - Cantidad de pezones (solo aplicable a hembras).
 * @property {mongoose.Schema.Types.ObjectId} madre_id - Referencia a la madre (opcional).
 * @property {mongoose.Schema.Types.ObjectId} padre_id - Referencia al padre (opcional).
 * @property {string} nota - Observaciones adicionales.
 * @property {boolean} esta_eliminado - Indica si el registro ha sido eliminado lógicamente.
 * @property {Date} eliminado_at - Fecha en que el registro fue eliminado.
 */

const animalSchema = new mongoose.Schema(
  {
    finca_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Finca",
      required: [true, "El animal debe estar asociado a una finca"],
    },
    codigo: {
      type: String,
      required: [true, "El código del animal es obligatorio"],
      trim: true,
      maxlength: [20, "El código no puede exceder los 20 caracteres"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9\-]+$/.test(v);
        },
        message: "El código solo puede contener letras, números y guiones (-)",
      },
    },
    nombre: {
      type: String,
      trim: true,
      default: null,
      maxlength: [50, "El nombre no puede exceder los 50 caracteres"],
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[a-zA-ZÀ-ÿ\s]+$/.test(v);
        },
        message: "El nombre solo puede contener letras y espacios",
      },
    },
    sexo: {
      type: String,
      enum: {
        values: ["Hembra", "Macho"],
        message: "{VALUE} no es un sexo válido",
      },
      required: [true, "El sexo es obligatorio"],
    },
    estado: {
      type: String,
      enum: {
        values: ["Vivo", "Muerto", "Vendido"],
        message: "{VALUE} no es un estado válido",
      },
      required: [true, "El estado es obligatorio"],
      default: "Vivo",
    },
    raza: {
      type: String,
      required: [true, "La raza es obligatoria"],
      trim: true,
      maxlength: [50, "La raza no puede exceder los 50 caracteres"],
      validate: {
        validator: function (v) {
          return /^[a-zA-ZÀ-ÿ\s]+$/.test(v);
        },
        message: "La raza solo puede contener letras y espacios",
      },
    },
    peso: {
      type: Number,
      min: [0, "El peso no puede ser negativo"],
      max: [2000, "El peso ingresado supera el límite biológico permitido (2000 kg)"],
      default: 0,
    },
    fecha_nacimiento: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return v.getTime() <= new Date().getTime();
        },
        message: "La fecha de nacimiento no puede ser una fecha en el futuro",
      },
    },
    cantidad_pezones: {
      type: Number,
      min: [0, "La cantidad de pezones no puede ser negativa"],
      max: [20, "La cantidad de pezones supera el límite biológico permitido (20)"],
      default: 0,
      validate: {
        validator: function (v) {
          if (this.sexo === "Macho" && v > 0) {
            return false;
          }
          return true;
        },
        message: "No se puede registrar cantidad de pezones en un animal macho.",
      },
    },
    madre_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      default: null,
    },
    padre_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      default: null,
    },
    nota: {
      type: String,
      trim: true,
      default: null,
      maxlength: [500, "La nota no puede exceder los 500 caracteres"],
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
  }
);

animalSchema.index({ finca_id: 1, codigo: 1 }, { unique: true });

animalSchema.plugin(mongoosePaginate);

const Animal = mongoose.model("Animal", animalSchema);
export default Animal;