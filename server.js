import express from "express";
import dotenv from "dotenv";
import DBconnect from "./db.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoutes.js";
import movieRoute from "./routes/movieRoute.js";
dotenv.config();
import { errorHandler } from "./middleware/errorHandler.js";

const PORT = process.env.PORT || 8888;

const app = express();

// app.use(cors({
//     credentials: true,
//     origin: 'http://localhost:5173'

//   }));


app.use(
  cors({
    credentials: true,
    origin: [
      "*",
      // "https://666cc6c50c30bb4afe236965--splendorous-biscuit-7dffcl.netlify.app",
    // "https://movie-flex-sca-project-c1-g6.netlify.app/",
    // "https://scaacademy-movie-flex-project-g6.netlify.app/",
    "https://sca-academy-at-project-c1-g6.netlify.app/",
      "http://localhost:5173",
    ],
  })
);



app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use(errorHandler);

app.listen(PORT, () => {
  DBconnect();
  console.log(`server is running on PORT ${PORT}`);
});

//https://documenter.getpostman.com/view/34756068/2sA3XQggwr           api documention
