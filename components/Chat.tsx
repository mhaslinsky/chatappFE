import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import { Socket } from "socket.io-client";

interface message {
  text: { text: string };
  time: any;
  username: string;
  avatar: string;
}

const Chat: React.FC<{ curNsSocket: Socket | null }> = (props) => {
  const [messages, setMessages] = useState<message[]>([]);

  props.curNsSocket?.on("messageToClients", (msg: message) => {
    setMessages((prevState) => {
      return prevState.concat(msg);
    });
  });

  return (
    <Box h='100%'>
      {messages.map((msg) => {
        return (
          <Flex key={msg.time}>
            <Box>
              <Image
                width='80'
                height='80'
                alt={msg.username}
                src={msg.avatar}
              ></Image>
            </Box>
            <Text>{msg.username}</Text>
            <Text>{msg.text.text}</Text>
          </Flex>
        );
      })}
    </Box>
  );
};

export default Chat;
