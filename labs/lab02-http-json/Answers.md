1. What is the difference between a TCP message and an HTTP request?
* TCP is the most basic level and HTTP is a structured format for information. TCP is a transport layer byte stream. HTTP is an application layer protocol
2. What does the `Content-Type: application/json` header tell the server?
* This tells the server that the body of the request is formatted as JSON. It tells the server to parse the data as JSON.
3. Why should a server return different HTTP status codes for different situations?
* The individual codes allow for much easier debugging and allows the client to know exactly what is going on with each request
4. What happens if the client sends invalid JSON?
* It gets caught by the try catch statements in each method check and returns the 400 error code with the error "Invalid JSON"
5. How is this lab different from Lab 1?
* There is much more error detection and a focus on formatting. Instead of simply sending data to the console log, it is formatted as HTTP with error codes and JSON formatting.