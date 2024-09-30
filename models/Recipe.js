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
  imageUrl: {
    type: String,
  },
});

export default mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);
