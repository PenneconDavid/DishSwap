import dbConnect from "../../../lib/mongodb";
import Recipe from "../../../models/Recipe";
import { verifyToken } from "../../../middleware/auth";

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

    if (method !== "GET") {
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not found in token" });
    }

    const userId = req.user.id;

    const userRecipes = await Recipe.find({ author: userId });
    res.status(200).json({ success: true, data: userRecipes });
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    res.status(400).json({ success: false, message: error.message });
  }
}
