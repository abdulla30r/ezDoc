import doctorModel from "../models/doctorModel.js";
import appointModel from "../models/appointmentModel.js";
import authDoctor from "../middlewares/authDoctor.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
    res.json({ success: true, message: `Availability updated for doctor: ${docData.name}` });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyDoctor = async (req, res) => {
  res.json({ success: true });
};

const getDoctorData = async (req, res) => {
  const { doctorId } = req.body;
  try {
    const doctor = await doctorModel.findById(doctorId).select("-password -email");
    res.json({ success: true, doctor });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getAppointments = async (req, res) => {
  const docId = req.body.doctorId;
  try {
    const appointments = await appointModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  const { appointmentId, dToken } = req.body;
  if (!dToken) {
    return res.json({ success: false, message: "Unauthorized. Login required" });
  }
  try {
    const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);
    const docId = token_decode.id;

    const appointmentData = await appointModel.findById(appointmentId);
    if (!appointmentData.docId === docId) {
      return res.json({ success: false, message: "Unauthorized. Invalid token" });
    }

    await appointModel.findByIdAndUpdate(appointmentId, { cancelled: true });
    res.json({ success: true, message: "Appointment Cancelled Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const completeAppointment = async (req, res) => {
  const { appointmentId, dToken } = req.body;
  if (!dToken) {
    return res.json({ success: false, message: "Unauthorized. Login required" });
  }
  try {
    const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);
    const docId = token_decode.id;

    const appointmentData = await appointModel.findById(appointmentId);
    if (!appointmentData.docId === docId) {
      return res.json({ success: false, message: "Unauthorized. Invalid token" });
    }
    if (!appointmentData.payment) {
      res.json({ success: false, message: "Payment not done" });
    }

    await appointModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
    res.json({ success: true, message: "Appointment Completed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { changeAvailability, doctorList, doctorLogin, verifyDoctor, getDoctorData, getAppointments, cancelAppointment, completeAppointment };
