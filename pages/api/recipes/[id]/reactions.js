import dbConnect from "../../../../lib/mongodb";
import Recipe from "../../../../models/Recipe";
import { verifyToken } from "../../../../middleware/auth";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
    body: { reactionType },
  } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      await verifyToken(req, res, async () => {
        try {
          if (!ObjectId.isValid(id)) {
            return res.status(400).json({
              success: false,
              message: "Invalid recipe ID",
            });
          }

          const recipe = await Recipe.findById(id);
          if (!recipe) {
            return res.status(404).json({
              success: false,
              message: "Recipe not found",
            });
          }

          // Initialize reactions Map if it doesn't exist
          if (!recipe.reactions) {
            recipe.reactions = new Map([
              ["Cant_wait", 0],
              ["Loved_it", 0],
              ["Disliked", 0],
            ]);
          }

          // Update the reaction count
          const currentCount = recipe.reactions.get(reactionType) || 0;
          recipe.reactions.set(reactionType, currentCount + 1);

          await recipe.save();

          res.status(200).json({
            success: true,
            data: {
              reactionType,
              count: recipe.reactions.get(reactionType),
            },
          });
        } catch (error) {
          console.error("Error updating reaction:", error);
          res.status(500).json({
            success: false,
            message: "Error updating reaction",
          });
        }
      });
      break;

    case "GET":
      try {
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            message: "Invalid recipe ID",
          });
        }

        const recipe = await Recipe.findById(id);
        if (!recipe) {
          return res.status(404).json({
            success: false,
            message: "Recipe not found",
          });
        }

        res.status(200).json({
          success: true,
          data: Object.fromEntries(recipe.reactions || new Map()),
        });
      } catch (error) {
        console.error("Error fetching reactions:", error);
        res.status(500).json({
          success: false,
          message: "Error fetching reactions",
        });
      }
      break;

    default:
      res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
      break;
  }
}
