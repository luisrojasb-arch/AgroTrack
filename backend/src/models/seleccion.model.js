import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * @description Sub-esquema para registrar el historial de pesos durante la evaluación.
 */
const pesoHistorialSchema = new mongoose.Schema(
  {
    peso: {
      type: Number,
      required: [true, "El peso es obligatorio"],
      min: [0, "El peso no puede ser negativo"],
      max: [500, "El peso excede el límite biológico permitido"],
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

/**
 * @description Sub-esquema para evaluar hembras prospecto (cada animal individual).
 */
const animalEvaluacionSchema = new mongoose.Schema(
  {
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
      maxlength: [50, "El nombre no puede exceder los 50 caracteres"],
      default: null,
    },
    raza: {
      type: String,
      trim: true,
      maxlength: [50, "La raza no puede exceder los 50 caracteres"],
      default: null,
    },
    fecha_nacimiento: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return v.getTime() <= new Date().getTime();
        },
        message: "La fecha de nacimiento no puede estar en el futuro",
      },
    },
    cantidad_pezones: {
      type: Number,
      min: [0, "La cantidad de pezones no puede ser negativa"],
      max: [30, "Cantidad de pezones irreal"],
      default: null,
    },
    patas_delanteras: {
      type: String,
      enum: {
        values: ["Buenas", "Regulares", "Malas"],
        message: "{VALUE} no es un estado válido para las patas",
      },
      required: [true, "Debe evaluar las patas delanteras"],
    },
    patas_traseras: {
      type: String,
      enum: {
        values: ["Buenas", "Regulares", "Malas"],
        message: "{VALUE} no es un estado válido para las patas",
      },
      required: [true, "Debe evaluar las patas traseras"],
    },
    historial_pesos: [pesoHistorialSchema],
    nota: {
      type: String,
      trim: true,
      maxlength: [500, "La nota no puede exceder los 500 caracteres"],
      default: null,
    },
    estado_evaluacion: {
      type: String,
      enum: {
        values: ["En Evaluación", "Seleccionada", "Descartada"],
        message: "{VALUE} no es un estado de evaluación válido",
      },
      default: "En Evaluación",
    },
  },
  { _id: true },
);

/**
 * @description Esquema Principal: Grupo de Selección (Contenedor de los animales)
 */
const seleccionGrupoSchema = new mongoose.Schema(
  {
    finca_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Finca",
      required: [
        true,
        "El registro de selección debe estar asociado a una finca",
      ],
    },
    lote_origen_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lote",
      required: [true, "Debe seleccionar el lote de donde proviene la hembra"],
    },
    codigo_grupo: {
      type: String,
      required: [true, "El código de grupo es obligatorio"],
      trim: true,
    },
    animales: {
      type: [animalEvaluacionSchema],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Debe registrar al menos un animal en el grupo de selección",
      },
    },
    nota_grupo: {
      type: String,
      trim: true,
      maxlength: [500, "La nota del grupo no puede exceder los 500 caracteres"],
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

seleccionGrupoSchema.index({ finca_id: 1, codigo_grupo: 1 }, { unique: true });

seleccionGrupoSchema.plugin(mongoosePaginate);

const Seleccion = mongoose.model("Seleccion", seleccionGrupoSchema);
export default Seleccion;
