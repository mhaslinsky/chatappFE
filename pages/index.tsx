import type { NextPage } from "next";
import Head from "next/head";
import { Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  // Here's the signature
  const nsRow = useColorModeValue("#e4f8fa", "#1c1e1f");
  const roomRow = useColorModeValue("#f9f9f9", "#161819");
  const borderColor = useColorModeValue("#d2f8fb", "#252729");
  return (
    <div>
      <Head>
        <title>Slackish</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Grid
          h='100vh'
          templateRows='repeat(2, 1fr)'
          templateColumns='repeat(10, 1fr)'
        >
          <GridItem bgColor={nsRow} rowSpan={2} colSpan={1}></GridItem>
          <GridItem
            bgColor={roomRow}
            borderRight='1px'
            borderColor={borderColor}
            rowSpan={2}
            colSpan={2}
          ></GridItem>
          <GridItem bgColor={roomRow} rowSpan={2} colSpan={7}>
            <Flex flexDirection='column' justifyContent='flex-end' h='100%'>
              <Button onClick={toggleColorMode}>
                Toggle {colorMode === "light" ? "Dark" : "Light"}
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </main>
    </div>
  );
};

export default Home;
