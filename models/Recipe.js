import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for this recipe"],
  },
  description: {
    type: String,
  },
  ingredients: {
    type: String,
  },
  imageData: {
    type: Buffer,
  },
  imageType: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);
