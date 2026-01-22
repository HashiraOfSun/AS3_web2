# Blog CRUD API (Node.js + MongoDB)

## What you need to connect
- Node.js (LTS recommended)
- MongoDB:
  - Local MongoDB running **OR**
  - MongoDB Atlas connection string

## Setup
1) Install deps:
```bash
npm install
```

2) Create `.env` (copy from `.env.example`) and set:
- `MONGODB_URI` (your MongoDB connection string)
- `PORT` (optional)

Example:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/blog_api
```

3) Run:
```bash
npm run dev
# or
npm start
```

Open: http://localhost:3000

## API Endpoints
- POST /blogs
- GET /blogs
- GET /blogs/:id
- PUT /blogs/:id
- DELETE /blogs/:id
