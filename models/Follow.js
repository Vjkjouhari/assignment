const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // the one who follows
  following: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // the one being followed
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Follow", FollowSchema);
