/* eslint-disable react/no-children-prop */
import type { NextPage } from "next";
import Head from "next/head";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { socketMain } from "../util/socket";
import NsList from "../components/NsList";
import Namespace from "../models/Namespace";
import React, { useState } from "react";
import Room from "../models/Room";
import RoomList from "../components/RoomList";
import { Socket } from "socket.io-client";
import { ViewIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";

interface FormValue {
  message: string;
}

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [roomData, setRoomData] = useState<Room[] | null>(null);
  const [curNsSocket, setCurNsSocket] = useState<Socket | null>(null);
  const [namespaces, setNamespaces] = useState<Namespace[] | null>(null);
  const [numMembers, setNumMembers] = useState<Number>(0);
  const [currentRoom, setCurrentRoom] = useState<string>();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValue>({ defaultValues: { message: "" } });

  const people = numMembers > 1 ? `people` : `person`;

  socketMain.on("nsList", (nsData) => {
    setNamespaces(nsData);
  });

  function roomDataHandler(rD: Room[]) {
    setRoomData(rD);
  }
  function socketDataHandler(curNS: Socket) {
    setCurNsSocket(curNS);
  }
  function usersHandler(users: number) {
    setNumMembers(users);
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
      console.log(data);
    }
  }

  return (
    <div>
      <Head>
        <title>Slackish</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          h='100vh'
          w='99vw'
          maxHeight='100%'
          maxWidth='calc(var(--vw, 1vw) * 100)'
        >
          <Flex
            display={{ base: "none", md: "flex" }}
            flexDirection='column'
            h='100%'
            w='72px'
            alignItems='center'
            justifyContent='space-between'
            backgroundColor='blackAlpha.400'
          >
            <NsList
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
            backgroundColor='blackAlpha.200'
          >
            <RoomList
              curRoomTitle={roomTitleHandler}
              usersInCurRoom={usersHandler}
              curNsSocket={curNsSocket}
              rooms={roomData}
            />
          </Flex>
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
              <ViewIcon />
              {/*@ts-ignore react18 bug*/}
              <Text
                fontSize='smaller'
                letterSpacing='.06rem'
                fontWeight='700'
              >{`\u00A0${numMembers} ${people} in here`}</Text>
            </Flex>
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
