import jwt from "jsonwebtoken";

// user authentication middleware
export const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({ success: false, message: "Unauthorized. Login required" });
    }

    try {
      const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
      req.body.doctorId = token_decode.id;
      next();
    } catch (error) {
      return res.json({ success: false, message: "Unauthorized. Invalid token" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
