import dbConnect from "../../lib/mongodb";
import Recipe from "../../models/Recipe";
import { verifyToken } from "../../middleware/auth";
import multer from "multer";

// Configure Multer for file handling
const upload = multer({ storage: multer.memoryStorage() });

// Helper to run Multer as a promise
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

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
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
            : recipe.imageUrl,
        }));
        res.status(200).json({ success: true, data: formattedRecipes });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Error fetching recipes" });
      }
      break;

    case "POST":
      // Run the multer middleware
      await runMiddleware(req, res, upload.single("image"));
      await verifyToken(req, res, async () => {
        try {
          const { title, description, ingredients } = req.body;
          const imageFile = req.file;

          if (!title) {
            throw new Error("Please provide a title for this recipe");
          }

          // Create a new Recipe with the form data
          const newRecipe = await Recipe.create({
            title,
            description,
            ingredients,
            imageData: imageFile ? imageFile.buffer : undefined, // Save image as Buffer
            imageType: imageFile ? imageFile.mimetype : undefined,
            userId: req.user.id,
          });

          res.status(201).json({ success: true, data: newRecipe });
        } catch (error) {
          console.error("Error creating recipe:", error);
          res.status(400).json({ success: false, message: error.message });
        }
      });
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file upload
    maxBodySize: 20 * 1024 * 1024, // Set max body size to 20MB
  },
};
