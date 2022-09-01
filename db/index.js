require("dotenv").config();
import mongoose from "mongoose";

const DATABASE_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

export const connectDB = async () => {
  return await mongoose.connect(DATABASE_URL, {
    dbName: DB_NAME,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};
