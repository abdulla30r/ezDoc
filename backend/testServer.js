// Import express
import express from "express";

// Initialize express app
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// POST method
app.post("/data", (req, res) => {
  const { name, age } = req.body; // Extracting data from request body
  res.status(200).json({ message: `Received name: ${name}, age: ${age}` });
});

// Start server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
