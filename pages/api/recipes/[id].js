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
        res.status(200).json({ success: true, data: recipe });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
