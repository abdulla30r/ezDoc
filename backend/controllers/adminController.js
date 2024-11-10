// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file.path;
    
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      console.log("all fields are required");
      return res.json({ success: false, message: "All fields are required" });
    } else {
      res.json("ok");
    }
  } catch (error) {
    res.json(error);
  }
};

export { addDoctor };
