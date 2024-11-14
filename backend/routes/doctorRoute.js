import express from "express";
import {
  doctorList,
  doctorLogin,
  verifyDoctor,
  getAppointments,
  getDoctorData,
  cancelAppointment,
  completeAppointment,
  getDoctorDashboard,
} from "../controllers/doctorController.js";
import { authDoctor } from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/verify-doctor", authDoctor, verifyDoctor);
doctorRouter.get("/doctor-appointments", authDoctor, getAppointments);
doctorRouter.get("/doctor-profile", authDoctor, getDoctorData);
doctorRouter.get("/doctor-dashboard", authDoctor, getDoctorDashboard);
doctorRouter.post("/cancel-appointment", cancelAppointment);
doctorRouter.post("/complete-appointment", completeAppointment);

export default doctorRouter;
