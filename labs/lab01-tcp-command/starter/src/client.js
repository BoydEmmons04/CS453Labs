import net from "node:net";
import readline from "node:readline";

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 4000);

const socket = net.createConnection({ host: HOST, port: PORT }, () => {
  console.log(`Connected to echo server at ${HOST}:${PORT}`);
});

socket.setEncoding("utf8");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> "
});

socket.on("data", (data) => {
  process.stdout.write(data);

  // Fixed crash when client sends quit
  if (!socket.destroyed && !rl.closed) {
    rl.prompt();
  }
});

socket.on("end", () => {
  console.log("Disconnected from server.");
  rl.close();
});

socket.on("error", (err) => {
  console.error("Client error:", err.message);
  rl.close();
});

rl.on("line", (line) => {
  socket.write(`${line}\n`);

  if (line.trim().toUpperCase() === "QUIT") {
    rl.close();
  }
});

rl.on("close", () => {
  if (!socket.destroyed) {
    socket.end();
  }
});
