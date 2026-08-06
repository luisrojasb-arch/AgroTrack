import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * @description Esquema para representar la relación entre miembros y fincas, incluyendo roles y estado de eliminación.
 * @typedef {Object} MiembroFinca
 * @property {mongoose.Schema.Types.ObjectId} usuario_id - ID del usuario que es miembro de la finca.
 * @property {mongoose.Schema.Types.ObjectId} finca_id - ID de la finca a la que pertenece el miembro.
 * @property {string} rol - Rol del miembro en la finca (admin, trabajador, veterinario).
 * @property {boolean} esta_eliminado - Indica si el registro ha sido eliminado lógicamente.
 * @property {Date} eliminado_at - Fecha en que el registro fue eliminado lógicamente.
 */

const miembroFincaSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El ID del usuario es obligatorio"],
    },
    finca_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Finca",
      required: [true, "El ID de la finca es obligatorio"],
    },
    rol: {
      type: String,
      enum: {
        values: ["admin", "trabajador", "veterinario"],
        message: "{VALUE} no es un rol válido",
      },
      default: "trabajador",
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

miembroFincaSchema.plugin(mongoosePaginate);

const MiembroFinca = mongoose.model("MiembroFinca", miembroFincaSchema);
export default MiembroFinca;