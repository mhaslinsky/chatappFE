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
import React, { useContext, useEffect, useState } from "react";
import Room from "../models/Room";
import RoomList from "../components/RoomList";
import { io, Socket } from "socket.io-client";
import { ViewIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import Chat from "../components/Chat";
import UserNameModal from "../components/Modal";
import SlideDrawer from "../components/Drawer";
import { SocketContext } from "../context/socket-context";

interface FormValue {
  message: string;
}

// const connectChatServer = (username: string) => {
//   const socketMain = io(`${process.env.SOCKETIO}`, {
//     query: { username },
//   });
//   return socketMain;
// };

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [roomData, setRoomData] = useState<Room[] | null>(null);
  // const [curNsSocket, setCurNsSocket] = useState<Socket | null>(null);
  const [numMembers, setNumMembers] = useState<Number>(0);
  const [currentRoom, setCurrentRoom] = useState<string>();
  const ctx = useContext(SocketContext);

  // useEffect(() => {
  //   if (!ctx.userName) return;
  //   setCurNsSocket(connectChatServer(ctx.userName));
  //   return () => {
  //     curNsSocket?.disconnect();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [ctx.userName]);

  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValue>({ defaultValues: { message: "" } });

  const people = numMembers > 1 ? `people` : `person`;

  ctx.currentNamespace?.on("nsList", (nsData) => {
    ctx.setAvailableNamespaces(nsData);
  });

  ctx.currentNamespace?.on("updateMembers", (numMembers) => {
    setNumMembers(numMembers);
  });

  function roomDataHandler(rD: Room[]) {
    setRoomData(rD);
  }
  // function socketDataHandler(curNS: Socket) {
  //   setCurNsSocket(curNS);
  // }
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
      ctx.currentNamespace?.emit("newMessageToServer", { text: data.message });
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
        <NsList currentRoom={currentRoom} roomData={roomDataHandler} />
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
          curNsSocket={ctx.currentNamespace}
          rooms={roomData}
        />
      </Flex>
    </>
  );

  const nsRoomElementSD = (
    <>
      <Flex w='100%' h='100%' flexDirection='row'>
        <Flex
          display={{ base: "flex", md: "none" }}
          flexDirection='column'
          h='100%'
          w='72px'
          flexShrink='0'
          alignItems='center'
          justifyContent='space-between'
          backgroundColor='blackAlpha.400'
        >
          <NsList currentRoom={currentRoom} roomData={roomDataHandler} />
          <Switch
            backgroundColor='teal.600'
            borderRadius='1rem'
            onChange={toggleColorMode}
            marginBottom='1rem'
          />
        </Flex>
        <Flex
          display={{ base: "unset", md: "none" }}
          flexDirection='column'
          h='100%'
          w='240px'
          flexShrink='0'
          backgroundColor='blackAlpha.200'
        >
          <RoomList
            curRoomTitle={roomTitleHandler}
            // usersInCurRoom={usersHandler}
            curNsSocket={ctx.currentNamespace}
            rooms={roomData}
          />
        </Flex>
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
        <UserNameModal />
        <SlideDrawer
          isOpen={isOpen}
          onClose={() => {
            onClose();
          }}
        >
          {nsRoomElementSD}
        </SlideDrawer>
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          h='100vh'
          maxHeight='100%'
          maxWidth='calc(var(--vw, 1vw) * 100)'
        >
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
            <Chat curNsSocket={ctx.currentNamespace} />
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
