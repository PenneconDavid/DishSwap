import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: [true, "Please add a comment"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
