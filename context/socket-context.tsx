import React, { useEffect, useState } from "react";
import Namespace from "../models/Namespace";
import Room from "../models/Room";
import { io, Socket } from "socket.io-client";

type SocketContextObj = {
  setUserName: (un: string) => void;
  // setDefaultNamespace: (ns: Socket) => void;
  setAvailableNamespaces: (nsData: Namespace[]) => void;
  setAvailableRooms: (roomData: Room[]) => void;
  setNamespace: (nsSocket: Socket) => void;
  setRoom: (room: string) => void;
  defaultNamespace: Socket;
  availableNamespaces: Namespace[] | null;
  availableRooms: Room[] | null;
  currentNamespace: Socket | null;
  currentRoom: string | null;
  userName: string | null;
};

export const SocketContext = React.createContext<SocketContextObj>({
  setUserName: (un: string) => {},
  // setDefaultNamespace: (ns: Socket) => {},
  setAvailableNamespaces: (nsData: Namespace[]) => {},
  setAvailableRooms: (roomData: Room[]) => {},
  setNamespace: (nsSocket: Socket) => {},
  setRoom: (room: string) => {},
  defaultNamespace: io(`${process.env.SOCKETIO}/`),
  availableNamespaces: null,
  availableRooms: null,
  currentNamespace: null,
  currentRoom: null,
  userName: null,
});

const SocketContextProvider: React.FC<{ children: any }> = (props) => {
  const [userName, setUN] = useState<string>("");
  const [defaultNamespace, setDefaultNamespace] = useState<Socket>(io(`${process.env.SOCKETIO}/`));
  const [availableNamespaces, setAvailableNamespaces] = useState<Namespace[] | null>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[] | null>(null);
  const [currentNamespace, setCurrentNamespace] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  const connectChatServer = (username: string) => {
    const socketMain = io(`${process.env.SOCKETIO}/warcraft`, {
      query: { username },
    });
    return socketMain;
  };

  useEffect(() => {}, []);

  //login logic
  useEffect(() => {
    let currentSocket;
    if (!userName) return;
    if (localStorage.getItem("lastNamespace")) {
      const lastNamespace = JSON.parse(localStorage.getItem("lastNamespace")!).namespace;
      currentSocket = io(`${process.env.SOCKETIO}${lastNamespace}`, {
        query: { username: userName },
      });
      setCurrentNamespace(currentSocket);
      if (localStorage.getItem("lastRoom")) {
        const lastRoom = JSON.parse(localStorage.getItem("lastRoom")!).room;
        setCurrentRoom(lastRoom);
        currentSocket?.emit("joinRoom", lastRoom);
      }
    } else {
      localStorage.setItem("lastNamespace", JSON.stringify({ namespace: "/warcraft" }));
      setCurrentNamespace(connectChatServer(userName));
    }
    return () => {
      currentNamespace?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  currentNamespace?.on("nsList", (nsData) => {
    setAvailableNamespaces(nsData);
  });

  currentNamespace?.on("nsRoomLoad", (roomData: Room[]) => {
    setAvailableRooms(roomData);
  });

  function setNamespace(nsSocket: Socket) {
    /*@ts-ignore*/
    localStorage.setItem("lastNamespace", JSON.stringify({ namespace: nsSocket.nsp }));
    setCurrentNamespace(nsSocket);
  }
  function setRoom(room: string) {
    localStorage.setItem("lastRoom", JSON.stringify({ room }));
    setCurrentRoom(room);
  }
  function setUserName(un: string) {
    setUN(un);
  }
  function setNSs(nsData: Namespace[]) {
    setAvailableNamespaces(nsData);
  }
  function setRMs(rmData: Room[]) {
    setAvailableRooms(rmData);
  }

  const contextValue: SocketContextObj = {
    setUserName,
    setAvailableNamespaces: setNSs,
    setAvailableRooms: setRMs,
    setNamespace,
    setRoom,
    defaultNamespace,
    userName,
    availableNamespaces,
    currentNamespace,
    availableRooms,
    currentRoom,
  };

  return <SocketContext.Provider value={contextValue}>{props.children}</SocketContext.Provider>;
};

export default SocketContextProvider;
