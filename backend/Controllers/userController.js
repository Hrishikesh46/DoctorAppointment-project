import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      succes: true,
      message: "Successfully updated",
      data: updateUser,
    });
  } catch (err) {
    res.status(500).json({
      succes: false,
      message: "Failed to update",
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteUser = await User.findByIdAndDelete(id);

    res.status(200).json({
      succes: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      succes: false,
      message: "Failed to delete",
    });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({
      succes: true,
      message: "User found",
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      succes: true,
      message: "User found",
      data: users,
    });
  } catch (err) {
    res.status(404).json({
      succes: false,
      message: "Not found",
    });
  }
};

export const getUserProfile = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        succes: false,
        message: "User not found",
      });
    }

    const { password: pass, ...rest } = user._doc;

    res.status(200).json({
      succes: true,
      message: "Profile: ",
      data: { ...rest },
    });
  } catch (err) {
    res.status(500).json({
      succes: false,
      message: "Something went wrong, cannot get the user",
    });
  }
};

export const getMyAppointments = async (req, res, next) => {
  try {
    //1. retrieve appointments from booking for specific user
    const bookings = await Booking.find({ user: req.userId });

    //2. extract doctor ids from appointment bookings
    const doctorIds = bookings.map((el) => el.doctor.id);

    //3. retrieve doctors using doctor ids
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    res
      .status(200)
      .json({ success: true, message: " Appointments: ", data: doctors });
  } catch (err) {
    res.status(500).json({
      succes: false,
      message: "Something went wrong, cannot get the user",
    });
  }
};
