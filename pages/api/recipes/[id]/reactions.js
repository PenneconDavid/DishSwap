import dbConnect from "../../../../lib/mongodb";
import Recipe from "../../../../models/Recipe";
import { verifyToken } from "../../../../middleware/auth";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  // Add timeout handling
  res.socket.setTimeout(75000);

  const {
    query: { id },
    method,
    body: { reactionType },
  } = req;

  try {
    await dbConnect();

    switch (method) {
      case "GET":
        try {
          if (!ObjectId.isValid(id)) {
            return res.status(400).json({
              success: false,
              message: "Invalid recipe ID",
            });
          }

          const recipe = await Recipe.findById(id).lean();
          if (!recipe) {
            return res.status(404).json({
              success: false,
              message: "Recipe not found",
            });
          }

          // Safely handle reactions whether they exist or not
          let reactions = {
            Cant_wait: 0,
            Loved_it: 0,
            Disliked: 0,
          };

          // If recipe has reactions, safely merge them
          if (recipe.reactions) {
            try {
              // Handle both Map and plain object cases
              const reactionData =
                recipe.reactions instanceof Map
                  ? Object.fromEntries(recipe.reactions)
                  : typeof recipe.reactions === "object"
                  ? recipe.reactions
                  : {};

              reactions = {
                ...reactions,
                ...reactionData,
              };
            } catch (error) {
              console.error("Error processing reactions:", error);
              // Continue with default reactions if there's an error
            }
          }

          return res.status(200).json({
            success: true,
            data: reactions,
          });
        } catch (error) {
          console.error("Error fetching reactions:", error);
          return res.status(500).json({
            success: false,
            message: "Error fetching reactions",
          });
        }

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

            // Initialize reactions as a plain object if it doesn't exist
            if (!recipe.reactions || typeof recipe.reactions !== "object") {
              recipe.reactions = {
                Cant_wait: 0,
                Loved_it: 0,
                Disliked: 0,
              };
            }

            // Update the reaction count
            const currentCount = recipe.reactions[reactionType] || 0;
            recipe.reactions[reactionType] = currentCount + 1;

            await recipe.save();

            res.status(200).json({
              success: true,
              data: {
                reactionType,
                count: recipe.reactions[reactionType],
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

      default:
        res.status(405).json({
          success: false,
          message: "Method not allowed",
        });
        break;
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
