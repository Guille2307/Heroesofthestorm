import express from "express";
import { Hero } from "../models/Hero.js";
import { isAuth } from "../authentication/jwt.js";
import { upload, uploadToCloudinary } from "../middlewares/file.middlewares.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = Math.abs(req.query.page);
    const numItems = Math.abs(req.query.numItems);
    const heroes = await Hero.find()
      .skip(page * numItems)
      .limit(numItems);
    return res.status(200).json(heroes);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json(`This id isn\`t correct`);
    }
    const heroes = await Hero.findById(id);
    if (heroes) {
      return res.status(200).json(heroes);
    } else {
      return res.status(404).json(`No hero found by this id`);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});
router.get("/character/:character", async (req, res) => {
  const { character } = req.params;

  try {
    const characterBycharacter = await Hero.find({ character: character });
    if (characterBycharacter.length > 0) {
      return res.status(200).json(characterBycharacter);
    } else {
      return res
        .status(404)
        .json(`No heroes found by this character: ${character}`);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});
router.get("/role/:role", async (req, res) => {
  const { role } = req.params;

  try {
    const characterByrole = await Hero.find({ role: role });
    if (characterByrole.length > 0) {
      return res.status(200).json(characterByrole);
    } else {
      return res.status(404).json(`No heroes found by this role: ${role}`);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/universe/:universe", async (req, res) => {
  const { universe } = req.params;

  try {
    const characterByuniverse = await Hero.find({ universe: universe });
    if (characterByuniverse.length > 0) {
      return res.status(200).json(characterByuniverse);
    } else {
      return res
        .status(404)
        .json(`No heroes found by this universe: ${universe}`);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/difficulty/:difficulty", async (req, res) => {
  const { difficulty } = req.params;

  try {
    const characterBydifficulty = await Hero.find({ difficulty: difficulty });
    if (characterBydifficulty.length > 0) {
      return res.status(200).json(characterBydifficulty);
    } else {
      return res
        .status(404)
        .json(`No heroes found by this difficulty: ${difficulty}`);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post(
  "/",
  [isAuth, upload.single("image"), uploadToCloudinary],
  async (req, res, next) => {
    try {
      const image = req.file_url || null;
      const newHero = new Hero({
        character: req.body.character,
        role: req.body.role,
        difficulty: req.body.difficulty,
        universe: req.body.universe,
        description: req.body.description,
        image: image,
      });
      const createdHero = await newHero.save();
      return res.status(201).json(createdHero);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", [isAuth], async (req, res, next) => {
  try {
    const { id } = req.params;
    await Hero.findByIdAndDelete(id);
    return res.status(200).json("Character deleted!");
  } catch (error) {
    return next(error);
  }
});
router.put("/:id", [isAuth], async (req, res, next) => {
  try {
    const { id } = req.params;
    const hero = new Hero(req.body);
    hero._id = id;
    await Hero.findByIdAndUpdate(id, hero);
    return res.status(200).json(hero);
  } catch (error) {
    return next(error);
  }
});

export { router as heroRoutes };
