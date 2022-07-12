import React from "react";
import {
  Button,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { BsFillGearFill } from "react-icons/bs";
import { signOut } from "next-auth/react";

const PopoverSO = () => {
  const bg = useColorModeValue("rgba(231, 231, 231, 0.228)", "rgba(0, 0, 0, 0.784)");
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant='ghost'>
          <Icon as={BsFillGearFill} />
        </Button>
      </PopoverTrigger>
      <PopoverContent boxShadow='none !important' bg={bg} w='auto'>
        <PopoverBody backdropFilter='blur(4px)' border='2px solid' borderColor={colorMode === "light" ? "#e6e6e6" : "#00000073"}>
          <Button
            variant='ghost'
            onClick={() => {
              // ctx.defaultNamespace.emit("logout", ctx.userName);
              signOut();
            }}
          >
            Sign out
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverSO;
