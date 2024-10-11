import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";
import { getSession } from "next-auth/client";

export default async function handler(req, res) {
  await dbConnect();

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userEmail = session.user.email;

  try {
    const user = await User.findOne({ email: userEmail });

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
        if (!user.favorites.includes(recipeId)) {
          user.favorites.push(recipeId);
          await user.save();
        }
        return res.status(200).json({ message: "Recipe added to favorites" });
      case "DELETE":
        // Remove a recipe from favorites
        const { id } = req.query;
        user.favorites = user.favorites.filter(
          (favoriteId) => favoriteId.toString() !== id
        );
        await user.save();
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
