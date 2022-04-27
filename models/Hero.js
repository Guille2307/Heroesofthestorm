import mongoose from "mongoose";

const Schema = mongoose.Schema;

const heroSchema = new Schema(
  {
    character: { type: String, required: true },
    role: { type: String },
    difficulty: { type: String },
    universe: { type: String },
    description: { type: String },
    image: { type: String },
  },
  {
    // Esta propiedad servirá para guardar las fechas de creación y actualización de los documentos
    timestamps: true,
  }
);

// Creamos y exportamos el modelo Movie
const Hero = mongoose.model("Hero", heroSchema);

export { Hero };
