import express from "express";

const PORT = process.env.PORT || 3000;

const app = express();

// This middleware tells Express to parse JSON request bodies.
app.use(express.json());

let requestCount = 0;

// Simple middleware that runs before each route.
app.use((req, res, next) => {
    requestCount += 1;
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.get("/hello", (req, res) => {
    res.json({
        message: "Hello from Express"
    });
});

app.get("/requests", (req, res) => {
    res.json({
        count: requestCount
    });
});

app.post("/echo", (req, res) => {
    res.json({
        youSent: req.body
    });
});

app.get("/items", (req, res) => {
    res.json({
        items: [
            {
                id: 1,
                name: "keyboard"
            },
            {
                id: 2,
                name: "mouse"
            },
            {
                id: 3,
                name: "monitor"
            }
        ]
    });
});

app.get("/items/:id", (req, res) => {
    const id = Number(req.params.id);

    res.json({
        id,
        name: `Item ${id}`
    });
});

// This catches requests that did not match any route above.
app.use((req, res) => {
    res.status(404).json({
        error: "Not found"
    });
});

const server = app.listen(PORT, () => {
  console.log(`Express routes example listening on port ${PORT}`);
});

server.on("error", error => {
  console.error("Unable to start server:", error.message);
});