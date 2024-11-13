import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }
    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }
    // Validate password strength
    if (!validator.isStrongPassword(password)) {
      return res.json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData); // Create an instance of the model
    const user = await newUser.save(); // Save it manually
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });

    // Create a new user document
  } catch (error) {
    // Handle any potential errors during registration
    res.json({ success: false, message: error.message });
  }
};

// API to login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Credential" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Credential" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to get user profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }
    await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender });

    if (imageFile) {
      const imgUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imgUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const userData = await userModel.findById(userId).select("-password"); // Get user data
    const docData = await doctorModel.findById(docId).select("-password"); // Get doctor data
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor is not available" });
    }
    let slot_booked = docData.slots_booked;

    if (slot_booked[slotDate]) {
      if (slot_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot is not available" });
      } else {
        slot_booked[slotDate].push(slotTime);
      }
    } else {
      slot_booked[slotDate] = [];
      slot_booked[slotDate].push(slotTime);
    }

    delete docData.slots_booked;
    const newAppointment = new appointmentModel({ userId, docId, slotDate, slotTime, userData, docData, amount: docData.fees, date: Date.now() });
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slot_booked });
    res.json({ success: true, message: "Appointment Booked Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user appointments
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment };
