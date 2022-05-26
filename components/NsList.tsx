import { Box, Flex, Tooltip, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Namespace from "../models/Namespace";
import { io, Socket } from "socket.io-client";
import Room from "../models/Room";

const NsList: React.FC<{
  namespaces: Namespace[] | null;
  roomData: (roomData: Room[]) => void;
  socketData: (socketData: Socket) => void;
}> = (props) => {
  const bg = useColorModeValue("teal.400", "teal.600");
  const [nsSocket, setNsSocket] = useState<any>();

  useEffect(() => {
    if (props.namespaces) {
      nsClickHandler(props.namespaces[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.namespaces]);

  if (nsSocket) {
    nsSocket!.on("nsRoomLoad", (roomData: Room[]) => {
      props.roomData(roomData);
      props.socketData(nsSocket);
    });
  }

  function nsClickHandler(ns: Namespace) {
    if (nsSocket) nsSocket.close();
    setNsSocket(io(`http://localhost:4000${ns.endpoint}`));
  }

  if (props.namespaces) {
    return (
      <Box marginTop='1rem'>
        {props.namespaces.map((ns) => {
          let backgroundColor;
          nsSocket?.nsp == ns.endpoint
            ? (backgroundColor = bg)
            : (backgroundColor = "blackAlpha.500");
          return (
            <Tooltip
              boxShadow='1px 3px 6px 2px rgba(0, 0, 0, 0.2)'
              borderRadius='1rem'
              fontSize='lg'
              fontWeight='700'
              backgroundColor={bg}
              placement='right'
              label={ns.endpoint.substring(1)}
              key={ns.id}
            >
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
              >
                <Image
                  width='100'
                  height='100'
                  alt={ns.endpoint}
                  src={ns.img}
                />
              </Flex>
            </Tooltip>
          );
        })}
      </Box>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default NsList;
