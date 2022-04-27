import mongoose from "mongoose";

const Schema = mongoose.Schema;

const battlefieldSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    heroes: [{ type: mongoose.Types.ObjectId, ref: "Hero" }],
  },
  {
    timestamps: true,
  }
);

const Battlefield = mongoose.model("Battlefields", battlefieldSchema);
export { Battlefield };
