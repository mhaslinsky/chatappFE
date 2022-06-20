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
import React, { useContext, useState } from "react";
import RoomList from "../components/RoomList";
import { ViewIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import Chat from "../components/Chat";
import UserNameModal from "../components/Modal";
import SlideDrawer from "../components/Drawer";
import { SocketContext } from "../context/socket-context";
import Room from "../models/Room";

interface FormValue {
  message: string;
}

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [numMembers, setNumMembers] = useState<Number>(0);
  const ctx = useContext(SocketContext);

  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValue>({ defaultValues: { message: "" } });

  const people = numMembers > 1 ? `people` : `person`;

  ctx.currentNamespace?.on("updateMembers", (numMembers) => {
    setNumMembers(numMembers);
  });

  ctx.currentNamespace?.on("nsRoomLoad", (roomData: Room[]) => {
    ctx.setAvailableRooms(roomData);
  });

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
        <NsList />
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
        <RoomList />
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
          <NsList />
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
          <RoomList />
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
            <Chat />
            <Box margin='.3rem'>
              <form onSubmit={handleSubmit(submitHandler)}>
                <Input
                  type='text'
                  placeholder={`Message #${ctx.currentRoom}`}
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
