
# URL Shortener with Logging Middleware

This repository contains a full-stack application built for the Affordmed/Afrio Campus Hiring Evaluation. It consists of:

-  A Node.js backend microservice for shortening URLs
-  A React frontend UI with Material UI styling
-  A reusable Logging Middleware used across frontend and backend
-  Dark mode-compatible design

---

## Folder Structure

```
/<roll_number>/
├── backend/             # Express.js API for URL shortening
├── frontend/            # React.js frontend UI
└── logging-middleware/  # Shared reusable logging logic
```

---

## Features

### Backend
- Custom or auto-generated shortcodes
- Default expiry time: 30 mins (if not specified)
- URL redirection and expiry validation
- Real-time click tracking (timestamp, source, location)
- Integrated logging middleware for each event

### Frontend
- Add and shorten up to 5 URLs at a time
- Input fields: URL, validity (in minutes), and optional shortcode
- Displays shortened URLs + expiry
- "Copy URL" button with clipboard access
- Fully responsive, dark theme with Material UI
- Frontend-side logging using shared middleware

---

## UI Screenshot

> Heres How final UI looks:

<img width="284" height="477" alt="ui" src="https://github.com/user-attachments/assets/767a4da0-aff8-4528-b83d-eccf4dc755c8" />


---

##  API Endpoints

###  1. **Create Short URL**
**POST** `/shorturls`

```http
http://localhost:8000/shorturls
```

####  Request Body:
```json
{
  "url": "https://example.com/page",
  "validity": 45,
  "shortcode": "custom123"
}
```

#### Response:
```json
{
  "shortLink": "http://localhost:8000/custom123",
  "expiry": "2025-01-01T00:30:00.000Z"
}
```

---

### 2. **Get URL Statistics**
**GET** `/shorturls/:shortcode`

```http
http://localhost:8000/shorturls/custom123
```

#### Response:
```json
{
  "url": "https://example.com/page",
  "created": "2025-01-01T00:00:00.000Z",
  "expiry": "2025-01-01T00:30:00.000Z",
  "totalClicks": 3,
  "clickDetails": [
    {
      "timestamp": "2025-01-01T00:01:00.000Z",
      "source": "direct",
      "location": "IN"
    }
  ]
}
```

---

### 3. **Redirect to Original URL**
**GET** `/:shortcode`

```http
http://localhost:8000/custom123
```

Redirects user to the original long URL if the link is valid and not expired.

---
---

## API Status Codes

| Endpoint                         | Status Code | Description                                                                 |
|----------------------------------|-------------|-----------------------------------------------------------------------------|
| **POST** `/shorturls`           | `201 Created` | Successfully created short URL                                              |
|                                  | `400 Bad Request` | Invalid or missing `url` field                                              |
|                                  | `409 Conflict`   | Shortcode already exists                                                    |
|                                  | `500 Internal Server Error` | Unexpected error during creation                                |
| **GET** `/shorturls/:shortcode` | `200 OK`    | Successfully retrieved short URL stats                                      |
|                                  | `404 Not Found` | Shortcode does not exist                                                    |
| **GET** `/:shortcode`           | `302 Found` | Successfully redirected to original URL                                     |
|                                  | `404 Not Found` | Shortcode does not exist                                                    |
|                                  | `410 Gone`   | Link has expired                                                            |


## Logging Middleware

This app uses a custom logger across frontend and backend to log all actions to the Affordmed logging server:

**POST** `http://20.244.56.144/logging-service/logs`

#### Example Usage:
```js
await Log("backend", "info", "shortener", "Short URL created");
await Log("frontend", "error", "validation", "Invalid URL entered");
```

#### Payload:
```json
{
  "stack": "frontend",
  "level": "warn",
  "package": "validation",
  "message": "Invalid URL input"
}
```

---

## Registration was also done (Completed)

- Registered at:
  ```
  POST http://20.244.56.144/evaluation-service/register
  ```
- Received and safely stored:
  - `clientID`
  - `clientSecret`
  - `access_token`

---

## How to Run

### Backend
```bash
cd backend
npm install
node index.js
# or use nodemon:
# npx nodemon index.js
```
Backend will be served at: `http://localhost:8000`

---

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend will be served at: `http://localhost:3000`

---

