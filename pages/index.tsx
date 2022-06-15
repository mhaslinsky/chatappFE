/* eslint-disable react/no-children-prop */
import type { NextPage } from "next";
import Head from "next/head";
import {
  Box,
  Button,
  Flex,
  Input,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import NsList from "../components/NsList";
import Namespace from "../models/Namespace";
import React, { useEffect, useState } from "react";
import Room from "../models/Room";
import RoomList from "../components/RoomList";
import { io, Socket } from "socket.io-client";
import { ViewIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import Chat from "../components/Chat";
import UserNameModal from "../components/Modal";
import SlideDrawer from "../components/Drawer";

interface FormValue {
  message: string;
}

const connectChatServer = (username: string) => {
  console.log(process.env.SOCKETIO);
  const socketMain = io(`${process.env.SOCKETIO}`, {
    query: { username },
  });
  return socketMain;
};

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [roomData, setRoomData] = useState<Room[] | null>(null);
  const [curNsSocket, setCurNsSocket] = useState<Socket | null>(null);
  const [namespaces, setNamespaces] = useState<Namespace[] | null>(null);
  const [numMembers, setNumMembers] = useState<Number>(0);
  const [currentRoom, setCurrentRoom] = useState<string>();
  const [username, setUserName] = useState<string>("");

  useEffect(() => {
    if (!username) return;
    setCurNsSocket(connectChatServer(username));
    return () => {
      curNsSocket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValue>({ defaultValues: { message: "" } });

  const people = numMembers > 1 ? `people` : `person`;

  curNsSocket?.on("nsList", (nsData) => {
    setNamespaces(nsData);
  });

  curNsSocket?.on("updateMembers", (numMembers) => {
    setNumMembers(numMembers);
  });

  function roomDataHandler(rD: Room[]) {
    setRoomData(rD);
  }
  function socketDataHandler(curNS: Socket) {
    setCurNsSocket(curNS);
  }

  function unHandler(un: string) {
    setUserName(un);
  }

  function roomTitleHandler(rmTitle: string) {
    setCurrentRoom(rmTitle);
  }

  function submitHandler(data: any) {
    if (!data.message)
      toast({
        title: "Can't send an empty message 😔",
        status: "error",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      });
    else {
      curNsSocket?.emit("newMessageToServer", { text: data.message });
      reset({ message: "" });
    }
  }

  const nsRoomElement = (
    <>
      <Flex
        display={{ base: "none", md: "flex" }}
        flexDirection='column'
        h='100%'
        w='72px'
        flexShrink='0'
        alignItems='center'
        justifyContent='space-between'
        backgroundColor='blackAlpha.400'
      >
        <NsList
          username={username}
          socketData={socketDataHandler}
          roomData={roomDataHandler}
          namespaces={namespaces}
        />
        <Switch
          backgroundColor='teal.600'
          borderRadius='1rem'
          onChange={toggleColorMode}
          marginBottom='1rem'
        />
      </Flex>
      <Flex
        display={{ base: "none", md: "unset" }}
        flexDirection='column'
        h='100%'
        w='240px'
        flexShrink='0'
        backgroundColor='blackAlpha.200'
      >
        <RoomList
          curRoomTitle={roomTitleHandler}
          // usersInCurRoom={usersHandler}
          curNsSocket={curNsSocket}
          rooms={roomData}
        />
      </Flex>
    </>
  );

  return (
    <div>
      <Head>
        <title>Slackish</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <UserNameModal unHandler={unHandler} />
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          h='100vh'
          maxHeight='100%'
          maxWidth='calc(var(--vw, 1vw) * 100)'
        >
          <SlideDrawer
            isOpen={isOpen}
            onClose={() => {
              onClose();
            }}
          >
            {nsRoomElement}
          </SlideDrawer>
          {nsRoomElement}
          <Flex
            flexDirection='column'
            justifyContent='space-between'
            h='100%'
            flexGrow='1'
          >
            <Flex
              marginTop='1.5rem'
              marginRight='1rem'
              justifyContent='flex-end'
              alignItems='center'
            >
              <Button
                onClick={() => {
                  onOpen();
                }}
              ></Button>
              <ViewIcon />
              {/*@ts-ignore react18 bug*/}
              <Text
                fontSize='smaller'
                letterSpacing='.06rem'
                fontWeight='700'
              >{`\u00A0${numMembers} ${people} in here`}</Text>
            </Flex>
            <Chat curNsSocket={curNsSocket} />
            <Box margin='.3rem'>
              <form onSubmit={handleSubmit(submitHandler)}>
                <Input
                  type='text'
                  placeholder={`Message #${currentRoom}`}
                  id='message'
                  errorBorderColor='red'
                  {...register("message", {
                    onBlur: () => {},
                  })}
                />
              </form>
            </Box>
          </Flex>
        </Flex>
      </main>
    </div>
  );
};

export default Home;
