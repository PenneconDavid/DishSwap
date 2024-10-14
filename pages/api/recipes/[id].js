import dbConnect from "../../../lib/mongodb";
import Recipe from "../../../models/Recipe";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        if (!ObjectId.isValid(id)) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid recipe ID" });
        }

        const recipe = await Recipe.findById(id);
        if (!recipe) {
          return res
            .status(404)
            .json({ success: false, error: "Recipe not found" });
        }

        const imageUrl = recipe.imageData
          ? `data:${recipe.imageType};base64,${recipe.imageData.toString(
              "base64"
            )}`
          : recipe.imageUrl;

        res.status(200).json({
          success: true,
          data: {
            ...recipe._doc,
            imageUrl,
          },
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
