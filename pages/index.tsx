/* eslint-disable react/no-children-prop */
import type { NextPage } from "next";
import Head from "next/head";
import {
  Box,
  Flex,
  IconButton,
  Input,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  useMediaQuery,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import NsList from "../components/NsList";
import React, { useContext, useEffect, useState } from "react";
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
import UsersList from "../components/UsersList";
import UserDrawer from "../components/UserDrawer";
import UsersListDrawer from "../components/UsersListDrawer";

interface FormValue {
  message: string;
}
interface user {
  id: string;
  username: string;
  image: string;
}

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenUserDrawer, onOpen: onOpenUserDrawer, onClose: onCloseUserDrawer } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [numMembers, setNumMembers] = useState<Number>(0);
  const ctx = useContext(SocketContext);
  const { data: session, status } = useSession();
  const NSBGColor = useColorModeValue("rgba(79, 79, 79, 0.228)", "rgba(0, 0, 0, 0.833)");
  const RMBGColor = useColorModeValue("rgba(222, 222, 222, 0.353)", "rgba(0, 0, 0, 0.637)");
  const ChatBGColor = useColorModeValue("rgba(222, 222, 222, 0.353)", "rgba(0, 0, 0, 0.637)");
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      onOpen();
    },
    onSwipedLeft: () => {
      onOpenUserDrawer();
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

  ctx.defaultNamespace.on("connectedUsers", (connectedUsers: user[]) => {
    ctx.setConnectedUsers(connectedUsers);
  });

  useEffect(() => {
    if (status == "authenticated" && ctx.userName) {
      ctx.defaultNamespace.emit("login", ctx.userName, session.user?.image);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.defaultNamespace, ctx.userName, status]);

  function submitHandler(data: any) {
    if (!data.message)
      toast({
        title: "Can't send an empty message ????",
        status: "error",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      });
    else {
      if (status == "authenticated") {
        ctx.currentNamespace?.emit("newMessageToServer", {
          text: data.message,
          img: session.user?.image,
          username: ctx.userName,
        });
        reset({ message: "" });
      } else {
        ctx.currentNamespace?.emit("newMessageToServer", { text: data.message, username: ctx.userName });
        reset({ message: "" });
      }
    }
  }

  function userLinkHandler() {
    if (isLargerThan768) {
      return;
    } else {
      onOpenUserDrawer();
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
        backgroundColor={NSBGColor}
      >
        <NsList />
        <Switch backgroundColor='blue.900' borderRadius='1rem' onChange={toggleColorMode} marginBottom='1.3rem' />
      </Flex>
      <Flex
        display={{ base: "none", md: "unset" }}
        flexDirection='column'
        h='100%'
        w='240px'
        flexShrink='0'
        backgroundColor={RMBGColor}
        borderRight='2px solid'
        borderColor={colorMode === "light" ? "#e6e6e6" : "#00000073"}
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
          backgroundColor={NSBGColor}
        >
          <NsList />
          <Switch backgroundColor='blue.900' borderRadius='1rem' onChange={toggleColorMode} marginBottom='1.3rem' />
        </Flex>
        <Flex
          display={{ base: "unset", md: "none" }}
          flexDirection='column'
          h='100%'
          w='248px'
          flexShrink='0'
          backgroundColor={RMBGColor}
        >
          <RoomList />
        </Flex>
      </Flex>
    </>
  );

  return (
    <div>
      <Head>
        <title>Dissonance</title>
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
        <UserDrawer
          isOpen={isOpenUserDrawer}
          onClose={() => {
            onCloseUserDrawer();
          }}
        >
          <UsersListDrawer />
        </UserDrawer>
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
              bg={RMBGColor}
              h='3.4rem'
              boxShadow='0 4px 4px -2px #00000051'
              paddingTop='.8rem'
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
                <Text
                  onClick={() => {
                    userLinkHandler();
                  }}
                  fontSize='smaller'
                  letterSpacing='.06rem'
                  fontWeight='700'
                >{`\u00A0${numMembers} ${people} in here`}</Text>
              </Flex>
            </Flex>
            <Flex overflow='auto' w='100%' h='100%'>
              <Flex bg={ChatBGColor} justifyContent='flex-start' w='100%' h='100%' flexDirection='column'>
                <Chat />
                <Box borderTopRadius='1rem' ml='.3rem' mr='.3rem' mb='.3rem'>
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
              <UsersList />
            </Flex>
          </Flex>
        </Flex>
      </main>
    </div>
  );
};

export default Home;
