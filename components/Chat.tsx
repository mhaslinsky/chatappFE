import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
interface message {
  text: string;
  time: any;
  username: string;
  avatar: string;
}
interface ChatProps {
  curNsSocket: Socket | null;
}

const Chat: React.FC<ChatProps> = (props) => {
  const [messages, setMessages] = useState<message[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    props.curNsSocket?.on("messageToClients", (msg: message) => {
      setMessages((prevState) => {
        return prevState.concat(msg);
      });
    });
  }, [props.curNsSocket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box overflow='auto' h='100%'>
      {messages.map((msg) => {
        return (
          <Flex margin='1rem' gap='.4rem' alignItems='center' key={msg.time}>
            <Box
              flexShrink='0'
              overflow='hidden'
              w='10'
              h='10'
              position='relative'
              borderRadius='50%'
            >
              <Image layout='fill' alt={msg.username} src={msg.avatar}></Image>
            </Box>

            <Text fontWeight='700'>{msg.username}</Text>
            <Text>{msg.text}</Text>
          </Flex>
        );
      })}
      <div ref={messagesEndRef}></div>
    </Box>
  );
};

export default Chat;
