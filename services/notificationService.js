const Notification = require("../models/Notification");

async function sendNotification() {
  const notification = new Notification({ recipientId, message });
  await notification.save();
}

module.exports = { sendNotification };
