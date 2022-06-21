import express from "express";
import cors from "cors";
import { DB_URL } from "./utils/db.js";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { Hero } from "./models/Hero.js";
import { heroRoutes } from "./routers/hero.routes.js";
import { battlefieldRoutes } from "./routers/battlefields.Routes.js";
import { User } from "./models/User.js";
import { userRoutes } from "./routers/user.routes.js";

// Server
const PORT = process.env.PORT;
const server = express();

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello");
});
cors;
server.use(cors({}));

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

//jwt
server.set("secretKey", process.env.SESSION_SECRET);
// Middlewares
server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ extended: true }));

server.use(express.static(path.join(__dirname, "public")));
//Router
server.use("/", router);
server.use("/heroes", heroRoutes);
server.use("/users", userRoutes);
server.use("/battlefields", battlefieldRoutes);
// Error Control
server.use("*", (req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});
server.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message || "Unexpected error");
});

server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
