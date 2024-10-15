import dbConnect from "../../lib/mongodb";
import User from "../../models/User";
import { verifyToken } from "../../middleware/auth";
import { addFavoriteRecipe, removeFavoriteRecipe } from "../../utils/userUtils";

export default async function handler(req, res) {
  await dbConnect();

  try {
    await new Promise((resolve, reject) => {
      verifyToken(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const { method } = req;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not found in token" });
    }

    const userId = req.user.id;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      switch (method) {
        case "GET":
          const favorites = await User.findById(userId)
            .populate("favorites")
            .select("favorites");
          return res.status(200).json(favorites);

        case "POST":
          const { recipeId } = req.body;
          await addFavoriteRecipe(user, recipeId);
          return res.status(200).json({ message: "Recipe added to favorites" });

        case "DELETE":
          const { id } = req.query;
          await removeFavoriteRecipe(user, id);
          return res
            .status(200)
            .json({ message: "Recipe removed from favorites" });

        default:
          res.setHeader("Allow", ["GET", "POST", "DELETE"]);
          return res.status(405).end(`Method ${method} Not Allowed`);
      }
    } catch (error) {
      console.error("Error in favorites handler:", error);
      return res.status(400).json({ message: error.message });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
