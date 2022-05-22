import type { NextPage } from "next";
import Head from "next/head";
import { Button, Flex } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { socketMain } from "../util/socket";
import NsList from "../components/NsList";
import Namespace from "../models/Namespace";
import { useState } from "react";
import Room from "../models/Room";
import RoomList from "../components/RoomList";

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [roomData, setRoomData] = useState<Room[] | null>(null);
  const [namespaces, setNamespaces] = useState<Namespace[] | null>(null);
  // const nsRow = useColorModeValue("#e4f8fa", "#1c1e1f");
  socketMain.on("nsList", (nsData) => {
    setNamespaces(nsData);
  });

  function roomDataHandler(rD: Room[]) {
    setRoomData(rD);
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
            display={{ base: "none", md: "unset" }}
            flexDirection='column'
            h='100%'
            w='72px'
            backgroundColor='blackAlpha.400'
          >
            <NsList roomData={roomDataHandler} namespaces={namespaces} />
          </Flex>
          <Flex
            display={{ base: "none", md: "unset" }}
            flexDirection='column'
            h='100%'
            w='240px'
            backgroundColor='blackAlpha.200'
          >
            <RoomList rooms={roomData} />
          </Flex>
          <Flex
            flexDirection='column'
            justifyContent='flex-end'
            h='100%'
            flexGrow='1'
          >
            <Button m='.2rem' onClick={toggleColorMode}>
              Toggle {colorMode === "light" ? "Dark" : "Light"}
            </Button>
          </Flex>
        </Flex>
      </main>
    </div>
  );
};

export default Home;
