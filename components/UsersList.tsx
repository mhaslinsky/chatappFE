import React from "react";
import { useContext, useState } from "react";
import { SocketContext } from "../context/socket-context";

interface user {
  id: string;
  username: string;
  image: string;
}

const UsersList = () => {
  const ctx = useContext(SocketContext);
  const [connectedUsers, setConnectedUsers] = useState<user[]>([]);

  ctx.defaultNamespace.on("connectedUsers", (connectedUsers: user[]) => {
    setConnectedUsers(connectedUsers);
  });

  return (
    <div>
      {connectedUsers.map((user) => {
        return (
          <div key={user.id}>
            <div>{user.image}</div>
            <div>{user.username}</div>
          </div>
        );
      })}
    </div>
  );
};
export default UsersList;
