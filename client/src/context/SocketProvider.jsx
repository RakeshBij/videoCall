// Import necessary modules and functions from React and socket.io-client.
import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

// Create a context to manage the Socket object and make it accessible to other components.
const SocketContext = createContext(null);

// Define a custom hook to easily access the Socket object in other components.
export const useSocket = () => {
  // Use the useContext hook to retrieve the Socket object from the context.
  const socket = useContext(SocketContext);
  return socket; // Return the Socket object, allowing other components to use it.
};

// Create a component called SocketProvider to set up and manage the Socket connection.
export const SocketProvider = (props) => {
  // Use the useMemo hook to optimize performance by memoizing the Socket object.
  // It creates a new Socket object and connects it to a server at "localhost:8000."
  const socket = useMemo(() => io("localhost:8000"), []);

  // This component makes the Socket object available to other components via the context.
  return (
    <SocketContext.Provider value={socket}>
      {props.children}{" "}
      {/* Render the child components and pass the Socket object down */}
    </SocketContext.Provider>
  );
};
