import { useEffect } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || "");

    socket.on("connect", () => {
      console.log("hello");
    });

    return () => {
      socket.close();
    };
  });
};
