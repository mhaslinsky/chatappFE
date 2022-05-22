import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import Namespace from "../models/Namespace";
import Room from "../models/Room";

const RoomList: React.FC<{
  rooms: Room[] | null;
}> = (props) => {
  function roomClickHandler(rm: Room) {}
  if (props.rooms) {
    return (
      <React.Fragment>
        <Heading letterSpacing='.1rem' marginLeft='.4rem' marginTop='1rem'>
          Rooms
        </Heading>
        <Divider />
        <Box marginTop='1rem'>
          {props.rooms.map((rm) => {
            return (
              <Flex
                onClick={() => {
                  roomClickHandler(rm);
                }}
                alignItems='center'
                marginBottom='.4rem'
                marginLeft='.6rem'
                padding='.2rem'
                key={rm.id}
              >
                <Text letterSpacing='.06rem' fontWeight='600' noOfLines={1}>
                  {rm.roomTitle}
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
