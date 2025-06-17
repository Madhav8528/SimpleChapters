# 📘 Chapter Performance Dashboard - Backend API

A RESTful backend service for managing and analyzing chapter performance in an educational platform. Built with Node.js, Express, MongoDB, and Redis.

---

## 🚀 EC2 Deployment Link

**Base URL:** [http://56.228.28.130:5055](http://56.228.28.130:5055)

---

## 📦 API Endpoints

### 1. `GET /api/v1/chapters`

Returns a paginated and filterable list of chapters.

#### 🔸 Query Parameters (optional):
| Name           | Type     | Description                               |
|----------------|----------|-------------------------------------------|
| `class`        | String   | Filter by class (e.g., "11")              |
| `unit`         | Number   | Filter by unit number                     |
| `subject`      | String   | Filter by subject name                    |
| `status`       | String   | Filter by status ("Completed", etc.)      |
| `weakChapters` | Boolean  | Filter weak chapters (`true` or `false`)  |
| `page`         | Number   | Page number (default = 1)                 |
| `limit`        | Number   | Results per page (default = 10)           |

#### ✅ Example:

```
GET /api/v1/chapters?class=11&subject=Physics&weakChapters=true&page=1&limit=5
```

---

### 2. `GET /api/v1/chapters/:id`

Returns a single chapter by its MongoDB ID.

#### ✅ Example:

```
GET /api/v1/chapters/6654e5e7f763ac9c9a4a1456
```

---

### 3. `POST /api/v1/chapters` (Admin Only)

Uploads a JSON file of chapters to the database. Requires `x-admin: true` header.

#### 🔸 Headers:

```
x-admin: true
Content-Type: multipart/form-data
```

#### 🔸 Body:
Upload a `.json` file using key: `file`

#### 🔸 Behavior:
- Valid entries are inserted into MongoDB.
- Invalid entries are skipped and returned in the response.
- Redis cache for chapter list is invalidated.

---

## 🧰 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **Redis** for caching and rate limiting
- **PM2** for process management
- **Multer** for file uploads
- **Deployed on:** Amazon EC2

---

## 🛠️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# Install dependencies
npm install

# Create .env file
PORT=5055
MONGODB_CONNECTION_STRING=your_mongodb_connection_string
REDIS_URL=your_redis_url

# Start the server
npm run dev   # for local development
# or
pm2 start src/index.js --name chapters-app
```

---

## 🔐 Environment Variables

| Key                        | Description                              |
|----------------------------|------------------------------------------|
| `PORT`                    | Port to run the server (default 5055)    |
| `MONGODB_CONNECTION_STRING`| MongoDB connection string                 |
| `REDIS_URL`               | Redis connection string                   |

---

## 🔄 Rate Limiting

- 30 requests/minute per IP address
- Powered by Redis

---

## ⚙️ Caching

- `GET /api/v1/chapters` is cached for 1 hour.
- Cache is cleared automatically when new chapters are uploaded.

---

## 📫 Contact

If you have questions, feel free to reach out at `madhavv8528@gmail.com`.
