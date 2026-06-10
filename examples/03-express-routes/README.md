# Example 03 - Express Routes

This example shows a small HTTP JSON service using Express.

In Example 02, we built an HTTP server using Node's built-in `http` module. That helped show what HTTP requests and responses look like at a lower level.

In this example, we use Express to make routing and JSON handling easier.

Express gives us several useful pieces:

* Route handlers such as `app.get()` and `app.post()`
* Path parameters such as `/items/:id`
* Automatic JSON request body parsing with `express.json()`
* Simple JSON responses with `res.json()`
* Status codes with `res.status()`
* Middleware that can run before route handlers

## OpenAPI Specification

This example also includes an OpenAPI specification file:

```text
openapi.yaml
```

An OpenAPI specification is a machine-readable description of an HTTP API. It describes the routes, HTTP methods, request bodies, response bodies, status codes, and data shapes used by the API.

In this example, the OpenAPI file describes routes such as:

```text
GET  /health
GET  /hello
GET  /requests
POST /echo
GET  /items
GET  /items/{id}
```

The Express server in `src/server.js` is the actual running code. The `openapi.yaml` file is documentation that describes how that API is supposed to behave.

You can think of it this way:

```text
src/server.js  = the implementation
openapi.yaml   = the API contract/documentation
```

This is a common practice in real software projects. Teams often use OpenAPI files to document APIs, generate client code, generate server stubs, test endpoints, or share API behavior with other developers.

YAML is indentation-sensitive. Use spaces, not tabs. The examples in this course use 2 spaces per indentation level. When in doubt, copy the surrounding indentation exactly.

Note *If WebStorm does not show the Swagger/OpenAPI preview right away, close `openapi.yaml` and reopen it. Also make sure the file starts with `openapi: 3.0.3`.*

## Running the Example

Move into the example directory:

```bash
cd examples/03-express-routes
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run server
```

The server listens on port `3000` by default.

## Try It in a Browser

Open this URL in a browser:

```text
http://localhost:3000/health
```

You should see:

```json
{
  "status": "ok"
}
```

You can also try:

```text
http://localhost:3000/hello
```

and:

```text
http://localhost:3000/items
```

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
  "message": "Hello from Express"
}
```

### `GET /requests`

```bash
curl http://localhost:3000/requests
```

Example response:

```json
{
  "count": 3
}
```

The exact number may be different depending on how many requests you have sent since starting the server.

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

### `GET /items`

```bash
curl http://localhost:3000/items
```

Expected response:

```json
{
  "items": [
    {
      "id": 1,
      "name": "keyboard"
    },
    {
      "id": 2,
      "name": "mouse"
    },
    {
      "id": 3,
      "name": "monitor"
    }
  ]
}
```

### `GET /items/:id`

The `:id` part of the route is a path parameter.

Try:

```bash
curl http://localhost:3000/items/7
```

Expected response:

```json
{
  "id": 7,
  "name": "Item 7"
}
```

### Unknown Route

```bash
curl http://localhost:3000/missing
```

Expected response:

```json
{
  "error": "Not found"
}
```

## Things to Notice

1. Express lets us write routes directly with `app.get()` and `app.post()`.
2. `express.json()` parses JSON request bodies for us.
3. Route handlers receive `req` and `res` objects.
4. `req.body` contains the parsed JSON body.
5. `req.params` contains path parameters such as `id`.
6. `res.json()` sends a JSON response.
7. Middleware can run before the final route handler.

## How This Connects to REST

This example is not a full REST API yet, but it introduces the route structure used by REST APIs.

A REST-style API often uses routes like:

```text
GET    /items
GET    /items/:id
POST   /items
PUT    /items/:id
DELETE /items/:id
```

In the next lab, you will build on this idea by creating a more complete REST API with multiple routes and proper request handling.