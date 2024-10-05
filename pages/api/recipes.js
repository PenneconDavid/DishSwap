import dbConnect from "../../lib/mongodb";
import Recipe from "../../models/Recipe";
import { verifyToken } from "../../middleware/auth";
import multer from "multer";
import path from "path";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Helper function to handle file upload
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const recipes = await Recipe.find({});
        res.status(200).json({ success: true, data: recipes });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        await runMiddleware(req, res, upload.single("image"));
        verifyToken(req, res, async () => {
          const { title, description, ingredients } = req.body;
          const imageBuffer = req.file ? req.file.buffer : null;
          const imageType = req.file ? req.file.mimetype : null;

          const recipe = await Recipe.create({
            title,
            description,
            ingredients,
            imageData: imageBuffer,
            imageType,
            userId: req.user.id,
          });

          res.status(201).json({ success: true, data: recipe });
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "PUT": // Update a recipe
      verifyToken(req, res, async () => {
        try {
          const { id } = req.query;
          const recipe = await Recipe.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
          if (!recipe) {
            return res
              .status(400)
              .json({ success: false, message: "Recipe not found" });
          }
          res.status(200).json({ success: true, data: recipe });
        } catch (error) {
          res.status(400).json({ success: false });
        }
      });
      break;

    case "DELETE": // Delete a recipe
      verifyToken(req, res, async () => {
        try {
          const { id } = req.query;
          const recipe = await Recipe.findByIdAndDelete(id);
          if (!recipe) {
            return res
              .status(400)
              .json({ success: false, message: "Recipe not found" });
          }
          res
            .status(200)
            .json({ success: true, message: "Recipe deleted successfully" });
        } catch (error) {
          res.status(400).json({ success: false });
        }
      });
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
