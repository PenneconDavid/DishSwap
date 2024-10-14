import dbConnect from "../../lib/mongodb";
import User from "../../models/User";
import { verifyToken } from "../../middleware/auth";
import {
  getUserByEmail,
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "../../utils/userUtils";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(verifyToken);

handler.get(async (req, res) => {
  await dbConnect();
  try {
    const userEmail = req.user.email;
    const favorites = await User.findOne({ email: userEmail })
      .populate("favorites")
      .select("favorites");
    return res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

handler.post(async (req, res) => {
  await dbConnect();
  try {
    const userEmail = req.user.email;
    const { recipeId } = req.body;
    const user = await getUserByEmail(userEmail);
    await addFavoriteRecipe(user, recipeId);
    return res.status(200).json({ message: "Recipe added to favorites" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

handler.delete(async (req, res) => {
  await dbConnect();
  try {
    const userEmail = req.user.email;
    const { id } = req.query;
    const user = await getUserByEmail(userEmail);
    await removeFavoriteRecipe(user, id);
    return res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default handler;
