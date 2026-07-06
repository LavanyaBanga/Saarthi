require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./Middleware/errorHandler");

const app = express();

// Connect Database
connectDB();

// =======================
// CORS Configuration
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://saarthi-5.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

// =======================
// Routes
// =======================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/doctors", require("./routes/doctor"));
app.use("/api/patients", require("./routes/patient"));
app.use("/api/chat", require("./routes/chatRoutes"));

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
