import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import Namespace from "../models/Namespace";
import { io } from "socket.io-client";
import Room from "../models/Room";

const NsList: React.FC<{
  namespaces: Namespace[] | null;
  roomData: (roomData: Room[]) => void;
}> = (props) => {
  const [nsSocket, setNsSocket] = useState<any>();

  if (nsSocket) {
    nsSocket!.on("nsRoomLoad", (roomData: Room[]) => {
      props.roomData(roomData);
    });
  }
  function nsClickHandler(ns: Namespace) {
    setNsSocket(io(`http://localhost:4000${ns.endpoint}`));
  }

  if (props.namespaces) {
    return (
      <Box marginTop='1rem'>
        {props.namespaces.map((ns) => {
          let backgroundColor;
          nsSocket?.nsp == ns.endpoint
            ? (backgroundColor = "teal.600")
            : (backgroundColor = "blackAlpha.500");
          return (
            <Flex
              onClick={() => {
                nsClickHandler(ns);
              }}
              transition='.3s'
              cursor='pointer'
              alignItems='center'
              margin='.4rem'
              marginBottom='.4rem'
              borderRadius='1rem'
              backgroundColor={backgroundColor}
              padding='.2rem'
              key={ns.id}
            >
              <Image width='100' height='100' alt={ns.endpoint} src={ns.img} />
            </Flex>
          );
        })}
      </Box>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default NsList;
