import dbConnect from "../../../lib/mongodb";
import Recipe from "../../../models/Recipe";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get(async (req, res) => {
  await dbConnect();

  const { id } = req.query;

  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Including image handling logic
    if (recipe.imageData && recipe.imageType) {
      res.setHeader("Content-Type", recipe.imageType);
      return res.status(200).send(recipe.imageData);
    }

    return res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default handler;
