import dbConnect from "../../lib/mongodb";
import Recipe from "../../models/Recipe";
import { verifyToken } from "../../middleware/auth"; // Import the middleware

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const recipes = await Recipe.find({});
        res.status(200).json({ success: true, data: recipes });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      // Use the middleware to verify token before allowing access
      verifyToken(req, res, async () => {
        try {
          const recipe = await Recipe.create(req.body);
          res.status(201).json({ success: true, data: recipe });
        } catch (error) {
          res.status(400).json({ success: false });
        }
      });
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
