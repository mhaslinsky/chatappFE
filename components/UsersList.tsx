import { Box, Flex, Heading, Image } from "@chakra-ui/react";
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
    console.log("users changing: " + connectedUsers);
    setConnectedUsers(connectedUsers);
  });

  return (
    <Box display={{ base: "none", md: "unset" }} as='aside' backgroundColor='blackAlpha.200' pl='.5rem' pt='1rem' w='200px'>
      <Heading as='h3' fontSize='md' mb='1rem' letterSpacing='.15rem'>
        Online
      </Heading>
      {connectedUsers.map((user) => {
        return (
          <Flex position='relative' mb='.2rem' flexDirection='row' justifyContent='flex-start' alignItems='center' key={user.id}>
            <Box
              border='1px solid white'
              left={7}
              top={7}
              h='20px'
              w='20px'
              backgroundColor='green'
              borderRadius='50%'
              position='absolute'
            ></Box>
            <Image mr='.4rem' w={45} h={45} borderRadius='full' objectFit='cover' src={user.image} alt={user.id} />
            <Flex fontWeight='600'>{user.username}</Flex>
          </Flex>
        );
      })}
    </Box>
  );
};
export default UsersList;
