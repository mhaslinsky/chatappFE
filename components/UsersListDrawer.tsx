import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import React from "react";
import { useContext, useState } from "react";
import { SocketContext } from "../context/socket-context";

const UsersListDrawer = () => {
  const ctx = useContext(SocketContext);

  return (
    <Box overflow='auto' w='100%' display={{ base: "unset", md: "none" }} as='aside' backgroundColor='blackAlpha.200'>
      <Heading
        boxShadow='1px 3px 6px 2px rgba(0, 0, 0, 0.2)'
        pt='1.6rem'
        pb='.4rem'
        pl='1rem'
        as='h3'
        fontSize='md'
        mb='1rem'
        letterSpacing='.15rem'
      >
        Online
      </Heading>
      {ctx.connectedUsers.map((user) => {
        return (
          <Flex
            pl='1rem'
            position='relative'
            mb='.2rem'
            flexDirection='row'
            justifyContent='flex-start'
            alignItems='center'
            key={user.id}
          >
            <Box
              border='1px solid gray'
              left='12'
              top={8}
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
export default UsersListDrawer;
