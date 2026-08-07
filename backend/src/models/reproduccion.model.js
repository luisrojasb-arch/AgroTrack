import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * @description Esquema unificado para rastrear el ciclo reproductivo completo de un animal.
 */
const cicloReproductivoSchema = new mongoose.Schema(
  {
    finca_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Finca",
      required: [true, "El ciclo debe estar asociado a una finca"],
    },
    hembra_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: [true, "Debe seleccionar la hembra para el registro"],
    },
    estado: {
      type: String,
      enum: {
        values: ["Celo", "Preñez", "Nacimiento", "Fallo/Repetición"],
        message: "{VALUE} no es un estado válido del ciclo",
      },
      default: "Celo",
    },
    // --- FASE 1: CELO ---
    fecha_celo: {
      type: Date,
      required: [true, "La fecha de celo es obligatoria"],
    },
    proximo_celo_esperado: {
      type: Date,
    },
    nota_celo: {
      type: String,
      trim: true,
      maxlength: [500, "La nota de celo no puede exceder los 500 caracteres"],
      default: null,
    },
    // --- FASE 2: PREÑEZ ---
    fecha_servicio: {
      type: Date,
      default: null,
    },
    fecha_probable_parto: {
      type: Date,
    },
    padrote_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      default: null,
    },
    metodo_deteccion_prenez: {
      type: String,
      trim: true,
      maxlength: [
        100,
        "El método de detección no puede exceder los 100 caracteres",
      ],
      default: null,
    },
    nota_prenez: {
      type: String,
      trim: true,
      maxlength: [500, "La nota de preñez no puede exceder los 500 caracteres"],
      default: null,
    },
    // --- FASE 3: NACIMIENTO ---
    fecha_parto: {
      type: Date,
      default: null,
    },
    tipo_parto: {
      type: String,
      trim: true,
      enum: {
        values: ["Normal", "Distócico"],
        message:
          "{VALUE} no es un tipo de parto válido. Utilice 'Normal' o 'Distócico'.",
      },
      default: null,
    },
    lechones_vivos: {
      type: Number,
      min: [0, "La cantidad no puede ser negativa"],
      max: [
        40,
        "La cantidad de lechones vivos excede el límite biológico (máx 40)",
      ],
      default: null,
    },
    lechones_muertos: {
      type: Number,
      min: [0, "La cantidad no puede ser negativa"],
      max: [40, "La cantidad excede el límite razonable"],
      default: null,
    },
    machos: {
      type: Number,
      min: [0, "La cantidad no puede ser negativa"],
      max: [40, "La cantidad excede el límite razonable"],
      default: null,
    },
    hembras: {
      type: Number,
      min: [0, "La cantidad no puede ser negativa"],
      max: [40, "La cantidad excede el límite razonable"],
      default: null,
    },
    peso_promedio: {
      type: Number,
      min: [0, "El peso no puede ser negativo"],
      max: [
        10,
        "El peso promedio al nacer excede el límite biológico (máx 10 kg)",
      ],
      default: null,
    },
    nota_nacimiento: {
      type: String,
      trim: true,
      maxlength: [
        500,
        "La nota de nacimiento no puede exceder los 500 caracteres",
      ],
      default: null,
    },
    lote_creado_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lote",
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

// Middleware para calcular fechas automáticas antes de guardar (Sin "next")
cicloReproductivoSchema.pre("save", function () {
  if (this.fecha_celo && !this.proximo_celo_esperado) {
    const fechaCelo = new Date(this.fecha_celo);
    fechaCelo.setDate(fechaCelo.getDate() + 21);
    this.proximo_celo_esperado = fechaCelo;
  }

  if (this.fecha_servicio && !this.fecha_probable_parto) {
    const fechaServicio = new Date(this.fecha_servicio);
    fechaServicio.setDate(fechaServicio.getDate() + 114);
    this.fecha_probable_parto = fechaServicio;
  }
});

// Middleware para validaciones lógicas complejas (Sin "next")
cicloReproductivoSchema.pre("validate", function () {
  if (this.estado === "Nacimiento") {
    const machos = this.machos || 0;
    const hembras = this.hembras || 0;
    const vivos = this.lechones_vivos || 0;

    if (vivos !== machos + hembras) {
      this.invalidate(
        "lechones_vivos",
        `La cantidad de lechones vivos (${vivos}) debe ser exactamente la suma de machos (${machos}) y hembras (${hembras}).`,
      );
    }
    if (!this.fecha_parto) {
      this.invalidate(
        "fecha_parto",
        "La fecha de parto es obligatoria para registrar un nacimiento.",
      );
    }
    if (!this.tipo_parto) {
      this.invalidate(
        "tipo_parto",
        "El tipo de parto (Normal o Distócico) es obligatorio para registrar un nacimiento.",
      );
    }
  }

  if (this.fecha_servicio && this.fecha_celo) {
    if (this.fecha_servicio.getTime() < this.fecha_celo.getTime()) {
      this.invalidate(
        "fecha_servicio",
        "La fecha de servicio no puede ser anterior a la fecha de celo.",
      );
    }
  }

  if (this.fecha_parto && this.fecha_servicio) {
    if (this.fecha_parto.getTime() < this.fecha_servicio.getTime()) {
      this.invalidate(
        "fecha_parto",
        "La fecha de parto no puede ser anterior a la fecha de servicio.",
      );
    }
  }
});

cicloReproductivoSchema.index({ finca_id: 1, hembra_id: 1 });
cicloReproductivoSchema.index({ finca_id: 1, estado: 1 });

cicloReproductivoSchema.plugin(mongoosePaginate);

const CicloReproductivo = mongoose.model(
  "CicloReproductivo",
  cicloReproductivoSchema,
);
export default CicloReproductivo;
