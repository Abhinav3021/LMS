import multer from "multer";
import path from "path";
import AppError from "../utils/AppError";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },

  filename: (_req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(
        Math.random() * 1e9
      ) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const allowedTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Only PDF/JPG/PNG files allowed",
        400
      )
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize:
      5 * 1024 * 1024,
  },
  fileFilter,
});

export default upload;