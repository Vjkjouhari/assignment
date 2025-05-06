const Notification = require("../models/Notification");

exports.getNotification = async (req, res) => {
  const { userId } = req.params;
  const notification = await Notification.find({ recipientId: userId }).sort({
    createdAt: -1,
  });
  res.json(notifications);
};

exports.getAllNotificationList = async (req, res) => {
  const allNotification = await Notification.find();
  res.status(200).send({
    message: "All Notification",
    success: true,
    data: allNotification,
  });
};
