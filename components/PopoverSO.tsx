import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Text,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import { BsFillGearFill } from "react-icons/bs";
import { signOut, useSession } from "next-auth/react";

const PopoverSO = () => {
  const { data: session, status } = useSession();
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant='ghost'>
          <Icon as={BsFillGearFill} />
        </Button>
      </PopoverTrigger>
      <PopoverContent w='auto'>
        <PopoverBody>
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
