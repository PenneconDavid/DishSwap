import dbConnect from "../../../lib/mongodb";
import Recipe from "../../../models/Recipe";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
          return res
            .status(404)
            .json({ success: false, error: "Recipe not found" });
        }

        // Convert image data to Base64 if it exists
        const imageUrl = recipe.imageData
          ? `data:${recipe.imageType};base64,${recipe.imageData.toString(
              "base64"
            )}`
          : recipe.imageUrl; // For older recipes with an external URL

        // Send the recipe with the Base64 image or the existing image URL
        res.status(200).json({
          success: true,
          data: {
            ...recipe._doc,
            imageUrl, // Ensure imageUrl is included for frontend compatibility
          },
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
