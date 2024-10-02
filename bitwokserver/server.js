const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Sirve los archivos estáticos (HTML, CSS, JS) en la carpeta 'public'
app.use(express.static("public"));

// Conexión de WebSocket
io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado:", socket.id);

  // Evento para manejar la señalización de WebRTC
  socket.on("signal", (data) => {
    io.to(data.target).emit("signal", {
      signal: data.signal,
      from: socket.id,
    });
  });

  // Evento para manejar los mensajes de chat
  socket.on("chatMessage", (message) => {
    // Reenvía el mensaje a todos los usuarios conectados
    socket.broadcast.emit("chatMessage", message);
  });

  // Evento para notificar la desconexión
  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
