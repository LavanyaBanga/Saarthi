const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let doctor = await Doctor.findById(decoded.id).select("-password");

    if (doctor) {
      const doctorObj = doctor.toObject();

      req.user = {
        ...doctorObj,
        id: doctorObj._id.toString(),
        _id: doctorObj._id,
        role: "doctor",
      };

      return next();
    }

    let patient = await Patient.findById(decoded.id).select("-password");

    if (patient) {
      const patientObj = patient.toObject();

      req.user = {
        ...patientObj,
        id: patientObj._id.toString(),
        _id: patientObj._id,
        role: "patient",
      };

      return next();
    }

    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  } catch (err) {
    console.log("JWT ERROR:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};

module.exports = { protect, authorize };