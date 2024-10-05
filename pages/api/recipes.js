import dbConnect from "../../lib/mongodb";
import Recipe from "../../models/Recipe";
import { verifyToken } from "../../middleware/auth";
import multer from "multer";
import nextConnect from "next-connect";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads", // Store uploaded files in the "public/uploads" directory
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  },
});

apiRoute.use(upload.single("image")); // Use multer for handling the "image" field

apiRoute.post(verifyToken, async (req, res) => {
  try {
    const { title, description, ingredients } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`; // Image path to store in the database

    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      imageUrl,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, data: recipe });
  } catch (error) {
    res.status(400).json({ success: false, error: "Error creating recipe" });
  }
});

apiRoute.get(async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json({ success: true, data: recipes });
  } catch (error) {
    res.status(400).json({ success: false });
  }
});

export default apiRoute;
export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};
