import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * @description Esquema para representar el inventario de artículos en una finca.
 * @typedef {Object} Inventario
 * @property {mongoose.Schema.Types.ObjectId} finca_id - ID de la finca a la que pertenece el artículo.
 * @property {string} codigo - Código del producto (opcional, ej: código de barras).
 * @property {string} nombre - Nombre del artículo.
 * @property {string} categoria - Categoría del artículo (Alimento, Vacuna, Herramienta, etc.).
 * @property {string} unidad - Unidad de medida (Unidad, kg, l, etc.).
 * @property {number} cantidad - Cantidad actual en stock.
 * @property {number} stock_minimo - Cantidad mínima recomendada para emitir alertas (opcional).
 * @property {number} costo_unitario - Costo por unidad del artículo (opcional).
 * @property {Date} vencimiento - Fecha de caducidad del artículo (opcional).
 * @property {string} nota - Observaciones adicionales.
 * @property {boolean} esta_eliminado - Indica si el registro ha sido eliminado lógicamente.
 * @property {Date} eliminado_at - Fecha en que el registro fue eliminado.
 */

const inventarioSchema = new mongoose.Schema(
  {
    finca_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Finca",
      required: [true, "El artículo debe estar asociado a una finca"],
    },
    codigo: {
      type: String,
      trim: true,
      default: null,
      maxlength: [50, "El código no puede exceder los 50 caracteres"],
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[a-zA-Z0-9\-]+$/.test(v);
        },
        message: "El código solo puede contener letras, números y guiones (-)",
      },
    },
    nombre: {
      type: String,
      required: [true, "El nombre del artículo es obligatorio"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
      validate: {
        validator: function (v) {
          return /^[a-zA-ZÀ-ÿ0-9\s,.\-]+$/.test(v);
        },
        message: "El nombre contiene caracteres no permitidos",
      },
    },
    categoria: {
      type: String,
      enum: {
        values: [
          "Alimento",
          "Vacuna",
          "Medicamento",
          "Herramienta",
          "Insumo",
          "Fertilizante",
          "Semilla",
          "Otro",
        ],
        message: "{VALUE} no es una categoría válida",
      },
      required: [true, "La categoría es obligatoria"],
    },
    unidad: {
      type: String,
      enum: {
        values: ["Unidad", "kg", "g", "l", "ml", "Saco", "Rollo", "Otro"],
        message: "{VALUE} no es una unidad de medida válida",
      },
      required: [true, "La unidad de medida es obligatoria"],
    },
    cantidad: {
      type: Number,
      required: [true, "La cantidad es obligatoria"],
      min: [0, "La cantidad no puede ser negativa"],
      max: [1000000, "La cantidad excede el límite permitido por el sistema"],
    },
    stock_minimo: {
      type: Number,
      min: [0, "El stock mínimo no puede ser negativo"],
      default: 0,
    },
    costo_unitario: {
      type: Number,
      min: [0, "El costo unitario no puede ser negativo"],
      default: 0,
    },
    tipo_moneda: {
      type: String,
      enum: {
        values: ["COP", "USD", "Bs"],
        message: "{VALUE} no es un tipo de moneda válido",
      },
      default: "COP",
      required: [true, "El tipo de moneda es obligatorio"],
    },
    vencimiento: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          return v.getTime() >= hoy.getTime();
        },
        message:
          "La fecha de vencimiento no puede ser una fecha ya pasada al momento del registro.",
      },
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
  },
);

inventarioSchema.index({ finca_id: 1, categoria: 1 });
inventarioSchema.index({ finca_id: 1, nombre: 1 });

inventarioSchema.plugin(mongoosePaginate);

const Inventario = mongoose.model("Inventario", inventarioSchema);
export default Inventario;
