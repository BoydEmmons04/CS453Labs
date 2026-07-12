# Lab 5 Starter

## How to Run

```bash
npm install
docker compose up -d
npm run api
npm run client
```

Open:

```text
http://localhost:5173
```

Postgres is exposed on:

```text
postgres://postgres:postgres@localhost:5433/lab05
```

## What Already Works

- Postgres runs in Docker.
- The Express server connects to Postgres.
- The server creates and seeds an `items` table on startup.
- `GET /health`, `GET /api/items`, and `POST /api/items` are implemented.
- The browser client can load items and add a new item.

## What You Need to Add

- `GET /api/items/:id`
- `PUT /api/items/:id`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`
- Better validation and error handling
- Client-side UI for at least some of the new routes

## Graduate Extension

Add one more resource or relationship, such as categories, projects, or tags,
and connect it to the database.

## Reflection Answers

### 1. What changed when the API moved from in-memory data to Postgres?

The way that the data is stored changed. The data is accessed via SQL commands such as SELECT, FROM, and WHERE. This allows for much bigger data sets with easier traversal due to it having an entire query language built to efficiently navigate.

### 2. When should you use `PUT` instead of `PATCH`?

PUT should be used when you want to replace an entire item or resource wiht the payload. PATCH should be used if you want to update an existing item with a partial payload.

### 3. What kinds of validation belong in the API even if the browser client also validates input?

The api validation protects the server and database. It has to include things like checking that the required fields are present, that the IDs given are valid, and that everything is in the right format. The client can check these partially but since a client can bypass the UI, it is best to check it in the API for security.

### 4. How does the browser client help you test the API differently than `curl` alone?

The browser client allows for more human interaction with the app. In a browser, it becomes much easier to test as the inputs are limited to the buttons that are created (obviously you can run commands in the browser dev tab but for quick testing this isnt needed.) Instead of having to memorize the syntax for curl you can simply test with the buttons programmed into the index.html

### 5. If you added an extension, what did you add and why?

Did not add anything, not a grad student.
