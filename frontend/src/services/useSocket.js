import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://your-server-url"; // Replace with your actual server URL

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io(SOCKET_URL);
    setSocket(socketRef.current);

    // Listen for messages from the server
    socketRef.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup when component is unmounted
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit("message", message);
    }
  };

  return { messages, sendMessage };
}
