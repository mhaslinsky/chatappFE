import { Box, Flex, Heading, Image, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useContext } from "react";
import { SocketContext } from "../context/socket-context";

const UsersList = () => {
  const ctx = useContext(SocketContext);
  const RMBGColor = useColorModeValue("rgba(222, 222, 222, 0.353)", "rgba(0, 0, 0, 0.637)");
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      borderLeft='2px solid'
      borderColor={colorMode === "light" ? "#e6e6e6" : "#00000073"}
      display={{ base: "none", md: "unset" }}
      as='aside'
      backgroundColor={RMBGColor}
      pl='.5rem'
      pt='1rem'
      w='200px'
    >
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
              {user.username}s
            </Flex>
          </Flex>
        );
      })}
    </Box>
  );
};
export default UsersList;
