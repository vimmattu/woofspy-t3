import io from "socket.io-client";
import { useEffect } from "react";
import { useSocket } from "../hooks/socket";

const SocketTest: React.FC = (props) => {
  useSocket();

  return <h1>hello</h1>;
};

export default SocketTest;
