import { Box, Flex, Image } from "@chakra-ui/react";
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
    <Box w={200}>
      {connectedUsers.map((user) => {
        return (
          <Flex flexDirection='row' justifyContent='center' key={user.id}>
            <Image w={45} h={45} borderRadius='full' objectFit='cover' src={user.image} alt={user.id} />
            <Flex>{user.username}</Flex>
          </Flex>
        );
      })}
    </Box>
  );
};
export default UsersList;
