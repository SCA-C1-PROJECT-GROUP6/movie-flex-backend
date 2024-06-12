import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURL = process.env.MONGO_URL;

const DBconnect = async () => {
  try {
    const connection = await mongoose.connect(mongoURL);

    if (connection) {
      console.log("mongoDB connected successfully");
    }
  } catch (error) {
    //    throw Error
    console.error("mongoDB connection failed:", error.message);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});

export default DBconnect;
