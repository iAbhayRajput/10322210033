// index.js
const axios = require("axios");

/**
 * Log function to send logs to the test server
 * 
 * @param {string} stack - "backend" or "frontend"
 * @param {string} level - log level: "info", "warn", "error", "fatal"
 * @param {string} pkg - the part of app like "shortener", "redirect", "validation"
 * @param {string} message - what happened
 */
async function Log(stack, level, pkg, message) {
  try {
    const response = await axios.post("http://20.244.56.144/logging-service/logs", {
      stack: stack,
      level: level,
      package: pkg,
      message: message
    });

    console.log(" Log Success:", response.data.message);
  } catch (error) {
    console.error(" Log Failed:", error.message);
  }
}

module.exports = { Log };
