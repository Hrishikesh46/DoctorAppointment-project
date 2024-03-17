import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// const generateToken = async (user) => {
//   return jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET_KEY,
//     {
//       expiresIn: "15d",
//     }
//   );
// };

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;
  try {
    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }

    // check if user exist
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = await User.create({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    if (role === "doctor") {
      user = await Doctor.create({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    res.status(200).json({
      success: true,
      message: "User successfully created.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = null;
    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    // check if user exist or not
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compare password
    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });
    }

    // get token if password matches
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15d",
      }
    );

    const { password: pass, role, appointment, ...rest } = user._doc;

    res.status(200).json({
      status: true,
      message: "Successful Login",
      token: token,
      data: { rest },
      role,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to Login" });
  }
};
