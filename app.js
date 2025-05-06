const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/UserRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test-server", (req, res) => {
  res.status(200).send({
    status: 201,
    message: "Server is working fine",
    data: [],
  });
});

app.use("/api/users", userRoutes);
app.use("/api/notification", notificationRoutes);

module.exports = { app };
