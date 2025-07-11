import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Link,
} from "@mui/material";
import axios from "axios";
import { Log } from "./utils/logger";

function App() {
  const [urls, setUrls] = useState([
    { url: "", validity: "", shortcode: "", result: null },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const addUrlInput = () => {
    if (urls.length < 5) {
      setUrls([
        ...urls,
        { url: "", validity: "", shortcode: "", result: null },
      ]);
    }
  };

  const handleSubmit = async () => {
    const newUrls = [...urls];

    for (let i = 0; i < newUrls.length; i++) {
      const { url, validity, shortcode } = newUrls[i];

      // Basic validation
      if (!url || !url.startsWith("http")) {
        await Log(
          "frontend",
          "warn",
          "validation",
          `Invalid URL at index ${i}`
        );
        newUrls[i].result = { error: "Invalid URL" };
        continue;
      }

      try {
        const res = await axios.post("http://localhost:8000/shorturls", {
          url,
          validity: validity ? parseInt(validity) : undefined,
          shortcode: shortcode || undefined,
        });

        newUrls[i].result = res.data;
        await Log(
          "frontend",
          "info",
          "shortener",
          `URL shortened at index ${i}`
        );
      } catch (err) {
        newUrls[i].result = {
          error: err.response?.data?.error || "Error",
        };
        await Log(
          "frontend",
          "error",
          "shortener",
          `Failed at index ${i}: ${err.message}`
        );
      }
    }

    setUrls(newUrls);
  };

  const handleCopy = (shortUrl) => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    alert("Short URL copied to clipboard!");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {urls.map((entry, i) => (
        <Box key={i} mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Long URL"
                value={entry.url}
                onChange={(e) => handleChange(i, "url", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Validity (mins)"
                value={entry.validity}
                onChange={(e) => handleChange(i, "validity", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Custom Shortcode"
                value={entry.shortcode}
                onChange={(e) => handleChange(i, "shortcode", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              {entry.result && entry.result.error ? (
                <Typography variant="body2" color="error">
                  Error: {entry.result.error}
                </Typography>
              ) : (
                entry.result?.shortLink && (
                  <>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ color: "text.primary" }}
                    >
                      Short URL:{" "}
                      <Link
                        href={entry.result.shortLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "primary.light",
                          wordBreak: "break-word",
                          display: "inline-block",
                        }}
                      >
                        {entry.result.shortLink}
                      </Link>
                    </Typography>

                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleCopy(entry.result.shortLink)}
                      sx={{ mt: 1 }}
                    >
                      Copy
                    </Button>
                  </>
                )
              )}
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        variant="outlined"
        onClick={addUrlInput}
        disabled={urls.length >= 5}
      >
        Add URL
      </Button>

      <Button variant="contained" onClick={handleSubmit} sx={{ ml: 2 }}>
        Shorten URLs
      </Button>
    </Container>
  );
}

export default App;
