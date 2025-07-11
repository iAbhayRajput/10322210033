const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { Log } = require("./utils/logger");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const db = {}; // In-memory data store

// Create a new short URL
app.post("/shorturls", async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !url.startsWith("http")) {
    await Log("backend", "error", "validation", "Invalid URL received");
    return res.status(400).json({ error: "Invalid URL" });
  }

  const code = shortcode || uuidv4().slice(0, 6);

  if (db[code]) {
    await Log("backend", "warn", "collision", `Shortcode collision: ${code}`);
    return res.status(409).json({ error: "Shortcode already exists" });
  }

  const expiry = new Date(Date.now() + validity * 60 * 1000);
  db[code] = {
    original: url,
    created: new Date(),
    expiry,
    clicks: []
  };

  await Log("backend", "info", "shortener", `Short URL created: ${code}`);
  res.status(201).json({
    shortLink: `http://localhost:${PORT}/${code}`,
    expiry: expiry.toISOString()
  });
});

// Redirect and track clicks
app.get("/:shortcode", async (req, res) => {
  const code = req.params.shortcode;
  const record = db[code];

  if (!record) {
    await Log("backend", "error", "redirect", `Shortcode not found: ${code}`);
    return res.status(404).json({ error: "Shortcode not found" });
  }

  if (new Date() > new Date(record.expiry)) {
    await Log("backend", "info", "expiry", `Expired URL access: ${code}`);
    return res.status(410).json({ error: "Shortcode expired" });
  }

  record.clicks.push({
    timestamp: new Date().toISOString(),
    source: req.get("Referrer") || "direct",
    location: "IN" // Placeholder
  });

  await Log("backend", "info", "redirect", `Redirected to ${record.original}`);
  res.redirect(record.original);
});

// Get statistics
app.get("/shorturls/:shortcode", async (req, res) => {
  const code = req.params.shortcode;
  const record = db[code];

  if (!record) {
    await Log("backend", "error", "stats", `Stats request for unknown shortcode: ${code}`);
    return res.status(404).json({ error: "Shortcode not found" });
  }

  res.json({
    url: record.original,
    created: record.created,
    expiry: record.expiry,
    totalClicks: record.clicks.length,
    clickDetails: record.clicks
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
