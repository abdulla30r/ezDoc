import express from "express";
import {
  addDoctor,
  adminLogin,
  allDoctors,
  verifyAdmin,
  appointmentListAdmin,
  cancelAppointment,
  adminDashboard,
} from "../controllers/adminController.js";
import { changeAvailability } from "../controllers/doctorController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", adminLogin);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/verify-admin", authAdmin, verifyAdmin);
adminRouter.get("/all-appointments", authAdmin, appointmentListAdmin);
adminRouter.post("/cancel-appointment", authAdmin, cancelAppointment);
adminRouter.get("/admin-dashboard", authAdmin, adminDashboard);

export default adminRouter;
