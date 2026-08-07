import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * @description Esquema para representar un lote (grupo de crías o animales) en el sistema.
 * @typedef {Object} Lote
 * @property {mongoose.Schema.Types.ObjectId} finca_id - ID de la finca a la que pertenece el lote.
 * @property {string} codigo_lote - Código identificador, único dentro de la finca.
 * @property {Date} fecha - Fecha de registro o creación del lote.
 * @property {number} cantidad_total - Cantidad total de animales en el lote.
 * @property {number} peso_promedio - Peso promedio del lote en kilogramos.
 * @property {number} cantidad_machos - Número de machos en el lote.
 * @property {number} cantidad_hembras - Número de hembras en el lote.
 * @property {mongoose.Schema.Types.ObjectId} madre_id - Referencia a la madre (opcional).
 * @property {mongoose.Schema.Types.ObjectId} padre_id - Referencia al padre (opcional).
 * @property {string} nota - Observaciones adicionales.
 * @property {boolean} esta_eliminado - Indica si el registro ha sido eliminado lógicamente.
 * @property {Date} eliminado_at - Fecha en que el registro fue eliminado.
 */

const loteSchema = new mongoose.Schema(
  {
    finca_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Finca",
      required: [true, "El lote debe estar asociado a una finca"],
    },
    codigo_lote: {
      type: String,
      required: [true, "El código o número de lote es obligatorio"],
      trim: true,
      maxlength: [20, "El código de lote no puede exceder los 20 caracteres"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9\-]+$/.test(v);
        },
        message: "El código de lote solo puede contener letras, números y guiones (-)",
      },
    },
    fecha: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return v.getTime() <= new Date().getTime();
        },
        message: "La fecha del lote no puede ser una fecha en el futuro",
      },
    },
    cantidad_total: {
      type: Number,
      required: [true, "La cantidad total de animales es obligatoria"],
      min: [1, "El lote debe tener al menos 1 animal"],
      max: [1000, "La cantidad excede el límite permitido por lote"],
    },
    peso_promedio: {
      type: Number,
      min: [0, "El peso promedio no puede ser negativo"],
      max: [2000, "El peso promedio excede el límite biológico permitido"],
      default: 0,
    },
    cantidad_machos: {
      type: Number,
      min: [0, "La cantidad de machos no puede ser negativa"],
      default: 0,
    },
    cantidad_hembras: {
      type: Number,
      min: [0, "La cantidad de hembras no puede ser negativa"],
      default: 0,
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

loteSchema.pre("validate", function () {
  const machos = this.cantidad_machos || 0;
  const hembras = this.cantidad_hembras || 0;
  const total = this.cantidad_total || 0;

  if (total !== machos + hembras) {
    this.invalidate(
      "cantidad_total",
      `La cantidad total (${total}) debe ser exactamente la suma de machos (${machos}) y hembras (${hembras}).`
    );
  }
});

loteSchema.index({ finca_id: 1, codigo_lote: 1 }, { unique: true });

loteSchema.plugin(mongoosePaginate);

const Lote = mongoose.model("Lote", loteSchema);
export default Lote;