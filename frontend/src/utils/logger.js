const axios = require("axios");

async function Log(stack, level, pkg, message) {
  try {
    const res = await axios.post("http://20.244.56.144/logging-service/logs", {
      stack,
      level,
      package: pkg,
      message
    });
    console.log("Log Success:", res.data.message);
  } catch (err) {
    console.error("Log Error:", err.message);
  }
}

module.exports = { Log };
