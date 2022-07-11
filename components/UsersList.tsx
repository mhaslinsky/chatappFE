import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import React from "react";
import { useContext, useState } from "react";
import { SocketContext } from "../context/socket-context";

const UsersList = () => {
  const ctx = useContext(SocketContext);

  return (
    <Box display={{ base: "none", md: "unset" }} as='aside' backgroundColor='blackAlpha.200' pl='.5rem' pt='1rem' w='200px'>
      <Heading as='h3' fontSize='md' mb='1rem' letterSpacing='.15rem'>
        Online
      </Heading>
      {ctx.connectedUsers.map((user) => {
        return (
          <Flex position='relative' mb='.2rem' flexDirection='row' justifyContent='flex-start' alignItems='center' key={user.id}>
            <Box
              border='1px solid blackAlpha.200'
              left={7}
              top={7}
              h='18px'
              w='18px'
              backgroundColor='green'
              borderRadius='50%'
              position='absolute'
            ></Box>
            <Image mr='.4rem' w={45} h={45} borderRadius='full' objectFit='cover' src={user.image} alt={user.id} />
            <Flex noOfLines={1} overflow='hidden' text-overflow='ellipsis' fontWeight='600'>
              {user.username}
            </Flex>
          </Flex>
        );
      })}
    </Box>
  );
};
export default UsersList;
