import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist (important for Render/production)
const avatarDir = path.join(__dirname, "../uploads/avatars");
const noteDir = path.join(__dirname, "../uploads/notes");
fs.mkdirSync(avatarDir, { recursive: true });
fs.mkdirSync(noteDir, { recursive: true });

// Avatar storage
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Note image storage
const noteImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, noteDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `note-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter — images only
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, png, webp, gif) are allowed."), false);
  }
};

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
}).single("avatar");

export const uploadNoteImage = multer({
  storage: noteImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
}).single("image");
