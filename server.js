const mongoose = require("mongoose");
require("dotenv").config();
const { app } = require("./app");

const PORT = process.env.PORT || 3005;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
