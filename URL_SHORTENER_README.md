# URL Shortener - Full-Stack Application

A complete URL shortener application built with Express.js backend and vanilla HTML/CSS/JS frontend.

## Architecture

- **Backend**: Express.js server (located in `/home/user/API_DB`)
- **Frontend**: Single-page HTML/CSS/JS app (located in `/home/user/artifact_test/public`)
- **Storage**: In-memory Map (data is lost on server restart)

## Features

### Backend API

- **POST /api/shorten** - Create shortened URL
  - Accepts `{ url, customAlias? }`
  - Validates URL format (http/https only)
  - Generates 6-character random alphanumeric code or uses custom alias
  - Returns 409 if alias already exists
  - Returns shortened link with metadata

- **GET /:shortCode** - Redirect to original URL
  - HTTP 302 redirect
  - Increments click counter
  - Returns 404 for unknown codes

- **GET /api/links** - Get all links with stats
  - Returns all shortened links sorted by click count (descending)
  - Includes: shortCode, originalUrl, createdAt, clickCount

- **DELETE /api/links/:shortCode** - Delete a link
  - Returns 204 on success
  - Returns 404 if code doesn't exist

### Frontend Features

- **URL Shortening Form**
  - Input field for URL
  - Optional custom alias field
  - Shorten button

- **Short URL Display**
  - Clickable short URL
  - Copy-to-clipboard button
  - Success feedback

- **Links Table**
  - Shows all created links
  - Original URL (truncated with hover tooltip)
  - Short URL (clickable)
  - Click count
  - Created date
  - Delete button per link

- **Stats Summary Card**
  - Total Links count
  - Total Clicks count
  - Real-time updates

## Installation & Setup

### Backend (API_DB)

```bash
cd /home/user/API_DB
npm install
```

### Running the Application

```bash
cd /home/user/API_DB
npm start
```

Server will start on http://localhost:3000

The frontend is automatically served at http://localhost:3000/

## Testing

The backend includes comprehensive Jest + supertest tests:

```bash
cd /home/user/API_DB
npm test
```

### Test Coverage

- ✅ POST /api/shorten with auto-generated code
- ✅ POST /api/shorten with custom alias
- ✅ 409 error for duplicate alias
- ✅ 400 error for missing URL
- ✅ 400 error for invalid URL format
- ✅ URL validation (accepts http/https, rejects ftp)
- ✅ GET /:shortCode redirect functionality
- ✅ Click count increment on redirect
- ✅ 404 for unknown short codes
- ✅ GET /api/links returns all links sorted by clicks
- ✅ Link properties validation
- ✅ DELETE /api/links/:shortCode success
- ✅ DELETE 404 for non-existent code

All 14 tests pass ✓

## API Examples

### Create short URL with auto-generated code
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.example.com"}'

# Response:
# {
#   "shortCode": "aB3Xy9",
#   "originalUrl": "https://www.example.com",
#   "shortUrl": "http://localhost:3000/aB3Xy9"
# }
```

### Create short URL with custom alias
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.google.com","customAlias":"google"}'

# Response:
# {
#   "shortCode": "google",
#   "originalUrl": "https://www.google.com",
#   "shortUrl": "http://localhost:3000/google"
# }
```

### Get all links
```bash
curl http://localhost:3000/api/links

# Response:
# [
#   {
#     "shortCode": "google",
#     "originalUrl": "https://www.google.com",
#     "createdAt": "2024-01-15T10:30:00.000Z",
#     "clickCount": 5
#   },
#   ...
# ]
```

### Delete a link
```bash
curl -X DELETE http://localhost:3000/api/links/google
# Returns 204 No Content on success
```

## Technologies Used

### Backend
- Express.js 5.2.1
- CORS middleware
- Jest 30.4.2 (testing)
- Supertest 7.2.2 (API testing)

### Frontend
- Vanilla JavaScript (ES6+)
- CSS3 with modern features (Grid, Flexbox)
- Fetch API for HTTP requests
- Clipboard API for copy functionality

## Project Structure

```
API_DB/
├── server.js              # Main Express server
├── server.test.js         # Jest test suite
├── package.json
└── URL_SHORTENER_README.md

artifact_test/
└── public/
    ├── index.html         # Main HTML page
    ├── styles.css         # Styling
    └── app.js             # Frontend logic
```

## Notes

- In-memory storage means all data is lost when server restarts
- Short codes are case-sensitive
- URL validation requires http:// or https:// protocol
- Frontend assumes backend runs on http://localhost:3000
- CORS is enabled for all origins
