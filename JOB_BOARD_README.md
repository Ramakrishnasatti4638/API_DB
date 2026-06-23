# Job Board Backend API

A RESTful API for managing job postings built with Express.js and better-sqlite3.

## Features

- Full CRUD operations for job listings
- Filter jobs by type (full-time, part-time, remote)
- Automatic database seeding with sample data
- Comprehensive test suite with Jest and Supertest

## Tech Stack

- **Express.js** - Web framework
- **better-sqlite3** - SQLite database
- **CORS** - Cross-origin resource sharing
- **Jest** - Testing framework
- **Supertest** - HTTP assertions

## Database Schema

```sql
CREATE TABLE jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  salary TEXT NOT NULL,
  posted_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

### GET /api/jobs
Get all jobs or filter by type.

**Query Parameters:**
- `type` (optional): Filter by job type (`full-time`, `part-time`, `remote`)

**Example:**
```bash
# Get all jobs
curl http://localhost:3002/api/jobs

# Get only remote jobs
curl http://localhost:3002/api/jobs?type=remote
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Senior Software Engineer",
    "company": "TechCorp",
    "location": "San Francisco, CA",
    "type": "full-time",
    "salary": "$120k - $160k",
    "posted_at": "2024-01-15 10:30:00"
  }
]
```

### POST /api/jobs
Create a new job posting.

**Request Body:**
```json
{
  "title": "Backend Developer",
  "company": "StartupXYZ",
  "location": "Austin, TX",
  "type": "remote",
  "salary": "$90k - $120k"
}
```

**Response:** `201 Created`
```json
{
  "id": 10,
  "title": "Backend Developer",
  "company": "StartupXYZ",
  "location": "Austin, TX",
  "type": "remote",
  "salary": "$90k - $120k",
  "posted_at": "2024-01-15 14:20:00"
}
```

### DELETE /api/jobs/:id
Delete a job posting by ID.

**Example:**
```bash
curl -X DELETE http://localhost:3002/api/jobs/5
```

**Response:** `200 OK`
```json
{
  "message": "Job deleted successfully"
}
```

## Installation

```bash
npm install
```

## Running the Server

```bash
# Start the jobs API server
npm run start:jobs

# Server runs on http://localhost:3002
```

## Running Tests

```bash
npm test
```

## Test Coverage

The test suite includes:
- ✅ GET all jobs
- ✅ GET jobs with type filter
- ✅ GET jobs with non-existent type (returns empty array)
- ✅ POST new job with valid data
- ✅ POST job with missing fields (returns 400)
- ✅ DELETE existing job
- ✅ DELETE non-existent job (returns 404)

## Sample Data

The database is automatically seeded with 8 sample jobs on first run:
- Senior Software Engineer (TechCorp) - Full-time
- Frontend Developer (StartupHub) - Full-time
- Backend Engineer (CloudSystems) - Remote
- Full Stack Developer (WebSolutions) - Full-time
- UI/UX Designer (DesignCo) - Part-time
- DevOps Engineer (InfraTech) - Remote
- Mobile Developer (AppFactory) - Full-time
- Product Manager (InnovateLabs) - Part-time

## Error Handling

All endpoints include proper error handling:
- `400 Bad Request` - Missing required fields
- `404 Not Found` - Job not found
- `500 Internal Server Error` - Database errors

## CORS

CORS is enabled for all origins to allow frontend integration.
