import multer from "multer";
import path from "path";
import dbConnect from "../../lib/mongodb";
import Recipe from "../../models/Recipe";
import { verifyToken } from "../../middleware/auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const recipes = await Recipe.find({});
        const formattedRecipes = recipes.map((recipe) => ({
          ...recipe._doc,
          imageUrl: recipe.imageData
            ? `data:${recipe.imageType};base64,${recipe.imageData.toString(
                "base64"
              )}`
            : null,
        }));
        res.status(200).json({ success: true, data: formattedRecipes });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      await runMiddleware(req, res, upload.single("image"));
      // Commenting out the verifyToken middleware
      // verifyToken(req, res, async () => {
      try {
        const { title, description, ingredients } = req.body;
        const imageBuffer = req.file ? req.file.buffer : null;
        const imageType = req.file ? req.file.mimetype : null;

        const recipe = await Recipe.create({
          title,
          description,
          ingredients,
          imageData: imageBuffer,
          imageType,
          userId: req.user ? req.user.id : null,
        });

        res.status(201).json({ success: true, data: recipe });
      } catch (error) {
        console.error("Error in POST /api/recipes:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      // }); // This closing bracket should be removed since we're commenting out the verifyToken
      break;

    case "PUT":
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

    case "DELETE":
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
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
