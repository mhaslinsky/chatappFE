/* eslint-disable react/no-children-prop */
import type { NextPage } from "next";
import Head from "next/head";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Switch,
  Text,
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

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [roomData, setRoomData] = useState<Room[] | null>(null);
  const [curNsSocket, setCurNsSocket] = useState<Socket | null>(null);
  const [namespaces, setNamespaces] = useState<Namespace[] | null>(null);
  const [numMembers, setNumMembers] = useState<Number>(0);
  // @ts-ignore
  let curSocketName: string = curNsSocket?.nsp.substring(1);

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

  return (
    <div>
      <Head>
        <title>Slackish</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Flex flexDirection={{ base: "column", md: "row" }} h='100vh' w='100vw'>
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
            <Flex>
              <ViewIcon />
              <Text>{numMembers}</Text>
            </Flex>
            <InputGroup>
              <Input placeholder={`Message #${curSocketName}`} />
              <InputRightElement w='10%' children={<Button>Send</Button>} />
            </InputGroup>
          </Flex>
        </Flex>
      </main>
    </div>
  );
};

export default Home;
