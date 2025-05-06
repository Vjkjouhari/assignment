const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");

router.get("/get-all-notification", controller.getAllNotificationList);
router.get("/:userId", controller.getNotification);

module.exports = router;
