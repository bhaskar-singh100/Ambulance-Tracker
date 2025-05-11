import io from "socket.io-client";

// Initialize a single Socket.IO instance
const socket = io("https://ambulance-tracker-backend.onrender.com", {
  transports: ["websocket"],
  autoConnect: true,
});

// Log connection for debugging
socket.on("connect", () => {
  console.log("Socket.IO connected with ID:", socket.id);
});

// Log connection errors
socket.on("connect_error", (err) => {
  console.error("Socket.IO connection error:", err);
});

export default socket;
