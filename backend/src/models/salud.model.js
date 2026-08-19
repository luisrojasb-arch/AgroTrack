import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const saludSchema = new mongoose.Schema(
  {
    finca_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Finca",
      required: [true, "El registro de salud debe estar asociado a una finca"],
    },
    animal_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      default: null,
    },
    lote_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lote",
      default: null,
    },
    tipo: {
      type: String,
      enum: {
        values: [
          "Vacuna",
          "Desparasitación",
          "Descolmille",
          "Castración",
          "Cirugía",
          "Revisión",
          "Tratamiento",
          "Otro",
        ],
        message: "{VALUE} no es un tipo de evento de salud válido",
      },
      required: [true, "El tipo de evento es obligatorio"],
    },
    producto: {
      type: String,
      trim: true,
      default: null,
      maxlength: [
        100,
        "El nombre del producto no puede exceder los 100 caracteres",
      ],
    },
    dosis: {
      type: Number,
      min: [0, "La dosis no puede ser un número negativo"],
      max: [10000, "La dosis excede el límite permitido"],
      default: null,
    },
    fecha: {
      type: Date,
      required: [true, "La fecha del evento es obligatoria"],
    },
    proxima_dosis: {
      type: Date,
      default: null,
    },
    nota: {
      type: String,
      trim: true,
      default: null,
      maxlength: [500, "La nota no puede exceder los 500 caracteres"],
    },
    aplicado: {
      type: Boolean,
      default: false,
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

saludSchema.pre("validate", function () {
  const tieneAnimal = !!this.animal_id;
  const tieneLote = !!this.lote_id;

  if (!tieneAnimal && !tieneLote) {
    this.invalidate(
      "animal_id",
      "Debe asociar este registro de salud a un animal o a un lote.",
    );
  }
  if (tieneAnimal && tieneLote) {
    this.invalidate(
      "animal_id",
      "Un registro de salud no puede estar asociado a un animal y a un lote al mismo tiempo.",
    );
  }

  if (this.fecha && this.proxima_dosis) {
    if (this.proxima_dosis.getTime() <= this.fecha.getTime()) {
      this.invalidate(
        "proxima_dosis",
        "La fecha de la próxima dosis debe ser en el futuro respecto a la fecha del evento actual.",
      );
    }
  }
});

saludSchema.index({ finca_id: 1, animal_id: 1 });
saludSchema.index({ finca_id: 1, lote_id: 1 });
saludSchema.index({ finca_id: 1, tipo: 1 });
saludSchema.index({ finca_id: 1, aplicado: 1 });

saludSchema.plugin(mongoosePaginate);

const Salud = mongoose.model("Salud", saludSchema);
export default Salud;
