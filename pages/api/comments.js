import dbConnect from "../../lib/mongodb";
import Comment from "../../models/Comment";
import { verifyToken } from "../../middleware/auth";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get(async (req, res) => {
  await dbConnect();
  try {
    const { recipeId } = req.query;
    if (!recipeId) {
      return res
        .status(400)
        .json({ success: false, message: "Recipe ID is required" });
    }
    const comments = await Comment.find({ recipeId });
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching comments" });
  }
});

handler.post(verifyToken, async (req, res) => {
  await dbConnect();
  try {
    const { recipeId, text } = req.body;
    if (!recipeId || !text) {
      return res
        .status(400)
        .json({ success: false, message: "Recipe ID and text are required" });
    }
    const newComment = await Comment.create({
      recipeId,
      userId: req.user.id,
      text,
    });
    res.status(201).json({ success: true, data: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ success: false, message: "Error creating comment" });
  }
});

export default handler;
