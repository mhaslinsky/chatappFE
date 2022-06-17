import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import theme from "../styles/theme";
import SocketContextProvider from "../context/socket-context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketContextProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SocketContextProvider>
  );
}

export default MyApp;
