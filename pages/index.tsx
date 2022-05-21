import type { NextPage } from "next";
import Head from "next/head";
import { Button, Flex } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { socketMain } from "../util/socket";
import NsList from "../components/NsList";
import Namespace from "../models/Namespace";
import { useState } from "react";

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [namespaces, setNamespaces] = useState<Namespace[] | null>(null);
  // const nsRow = useColorModeValue("#e4f8fa", "#1c1e1f");

  socketMain.on("nsList", (nsData) => {
    setNamespaces(nsData);
  });

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
            <NsList namespaces={namespaces} />
          </Flex>
          <Flex
            display={{ base: "none", md: "unset" }}
            flexDirection='column'
            h='100%'
            w='240px'
            backgroundColor='blackAlpha.200'
          ></Flex>
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
