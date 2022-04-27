import express from "express";
import { Battlefield } from "../models/Battlefields.js";
import { isAuth } from "../authentication/jwt.js";
import { upload, uploadToCloudinary } from "../middlewares/file.middlewares.js";
const router = express.Router();

router.get("/", [isAuth], async (req, res, next) => {
  try {
    const battlefields = await Battlefield.find().populate("heroes");
    return res.status(200).json(battlefields);
  } catch (error) {
    return next(error);
  }
});
router.get("/play/:play", async (req, res, next) => {
  try {
    const battlefields = await Battlefield.find();
    return res.status(200).json(battlefields);
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/",
  [isAuth, upload.single("image"), uploadToCloudinary],
  async (req, res, next) => {
    try {
      const image = req.file_url || null;
      const newBattlefield = new Battlefield({
        name: req.body.name,
        image: image,
        heroes: [],
      });
      const createdBattlefield = await newBattlefield.save();
      return res.status(201).json(createdBattlefield);
    } catch (error) {
      next(error);
    }
  }
);

router.put("/add-hero", [isAuth], async (req, res, next) => {
  try {
    const { battlefieldId } = req.body;
    const { heroId } = req.body;
    const updatedBattlefield = await Battlefield.findByIdAndUpdate(
      battlefieldId,
      { $push: { heroes: heroId } },
      { new: true }
    );
    return res.status(200).json(updatedBattlefield);
  } catch (error) {
    return next(error);
  }
});
router.delete("/:id", [isAuth], async (req, res, next) => {
  try {
    const { id } = req.params;
    await Battlefield.findByIdAndDelete(id);
    return res.status(200).json("Battlefield deleted!");
  } catch (error) {
    return next(error);
  }
});

export { router as battlefieldRoutes };
