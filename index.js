require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const blogRoute = require("./routes/blog.routes");
const userRoute = require("./routes/user.routes");
const cors = require("cors");
const {
  swaggerDocument,
  swaggerUi,
  swaggerUiOptions,
} = require("./docs/swagger");

const port = process.env.PORT;
const isProduction = process.env.NODE_ENV === "production";
const configuredOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];
const allowedOrigins = [
  ...configuredOrigins,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];
const localDevOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

const app = express();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("mongoDb connected successfully"))
  .catch((error) => console.log("mongoDB connection error", error.message));

const corsOptions = {
  origin(origin, callback) {
    // Allow tools like Postman or same-origin server requests.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (!isProduction && localDevOriginPattern.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.get("/api-docs.json", (req, res) => {
  res.status(200).json(swaggerDocument);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

app.use("/blog", blogRoute);
app.use("/user", userRoute);

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
