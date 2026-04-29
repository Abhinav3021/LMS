import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes";
import errorMiddleware from "./middlewares/error.middleware";
import AppError from "./utils/AppError";

const app = express();

app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static("uploads")
);

app.use("/api/v1", routes);

app.use((_req, _res, next) => {
  next(
    new AppError(
      "Route not found",
      404
    )
  );
});

app.use(errorMiddleware);

export default app;