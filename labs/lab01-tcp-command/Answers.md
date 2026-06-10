1. What is the difference between the client and the server?
    * A server is a listener that offers services through requests. A client requests those services from the server
2. Why does the server need to keep running after handling one request?
    * So it can catch other requests because servers usually do not only take one request and then shut down
3. What happens if two clients connect at the same time?
    * Each client gets its own socket and the server handles the multiple connections fine
4. How is this different from HTTP?
    * HTTP contains more information such as headers and metadata. HTTP also usually closes the connection after each request.