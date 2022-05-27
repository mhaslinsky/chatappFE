import {
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Room from "../models/Room";

const RoomList: React.FC<{
  rooms: Room[] | null;
  curNsSocket: Socket | null;
  usersInCurRoom: (users: number) => void;
  curRoomTitle: (rmTitle: string) => void;
}> = (props) => {
  const bg = useColorModeValue("blue.200", "blackAlpha.300");
  const hover = useColorModeValue("teal.300", "teal.700");
  const [curRoom, setCurRoom] = useState<string | null>(null);

  useEffect(() => {
    if (props.rooms) {
      roomClickHandler(props.rooms[0].roomTitle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.rooms]);

  function roomClickHandler(rm: string) {
    if (curRoom) props.curNsSocket?.emit("leaveRoom", curRoom);
    //client handles joining NS's, server handles joining rooms
    props.curNsSocket!.emit("joinRoom", rm, (newNumberOfMembers: number) => {
      props.usersInCurRoom(newNumberOfMembers);
    });
    setCurRoom(rm);
    props.curRoomTitle(rm);
  }

  if (props.rooms) {
    return (
      <React.Fragment>
        <Heading
          letterSpacing='.1rem'
          marginLeft='.4rem'
          marginTop='1rem'
          marginBottom='.5rem'
        >
          Rooms
        </Heading>
        <Divider />
        <Box marginTop='1rem'>
          {props.rooms.map((rm) => {
            let backgroundColor;
            curRoom == rm.roomTitle
              ? (backgroundColor = bg)
              : (backgroundColor = "unset");
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
