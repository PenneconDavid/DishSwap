import dbConnect from "../../lib/mongodb";
import Comment from "../../models/Comment";
import { verifyToken } from "../../middleware/auth"; // Import the JWT middleware

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET": // Allow anyone to fetch comments
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

    case "POST": // Protect this route with JWT, only logged-in users can post comments
      verifyToken(req, res, async () => {
        try {
          const { recipeId, text } = req.body;
          const newComment = await Comment.create({
            recipeId,
            userId: req.user.id, // req.user comes from the decoded JWT
            text,
          });
          res.status(201).json({ success: true, data: newComment });
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
