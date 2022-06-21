import express from "express";
import { Hero } from "../models/Hero.js";
import { isAuth } from "../authentication/jwt.js";
import { upload, uploadToCloudinary } from "../middlewares/file.middlewares.js";

const router = express.Router();
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

router.get("/", async (req, res) => {
  try {
    return fetchHeroes(res, null, req.query.page, req.query.numItems);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/character/:character", async (req, res) => {
  const { character } = req.params;

  try {
    return fetchHeroes(res, { character }, req.query.page, req.query.numItems);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/role/:role", async (req, res) => {
  const { role } = req.params;

  try {
    return fetchHeroes(res, { role }, req.query.page, req.query.numItems);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/universe/:universe", async (req, res) => {
  const { universe } = req.params;

  try {
    return fetchHeroes(res, { universe }, req.query.page, req.query.numItems);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/difficulty/:difficulty", async (req, res) => {
  const { difficulty } = req.params;

  try {
    return fetchHeroes(res, { difficulty }, req.query.page, req.query.numItems);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/", [isAuth], async (req, res, next) => {
  try {
    const newHero = new Hero({
      character: req.body.character,
      role: req.body.role,
      difficulty: req.body.difficulty,
      universe: req.body.universe,
      description: req.body.description,
      image: req.body.image,
    });
    const createdHero = await newHero.save();
    return res.status(201).json(createdHero);
  } catch (error) {
    next(error);
  }
});

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

const fetchHeroes = async (res, filter, page, numItems) => {
  const totalHeroes = await Hero.count();
  const heroes = await Hero.find(filter)
    .skip(page * numItems)
    .limit(numItems);
  const count = heroes.length;
  if (count > 0) {
    return res.status(200).json({ count, heroes, totalHeroes });
  } else {
    return res.status(404).json(`No heroes found by this filter: ${filter}`);
  }
};

export { router as heroRoutes };
