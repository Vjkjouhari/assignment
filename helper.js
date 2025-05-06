// eventBus
const Eventemitter = require("events");
const eventQueue = new Eventemitter();
module.exports = eventQueue;
