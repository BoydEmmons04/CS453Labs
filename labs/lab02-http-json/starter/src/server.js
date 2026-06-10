import http from "node:http";

const DEFAULT_PORT = 3000;

let requestCount = 0;

// Helper function that sends a JSON with the given status code
export function sendJson(res, statusCode, body) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(body));
}

// Helper function that reads the JSON and returns a promise for a parsed object
export function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            if (body.trim() === "") {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on("error", reject);
    });
}

export function handleCalculate(body) {
    // Get the operation and operands from the request
    const { operation, a, b } = body;

    // Validate the input and return 400 if invalid
    if (operation === undefined || a === undefined || b === undefined) {
        return {
            statusCode: 400,
            response: { error: "Missing required fields: operation, a, b" }
        };
    }

    // Validat that a and b are numbers
    if (typeof a !== "number" || typeof b !== "number" || !Number.isFinite(a) || !Number.isFinite(b)) {
        return {
            statusCode: 400,
            response: { error: "Fields a and b must be finite numbers" }
        };
    }

    // Perforn requested operation and check for invalid operations and div by 0
    if (operation === "add") {
        return {
            statusCode: 200,
            response: { result: a + b }
        };
    } else if (operation === "subtract") {
        return {
            statusCode: 200,
            response: { result: a - b }
        };
    } else if (operation === "multiply") {
        return {
            statusCode: 200,
            response: { result: a * b }
        };
    } else if (operation === "divide") {
        if (b === 0) {
            return {
                statusCode: 400,
                response: { error: "Division by zero is not allowed" }
            }
        }
        else {
            return {
                statusCode: 200,
                response: { result: a / b }
            }
        }
    } else {
        return {
            statusCode: 400,
            response: { error: `Unsupported operation: ${operation}` }
        }
    }
}

// Helper function that handles incoming request by method and url
export async function requestHandler(req, res) {
    requestCount += 1;

    const method = req.method;
    const url = req.url;

    if (method === "GET" && url === "/health") {
        sendJson(res, 200, { status: "ok" });
        return;
    }

    if (method === "GET" && url === "/requests") {
        // Return the total number of requests with code 200
        sendJson(res, 200, { count: requestCount });
        return;
    }

    if (method === "POST" && url === "/echo") {
        try {
            const body = await readJsonBody(req);

            // calls the sendJson function with the body
            sendJson(res, 200, body);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    if (method === "POST" && url === "/calculate") {
        try {
            const body = await readJsonBody(req);
            const result = handleCalculate(body);

            sendJson(res, result.statusCode, result.response);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    sendJson(res, 404, { error: "Not found" });
}

export function createServer() {
    return http.createServer(requestHandler);
}

export function resetState() {
    requestCount = 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const port = process.env.PORT || DEFAULT_PORT;
    const server = createServer();

    server.listen(port, () => {
        console.log(`HTTP JSON server listening on port ${port}`);
    });
}