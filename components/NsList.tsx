import { Box, Flex, Tooltip, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState, useContext } from "react";
import Namespace from "../models/Namespace";
import { io, Socket } from "socket.io-client";
import Room from "../models/Room";
import { SocketContext } from "../context/socket-context";

const NsList: React.FC<{
  currentRoom: string | undefined;
  roomData: (roomData: Room[]) => void;
}> = (props) => {
  const bg = useColorModeValue("teal.400", "teal.600");
  const [nsSocket, setNsSocket] = useState<Socket | null>();
  const ctx = useContext(SocketContext);

  useEffect(() => {
    if (ctx.availableNamespaces) {
      nsClickHandler(ctx.availableNamespaces[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.availableNamespaces]);

  if (nsSocket) {
    nsSocket!.on("nsRoomLoad", (roomData: Room[]) => {
      props.roomData(roomData);
      ctx.setNamespace(nsSocket);
    });
  }

  function nsClickHandler(ns: Namespace) {
    if (nsSocket) {
      /*@ts-ignore*/
      if (nsSocket?.nsp == ns.endpoint) {
        return;
      }
      nsSocket?.emit("leaveRoom", props.currentRoom);
      nsSocket.close();
    }
    setNsSocket(
      io(`${process.env.SOCKETIO}${ns.endpoint}`, {
        query: { username: ctx.userName },
      })
    );
  }

  if (ctx.availableNamespaces) {
    return (
      <Box marginTop='1rem'>
        {ctx.availableNamespaces.map((ns) => {
          let backgroundColor;
          /*@ts-ignore*/
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
    return <p></p>;
  }
};

export default NsList;
