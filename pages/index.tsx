/* eslint-disable react/no-children-prop */
import type { NextPage } from "next";
import Head from "next/head";
import { Box, Flex, IconButton, Input, Switch, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import NsList from "../components/NsList";
import React, { useContext, useState } from "react";
import RoomList from "../components/RoomList";
import { HamburgerIcon, ViewIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import Chat from "../components/Chat";
import UserNameModal from "../components/Modal";
import SlideDrawer from "../components/Drawer";
import { SocketContext } from "../context/socket-context";
import Room from "../models/Room";
import { useSwipeable } from "react-swipeable";
import { useSession } from "next-auth/react";

interface FormValue {
  message: string;
}

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [numMembers, setNumMembers] = useState<Number>(0);
  const ctx = useContext(SocketContext);
  const { data: session, status } = useSession();
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      onOpen();
    },
  });
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

  // console.log(data);
  // console.log(status);

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
      if (status == "authenticated") {
        ctx.currentNamespace?.emit("newMessageToServer", { text: data.message, img: session.user?.image });
        reset({ message: "" });
      } else {
        ctx.currentNamespace?.emit("newMessageToServer", { text: data.message });
        reset({ message: "" });
      }
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
        <Switch backgroundColor='blue.900' borderRadius='1rem' onChange={toggleColorMode} marginBottom='1rem' />
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
      <Flex h='100%' flexDirection='row'>
        <Flex
          display={{ base: "flex", md: "none" }}
          flexDirection='column'
          h='100%'
          w='72px'
          flexShrink='0'
          alignItems='center'
          justifyContent='space-between'
          backgroundColor='blackAlpha.600'
        >
          <NsList />
          <Switch backgroundColor='blue.900' borderRadius='1rem' onChange={toggleColorMode} marginBottom='1rem' />
        </Flex>
        <Flex
          display={{ base: "unset", md: "none" }}
          flexDirection='column'
          h='100%'
          w='248px'
          flexShrink='0'
          backgroundColor='blackAlpha.400'
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
      <main {...swipeHandlers}>
        <UserNameModal />
        <SlideDrawer
          isOpen={isOpen}
          onClose={() => {
            onClose();
          }}
        >
          {nsRoomElementSD}
        </SlideDrawer>
        <Flex flexDirection={{ base: "column", md: "row" }} h='100vh' maxHeight='100%' maxWidth='calc(var(--vw, 1vw) * 100)'>
          {nsRoomElement}
          <Flex
            position={{ base: "fixed", md: "unset" }}
            top='0'
            w='100%'
            flexDirection='column'
            justifyContent='space-between'
            h='100%'
            flexGrow='1'
          >
            <Flex
              h='2.5rem'
              boxShadow='0 4px 4px -2px #00000051'
              marginTop='1rem'
              paddingBottom='.5rem'
              paddingRight='1rem'
              justifyContent={{ base: "space-between", md: "flex-end" }}
              alignItems='center'
            >
              <IconButton
                display={{ base: "unset", md: "none" }}
                variant='ghost'
                ml='1rem'
                onClick={() => {
                  onOpen();
                }}
                icon={<HamburgerIcon h={8} w={8} />}
                aria-label={"Expand Drawer"}
              ></IconButton>
              <Flex alignItems='center' flexDirection='row'>
                <ViewIcon />
                {/*@ts-ignore react18 bug*/}
                <Text fontSize='smaller' letterSpacing='.06rem' fontWeight='700'>{`\u00A0${numMembers} ${people} in here`}</Text>
              </Flex>
            </Flex>
            <Chat />
            <Box borderTopRadius='1rem' margin='.3rem'>
              <form onSubmit={handleSubmit(submitHandler)}>
                <Input
                  mb='1rem'
                  variant='filled'
                  type='text'
                  fontWeight={500}
                  letterSpacing='.05rem'
                  placeholder={`Message #${ctx.currentRoom}`}
                  _placeholder={{ color: "gray.500", fontWeight: "600", letterSpacing: ".03rem" }}
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
