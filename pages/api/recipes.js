import nc from "next-connect";
import dbConnect from "../../lib/mongodb";
import multer from "multer";
import Recipe from "../../models/Recipe";
import { verifyToken } from "../../middleware/verifyToken";
import { getUserByEmail } from "../../utils/userUtils";

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something went wrong!");
  },
  onNoMatch: (req, res) => {
    res.status(405).end("Method not allowed");
  },
});

// Set up multer for image upload
const upload = multer({
  storage: multer.memoryStorage(),
});

handler.use(verifyToken); // Middleware for user authentication

// Route to create a new recipe
handler.post(upload.single("image"), async (req, res) => {
  await dbConnect();

  try {
    const { title, description, ingredients } = req.body;
    const userEmail = req.user.email; // Assuming verifyToken adds the email to req.user

    // Create a new recipe instance
    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      userId: req.user.id, // Assuming verifyToken adds user id to req.user
    });

    // If an image is uploaded, add it to the recipe
    if (req.file) {
      newRecipe.imageData = req.file.buffer;
      newRecipe.imageType = req.file.mimetype;
    }

    // Save the recipe
    const savedRecipe = await newRecipe.save();

    // Add recipe to the user's uploaded recipes (optional)
    const user = await getUserByEmail(userEmail);
    user.uploadedRecipes = user.uploadedRecipes || [];
    user.uploadedRecipes.push(savedRecipe._id);
    await user.save();

    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create recipe" });
  }
});

// Route to get all recipes
handler.get(async (req, res) => {
  await dbConnect();

  try {
    const recipes = await Recipe.find({});
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch recipes" });
  }
});

/**
 * Route to add/remove a favorite recipe
 * This route updates the favorite status of a recipe for the authenticated user.
 */
handler.patch(async (req, res) => {
  await dbConnect();

  try {
    const { recipeId, action } = req.body; // 'action' should be either 'add' or 'remove'
    const userEmail = req.user.email;

    const user = await getUserByEmail(userEmail);

    if (action === "add") {
      if (!user.favorites.includes(recipeId)) {
        user.favorites.push(recipeId);
        await user.save();
        return res.status(200).json({ message: "Recipe added to favorites" });
      }
    } else if (action === "remove") {
      user.favorites = user.favorites.filter(
        (favoriteId) => favoriteId.toString() !== recipeId
      );
      await user.save();
      return res.status(200).json({ message: "Recipe removed from favorites" });
    }

    return res
      .status(400)
      .json({ message: "Invalid action or recipe already in favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update favorite status" });
  }
});

// NOTE: Ensure the max body size is defined for large file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default handler;
