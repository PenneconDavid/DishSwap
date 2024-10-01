import dbConnect from "../../lib/mongodb";
import User from "../../models/User";
import Recipe from "../../models/Recipe";
import { verifyToken } from "../../middleware/auth";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      verifyToken(req, res, async () => {
        try {
          // Get the user's profile information and their recipes
          const user = await User.findById(req.user.id);
          const recipes = await Recipe.find({ userId: req.user.id });

          res.status(200).json({
            success: true,
            data: { user, recipes },
          });
        } catch (error) {
          res
            .status(400)
            .json({ success: false, message: "Could not fetch user profile" });
        }
      });
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
