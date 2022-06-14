import { Box, Flex, Text } from "@chakra-ui/react";
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
  const [updateType, setUpdateType] = useState<string>();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    props.curNsSocket?.on("historyGET", (history) => {
      setUpdateType("server");
      setMessages(history);
    });
    props.curNsSocket?.on("messageToClients", (msg: message) => {
      setUpdateType("user");
      setMessages((prevState) => {
        return prevState.concat(msg);
      });
    });
  }, [props.curNsSocket]);

  useEffect(() => {
    if (updateType == "user")
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    else {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <Box overflow='auto' h='100%'>
      {messages.map((msg) => {
        return (
          <Flex
            flexGrow='0'
            borderRadius='1rem'
            bg='whiteAlpha.100'
            margin='1rem'
            gap='.4rem'
            alignItems='center'
            key={msg.time}
          >
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
