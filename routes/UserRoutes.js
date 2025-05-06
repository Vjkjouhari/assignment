const express = require("express");
const User = require("../models/User");
const { sendNotification } = require("../services/notificationService");
const eventBus = require("../helper");
const Post = require("../models/Post");

const router = express.Router();

// mock "follow" action
router.post("/:followerId/follow/:followeeId", async (req, res) => {
  const { followerId, followeeId } = req.params;
  const follower = await User.findById(followerId);
  const followee = await User.findById(followeeId);

  if (!follower || !followee) return res.status(404).send("User not found");

  // simulate notification
  eventBus.emit("userFollowed", {
    recipientId: followeeId,
    message: `${follower.name} followed you`,
  });

  res.send("Followed & notification triggered");
});

router.get("/get-all-users", async (req, res) => {
  const page = parseInt(req.query.page) || 2;
  const limit = parseInt(req.query.limit) || 30;
  const allUsers = await User.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).send({
    message: "Data Fetch",

    success: true,
    data: allUsers,

    page,
    // totalPages: Math.ceil(total / limit),
  });
});

router.get("/get-post-by-id/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const allPosts = await Post.find({ author: userId }); // use 'user' not '_id'
    res.status(200).send({
      message: "Data Fetch",
      success: true,
      data: allPosts,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching posts",
      success: false,
      error: error.message,
    });
  }
});

eventBus.on("userFollowed", async ({ recipientId, message }) => {
  await sendNotification(recipientId, message);
});

module.exports = router;
