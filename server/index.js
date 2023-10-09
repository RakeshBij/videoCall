// Import the Server class from the 'socket.io' library.
import { Server } from "socket.io";

// Create a new WebSocket server instance on port 8000 with CORS enabled.
const io = new Server(8000, {
  cors: true,
});

// Create maps to associate email addresses with socket IDs and vice versa.
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

// Listen for new WebSocket connections.
io.on("connection", (socket) => {
  // Log when a new socket connection is established, along with its ID.
  console.log(`Socket Connected`, socket.id);

  // Handle the "room:join" event, which is emitted by clients when joining a room.
  socket.on("room:join", (data) => {
    const { email, room } = data;

    // Map the user's email to their socket ID and vice versa.
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);

    // Emit a "user:joined" event to all clients in the room, indicating a new user joined.
    io.to(room).emit("user:joined", { email, id: socket.id });

    // Join the specified room.
    socket.join(room);

    // Emit a "room:join" event to the current socket to confirm the room join.
    io.to(socket.id).emit("room:join", data);
  });

  // Handle various signaling events for WebRTC communication.
  socket.on("user:call", ({ to, offer }) => {
    // Forward a call offer to the specified user.
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    // Notify the caller that the call has been accepted.
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    // Handle negotiation needed events for WebRTC.
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    // Handle negotiation done events for WebRTC.
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});
