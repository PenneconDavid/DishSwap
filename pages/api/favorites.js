import dbConnect from "../../lib/mongodb";
import User from "../../models/User";
import { verifyToken } from "../../middleware/auth";
import {
  getUserByEmail,
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "../../utils/userUtils";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  try {
    await verifyToken(req, res, async () => {
      const userEmail = req.user.email;

      switch (method) {
        case "GET":
          const favorites = await User.findOne({ email: userEmail })
            .populate("favorites")
            .select("favorites");
          return res.status(200).json(favorites);

        case "POST":
          const { recipeId } = req.body;
          const user = await getUserByEmail(userEmail);
          await addFavoriteRecipe(user, recipeId);
          return res.status(200).json({ message: "Recipe added to favorites" });

        case "DELETE":
          const { id } = req.query;
          const userToUpdate = await getUserByEmail(userEmail);
          await removeFavoriteRecipe(userToUpdate, id);
          return res
            .status(200)
            .json({ message: "Recipe removed from favorites" });

        default:
          res.setHeader("Allow", ["GET", "POST", "DELETE"]);
          return res.status(405).end(`Method ${method} Not Allowed`);
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
