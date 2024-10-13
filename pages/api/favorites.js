import dbConnect from "../../lib/mongodb";
import {
  getUserByEmail,
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "../../utils/userUtils";
import { getSession } from "next-auth/client";

export default async function handler(req, res) {
  await dbConnect();

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userEmail = session.user.email;

  try {
    const user = await getUserByEmail(userEmail);

    switch (req.method) {
      case "GET":
        // Fetch favorite recipes
        const favorites = await User.findOne({ email: userEmail })
          .populate("favorites")
          .select("favorites");
        return res.status(200).json(favorites);
      case "POST":
        // Add a recipe to favorites
        const { recipeId } = req.body;
        await addFavoriteRecipe(user, recipeId);
        return res.status(200).json({ message: "Recipe added to favorites" });
      case "DELETE":
        // Remove a recipe from favorites
        const { id } = req.query;
        await removeFavoriteRecipe(user, id);
        return res
          .status(200)
          .json({ message: "Recipe removed from favorites" });
      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
