import mongoose from "mongoose";
import "dotenv/config";

const DB_URL = process.env.DB_URL;

const connection = mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export { DB_URL, connection };
