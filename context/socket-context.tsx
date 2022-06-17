import React, { useEffect, useState } from "react";
import Namespace from "../models/Namespace";
import { io, Socket } from "socket.io-client";

type SocketContextObj = {
  setUserName: (un: string) => void;
  setAvailableNamespaces: (nsData: Namespace[]) => void;
  setNamespace: (nsSocket: Socket) => void;
  availableNamespaces: Namespace[] | null;
  currentNamespace: Socket | null;
  currentRoom: string | null;
  userName: string | null;
};

export const SocketContext = React.createContext<SocketContextObj>({
  setUserName: (un: string) => {},
  setAvailableNamespaces: (nsData: Namespace[]) => {},
  setNamespace: (nsSocket: Socket) => {},
  availableNamespaces: null,
  currentNamespace: null,
  currentRoom: null,
  userName: null,
});

const SocketContextProvider: React.FC<{ children: any }> = (props) => {
  const [userName, setUserName] = useState<string>("");
  const [availableNamespaces, setAvailableNamespaces] = useState<
    Namespace[] | null
  >(null);
  const [curNsSocket, setCurNs] = useState<Socket | null>(null);

  const connectChatServer = (username: string) => {
    const socketMain = io(`${process.env.SOCKETIO}`, {
      query: { username },
    });
    return socketMain;
  };

  useEffect(() => {
    if (!userName) return;
    setCurNs(connectChatServer(userName));
    return () => {
      curNsSocket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  function setNamespace(nsSocket: Socket) {
    setCurNs(nsSocket);
  }

  function setUN(un: string) {
    setUserName(un);
  }

  function setNSs(nsData: Namespace[]) {
    setAvailableNamespaces(nsData);
  }

  const contextValue: SocketContextObj = {
    setUserName: setUN,
    setAvailableNamespaces: setNSs,
    setNamespace,
    userName,
    availableNamespaces,
    currentNamespace: curNsSocket,
    currentRoom: null,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
