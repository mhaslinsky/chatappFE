import { Box, Divider, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import React, { useEffect, useContext, useState } from "react";
import { SocketContext } from "../context/socket-context";
import Room from "../models/Room";

const RoomList: React.FC<{}> = (props) => {
  const bg = useColorModeValue("blue.200", "blackAlpha.300");
  const hover = useColorModeValue("teal.300", "teal.700");
  const ctx = useContext(SocketContext);
  const [localRooms, setLocalRooms] = useState<Room[] | null>(null);

  useEffect(() => {
    /*@ts-ignore*/
    if (ctx.currentNamespace?.nsp == "/") return;
    if (ctx.currentNamespace) {
      setLocalRooms(ctx.availableRooms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.currentNamespace]);

  useEffect(() => {
    if (!localRooms) return;
    if (ctx.availableRooms) {
      roomClickHandler(ctx.availableRooms[0].roomTitle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.availableRooms]);

  function roomClickHandler(rm: string) {
    if (ctx.currentRoom) {
      ctx.currentNamespace!.emit("leaveRoom", ctx.currentRoom);
    }
    //client handles joining NS's, server handles joining rooms
    ctx.currentNamespace!.emit("joinRoom", rm);
    ctx.setRoom(rm);
  }

  if (ctx.availableRooms) {
    return (
      <React.Fragment>
        <Box h='2.3rem' boxShadow='0 4px 4px -2px #00000061' paddingBottom='1rem'>
          <Heading letterSpacing='.1rem' marginLeft='.4rem' marginTop='1rem'>
            {/*@ts-ignore*/}
            {ctx.currentNamespace?.nsp.slice(1)}
          </Heading>
        </Box>
        <Box marginTop='1rem'>
          {ctx.availableRooms.map((rm) => {
            let backgroundColor;
            ctx.currentRoom == rm.roomTitle ? (backgroundColor = bg) : (backgroundColor = "unset");
            return (
              <Flex
                onClick={() => {
                  roomClickHandler(rm.roomTitle);
                }}
                justifyContent='spacebetween'
                cursor='pointer'
                alignItems='center'
                marginBottom='.4rem'
                marginLeft='.6rem'
                padding='.4rem'
                backgroundColor={backgroundColor}
                borderRadius='.5rem'
                key={rm.id}
                margin='.2rem'
                transition='.3s'
                _hover={{
                  background: hover,
                }}
              >
                <ChatIcon />
                <Text letterSpacing='.06rem' fontWeight='600' noOfLines={1}>
                  {`\u00A0${rm.roomTitle}`}
                </Text>
              </Flex>
            );
          })}
        </Box>
      </React.Fragment>
    );
  } else {
    return (
      <Heading marginLeft='.4rem' marginTop='1rem'>
        Rooms
      </Heading>
    );
  }
};

export default RoomList;
