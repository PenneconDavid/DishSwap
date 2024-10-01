import dbConnect from "../../lib/mongodb";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST": // Register or login
      const { name, email, password, type } = req.body; // 'type' can be 'login' or 'register'

      if (type === "register") {
        try {
          // Check if user already exists
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res
              .status(400)
              .json({ success: false, message: "User already exists" });
          }

          // Hash the password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          // Create a new user
          const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
          });

          // Generate a JWT token
          const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          res.status(201).json({ success: true, data: newUser, token });
        } catch (error) {
          res.status(400).json({ success: false });
        }
      } else if (type === "login") {
        try {
          // Check if the user exists
          const user = await User.findOne({ email });
          if (!user) {
            return res
              .status(400)
              .json({ success: false, message: "Invalid credentials" });
          }

          // Check if the password matches
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res
              .status(400)
              .json({ success: false, message: "Invalid credentials" });
          }

          // Generate a JWT token
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          res.status(200).json({ success: true, token });
        } catch (error) {
          res.status(400).json({ success: false });
        }
      }
      break;

    case "GET": // Get all users (for testing purposes)
      try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
