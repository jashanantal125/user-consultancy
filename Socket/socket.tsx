import useStore from "../all screens/store";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { type Socket, io } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const sid = useStore((state) => state.sid);

  useEffect(() => {
    if (sid) {
      setSocket(
        io("http://65.0.52.105:9005/astrology", {
          withCredentials: true,
          extraHeaders: {
            sid: sid,
          },
        })
      );
    }
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const socket = useContext(SocketContext);

  if (socket === undefined)
    throw new Error("Can not use useSocket outside SocketProvider");
  return socket;
}
