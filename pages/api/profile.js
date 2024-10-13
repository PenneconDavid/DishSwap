import dbConnect from "../../utils/dbConnect";
import { verifyToken } from "../../middleware/verifyToken";
import { getUserByEmail } from "../../utils/userUtils";
import nc from "next-connect";

const handler = nc();

// Use middleware to verify authentication
handler.use(verifyToken);

handler.get(async (req, res) => {
  await dbConnect();

  try {
    const userEmail = req.user.email; // Assuming verifyToken adds the email to req.user
    const user = await getUserByEmail(userEmail);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default handler;
