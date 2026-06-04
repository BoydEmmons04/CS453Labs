import net from "node:net";
import { handleCommand, shouldCloseConnection } from "./commands.js";

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 4000);

const server = net.createServer((socket) => {
  const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;

  console.log(`Client connected: ${clientAddress}`);

  socket.setEncoding("utf8");

  socket.write("Welcome to the CS453 command server.\n");
  socket.write("Commands: ECHO, UPPER, LOWER, REVERSE, TIME, QUIT\n");

  socket.on("data", (data) => {
    const lines = data.split(/\r?\n/).filter((line) => line.length > 0);

    for (const line of lines) {
      console.log(`Received from ${clientAddress}: ${line}`);

      const response = handleCommand(line);
      socket.write(`${response}\n`);

      if (shouldCloseConnection(line)) {
        socket.end();
        return;
      }
    }
  });

  socket.on("end", () => {
    console.log(`Client disconnected: ${clientAddress}`);
  });

  socket.on("error", (err) => {
    console.error(`Socket error from ${clientAddress}:`, err.message);
  });
});

server.on("error", (err) => {
  console.error("Server error:", err.message);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`Command server listening on ${HOST}:${PORT}`);
});