import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";

//app config
const app = express();
const port = process.env.port || 4000;
// Connect to database
try {
  connectDB();
  console.log("Database connected successfully");
} catch (error) {
  console.error("Database connection failed:", error);
}

// Connect to Cloudinary
try {
  connectCloudinary();
  console.log("Cloudinary connected successfully");
} catch (error) {
  console.error("Cloudinary connection failed:", error);
}

//middleware
app.use(express.json());
app.use(cors());

//api endpoint
app.use("/api/admin", adminRouter);
//localhost:4000/api/admin
app.use("/api/doctor", doctorRouter);
//localhost:4000/api/doctor

app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
