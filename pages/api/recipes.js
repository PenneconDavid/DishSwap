import dbConnect from "../../lib/mongodb";
import Recipe from "../../models/Recipe";
import { verifyToken } from "../../middleware/auth";

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
      verifyToken(req, res, async () => {
        try {
          const recipe = await Recipe.create({
            ...req.body,
            userId: req.user.id,
          });
          res.status(201).json({ success: true, data: recipe });
        } catch (error) {
          res.status(400).json({ success: false });
        }
      });
      break;

    case "PUT": // Update a recipe
      verifyToken(req, res, async () => {
        try {
          const { id } = req.query;
          const recipe = await Recipe.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
          if (!recipe) {
            return res
              .status(400)
              .json({ success: false, message: "Recipe not found" });
          }
          res.status(200).json({ success: true, data: recipe });
        } catch (error) {
          res.status(400).json({ success: false });
        }
      });
      break;

    case "DELETE": // Delete a recipe
      verifyToken(req, res, async () => {
        try {
          const { id } = req.query;
          const recipe = await Recipe.findByIdAndDelete(id);
          if (!recipe) {
            return res
              .status(400)
              .json({ success: false, message: "Recipe not found" });
          }
          res
            .status(200)
            .json({ success: true, message: "Recipe deleted successfully" });
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
