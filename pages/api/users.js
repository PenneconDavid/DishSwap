import dbConnect from "../../lib/mongodb";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req, res) => {
  await dbConnect();
  const { name, email, password, type } = req.body;

  if (type === "register") {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(201).json({ success: true, data: newUser, token });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else if (type === "login") {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ success: true, token });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid type" });
  }
});

handler.get(async (req, res) => {
  await dbConnect();
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default handler;
