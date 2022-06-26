import { Box, Flex, Tooltip, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useContext, useCallback } from "react";
import Namespace from "../models/Namespace";
import { io } from "socket.io-client";
import { SocketContext } from "../context/socket-context";

const NsList: React.FC<{}> = (props) => {
  const bg = useColorModeValue("teal.400", "blue.600");
  const ttClr = useColorModeValue("black", "gray.300");
  const ctx = useContext(SocketContext);

  const nsClickHandler = useCallback(
    (ns: Namespace) => {
      if (ctx.currentNamespace) {
        /*@ts-ignore*/
        if (ctx.currentNamespace?.nsp == ns.endpoint) {
          return;
        }
        ctx.currentNamespace?.emit("leaveRoom", ctx.currentRoom);
        ctx.currentNamespace.close();
      }
      ctx.setNamespace(
        io(`${process.env.SOCKETIO}${ns.endpoint}`, {
          query: { username: ctx.userName },
        })
      );
    },
    [ctx]
  );

  useEffect(() => {
    /*@ts-ignore*/
    if (ctx.currentNamespace?.nsp !== "/") return;
    if (ctx.availableNamespaces) {
      nsClickHandler(ctx.availableNamespaces[0]);
    }
  }, [ctx.availableNamespaces, ctx.currentNamespace, ctx.userName, nsClickHandler]);

  if (ctx.availableNamespaces) {
    return (
      <Box marginTop='1rem'>
        {ctx.availableNamespaces.map((ns) => {
          let backgroundColor;
          /*@ts-ignore*/
          ctx.currentNamespace?.nsp == ns.endpoint ? (backgroundColor = bg) : (backgroundColor = "blackAlpha.500");
          return (
            <Tooltip
              boxShadow='1px 3px 6px 2px rgba(0, 0, 0, 0.2)'
              borderRadius='1rem'
              fontSize='lg'
              fontWeight='700'
              color={ttClr}
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
                <Image width='100' height='100' alt={ns.endpoint} src={ns.img} />
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
