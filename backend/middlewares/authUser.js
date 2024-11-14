import jwt from "jsonwebtoken";

// user authentication middleware
export const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: "Unauthorized. Login required" });
    }

    try {
      const token_decode = jwt.verify(token, process.env.JWT_SECRET);
      req.body.userId = token_decode.id;
      next();
    } catch (error) {
      return res.json({ success: false, message: "Unauthorized. Invalid token" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
