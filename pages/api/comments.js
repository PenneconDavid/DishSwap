import dbConnect from "../../lib/mongodb";
import Comment from "../../models/Comment";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST": // Post a new comment
      try {
        const { recipeId, userId, text } = req.body;
        const newComment = await Comment.create({ recipeId, userId, text });
        res.status(201).json({ success: true, data: newComment });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "GET": // Get all comments for a recipe, populated with user details
      try {
        const { recipeId } = req.query;
        const comments = await Comment.find({ recipeId }).populate(
          "userId",
          "name"
        );
        res.status(200).json({ success: true, data: comments });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
