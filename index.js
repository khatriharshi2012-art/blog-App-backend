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

const app = express();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("mongoDb connected successfully"))
  .catch((error) => console.log("mongoDB connection error", error.message));

app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/api-docs.json", (req, res) => {
  res.status(200).json(swaggerDocument);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

app.use("/blog", blogRoute);
app.use("/user", userRoute);

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
