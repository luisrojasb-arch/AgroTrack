import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * @description Esquema para representar los movimientos financieros (ingresos y egresos) de la finca.
 * @typedef {Object} Finanzas
 * @property {mongoose.Schema.Types.ObjectId} finca_id - ID de la finca a la que pertenece la transacción.
 * @property {string} concepto - Título o descripción breve del movimiento.
 * @property {string} tipo_moneda - Moneda utilizada en la transacción (COP, USD, Bs).
 * @property {number} monto - Cantidad de dinero de la transacción.
 * @property {string} tipo_movimiento - Indica si es un Ingreso o un Egreso.
 * @property {string} categoria - Categoría del gasto o ingreso.
 * @property {string} metodo_pago - Forma en la que se realizó el pago.
 * @property {Date} fecha_pago - Fecha en la que ocurrió la transacción.
 * @property {string} nota - Observaciones adicionales.
 * @property {boolean} esta_eliminado - Indica si el registro ha sido eliminado lógicamente.
 * @property {Date} eliminado_at - Fecha en que el registro fue eliminado.
 */

const finanzasSchema = new mongoose.Schema(
  {
    finca_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Finca",
      required: [true, "La transacción debe estar asociada a una finca"],
    },
    concepto: {
      type: String,
      required: [true, "El concepto o título es obligatorio"],
      trim: true,
      maxlength: [100, "El concepto no puede exceder los 100 caracteres"],
      validate: {
        validator: function (v) {
          
          return /^[a-zA-ZÀ-ÿ0-9\s,.\-%():/&]+$/.test(v);
        },
        message: "El concepto contiene caracteres no permitidos",
      },
    },
    tipo_moneda: {
      type: String,
      trim: true,
      enum: {
        values: ["COP", "USD", "Bs"],
        message: "{VALUE} no es un tipo de moneda válido",
      },
      default: "COP",
      required: [true, "El tipo de moneda es obligatorio"],
    },
    monto: {
      type: Number,
      required: [true, "El monto es obligatorio"],
      min: [0.01, "El monto debe ser mayor a 0"],
      max: [100000000000, "El monto excede el límite permitido por el sistema"],
    },
    tipo_movimiento: {
      type: String,
      trim: true,
      enum: {
        values: ["Ingreso", "Egreso"],
        message: "{VALUE} no es un tipo de movimiento válido",
      },
      required: [true, "El tipo de movimiento (Ingreso/Egreso) es obligatorio"],
    },
    categoria: {
      type: String,
      trim: true,
      enum: {
        values: [
          "Alimento",
          "Medicina",
          "Medicamento", //para compatibilidad con el Inventario
          "Vacuna",
          "Desparasitante",
          "Venta Animal",
          "Compra Animal",
          "Insumos",
          "Herramientas",
          "Mantenimiento",
          "Pago Nómina",
          "Servicios",
          "Otro",
        ],
        message: "{VALUE} no es una categoría válida",
      },
      required: [true, "La categoría es obligatoria"],
    },
    metodo_pago: {
      type: String,
      trim: true,
      enum: {
        values: ["Efectivo", "Transferencia", "Otro"],
        message: "{VALUE} no es un método de pago válido",
      },
      required: [true, "El método de pago es obligatorio"],
    },
    fecha_pago: {
      type: Date,
      required: [true, "La fecha de pago es obligatoria"],
      validate: {
        validator: function (v) {
          return v.getTime() <= new Date().getTime();
        },
        message: "La fecha de pago no puede ser una fecha en el futuro",
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
  }
);

finanzasSchema.index({ finca_id: 1, fecha_pago: -1 });
finanzasSchema.index({ finca_id: 1, tipo_movimiento: 1 });
finanzasSchema.index({ finca_id: 1, categoria: 1 });

finanzasSchema.plugin(mongoosePaginate);

const Finanzas = mongoose.model("Finanzas", finanzasSchema);
export default Finanzas;