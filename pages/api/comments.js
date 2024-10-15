import dbConnect from "../../lib/mongodb";
import Comment from "../../models/Comment";
import { verifyToken } from "../../middleware/auth";

export default async function handler(req, res) {
  const { method } = req;

  try {
    await dbConnect();

    switch (method) {
      case "GET":
        try {
          const { recipeId } = req.query;
          if (!recipeId) {
            return res
              .status(400)
              .json({ success: false, message: "Recipe ID is required" });
          }
          const comments = await Comment.find({ recipeId })
            .populate("userId", "name")
            .limit(50)
            .sort({ createdAt: -1 });
          res.status(200).json({ success: true, data: comments });
        } catch (error) {
          console.error("Error fetching comments:", error);
          res
            .status(500)
            .json({ success: false, message: "Error fetching comments" });
        }
        break;

      case "POST":
        try {
          await verifyToken(req, res, async () => {
            const { recipeId, text } = req.body;
            if (!recipeId || !text) {
              return res.status(400).json({
                success: false,
                message: "Recipe ID and text are required",
              });
            }
            const newComment = await Comment.create({
              recipeId,
              userId: req.user.id,
              text,
            });
            res.status(201).json({ success: true, data: newComment });
          });
        } catch (error) {
          console.error("Error creating comment:", error);
          res
            .status(500)
            .json({ success: false, message: "Error creating comment" });
        }
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).json({ success: false, message: "Method not allowed" });
        break;
    }
  } catch (error) {
    console.error("Unhandled error in comments API:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
