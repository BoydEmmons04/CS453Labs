# Example 02 - HTTP + JSON

This example shows a simple HTTP server that sends and receives JSON.

## Running the Example

Move into the example directory:

```bash
cd examples/02-http-json
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run server
```

## Try It in a Browser

Open this URL in a browser:

http://localhost:3000/health

You should see:

```json
{
"status": "ok"
}
```
You can also try:

http://localhost:3000/hello

## Testing with curl

You can test the server from the terminal using `curl`.

### `GET /health`

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

### `GET /hello`

```bash
curl http://localhost:3000/hello
```

Expected response:

```json
{
  "message": "Hello from the HTTP JSON server"
}
```

### `POST /echo`

For `POST` requests with JSON, include the `Content-Type` header and a JSON request body.

```bash
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
```

Expected response:

```json
{
  "youSent": {
    "message": "hello"
  }
}
```

### Invalid JSON Example

This sends malformed JSON on purpose:

```bash
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"message":'
```

Expected response:

```json
{
  "error": "Invalid JSON"
}
```
