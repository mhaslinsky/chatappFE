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
import { ChatIcon } from "@chakra-ui/icons";
import React, { useEffect, useContext, useState } from "react";
import { SocketContext } from "../context/socket-context";
import Room from "../models/Room";
import { signOut, useSession } from "next-auth/react";
import { Image } from "@chakra-ui/react";
import { Skeleton } from "@chakra-ui/react";
import PopoverSO from "./PopoverSO";

const RoomList: React.FC<{}> = (props) => {
  const bg = useColorModeValue("blue.200", "rgba(20, 56, 220, 0.228)");
  const hover = useColorModeValue("rgba(49, 77, 200, 0.228)", "rgba(2, 37, 192, 0.228)");
  const ctx = useContext(SocketContext);
  const [localRooms, setLocalRooms] = useState<Room[] | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    /*@ts-ignore*/
    if (ctx.currentNamespace?.nsp == "/") return;
    if (ctx.currentNamespace) {
      setLocalRooms(ctx.availableRooms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.currentNamespace]);

  useEffect(() => {
    if (localStorage.getItem("lastRoom")) return;
    if (ctx.availableRooms) {
      roomClickHandler(ctx.availableRooms[0].roomTitle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.availableRooms]);

  useEffect(() => {
    if (!localRooms) return;
    if (ctx.availableRooms) {
      roomClickHandler(ctx.availableRooms[0].roomTitle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.availableRooms]);

  function roomClickHandler(rm: string) {
    if (ctx.currentRoom) {
      ctx.currentNamespace!.emit("leaveRoom", ctx.currentRoom);
    }
    //client handles joining NS's, server handles joining rooms
    ctx.currentNamespace!.emit("joinRoom", rm);
    ctx.setRoom(rm);
  }

  let userBadge;

  if (status == "authenticated") {
    userBadge = (
      <Flex
        boxShadow='0 -4px 4px -2px #00000061'
        pt='.5rem'
        pl='.5rem'
        gap='.5rem'
        alignItems='center'
        pb='.5rem'
        flexDir='row'
        justifyContent='space-between'
      >
        <Flex gap='.5rem' alignItems='center'>
          <Image w={45} h={45} borderRadius='full' objectFit='cover' alt={session!.user!.name!} src={session!.user!.image!} />
          <Text noOfLines={1} maxW='150px' overflow='hidden' text-overflow='ellipsis' fontWeight='600'>
            {session?.user?.name}
          </Text>
        </Flex>
        <PopoverSO />
      </Flex>
    );
  } else if (status == "unauthenticated" && ctx.userName) {
    userBadge = (
      <Flex
        boxShadow='0 -4px 4px -2px #00000061'
        pt='.5rem'
        pl='.5rem'
        gap='.5rem'
        alignItems='center'
        pb='.5rem'
        flexDir='row'
        justifyContent='space-between'
      >
        <Flex gap='.5rem' alignItems='center'>
          <Image
            w={45}
            h={45}
            borderRadius='full'
            objectFit='cover'
            alt={ctx.userName}
            src='https://clinicforspecialchildren.org/wp-content/uploads/2016/08/avatar-placeholder.gif'
          />
          <Text noOfLines={1} overflow='hidden' text-overflow='ellipsis' maxW='150px' fontWeight='600'>
            {ctx.userName}
          </Text>
        </Flex>
        <PopoverSO />
      </Flex>
    );
  } else {
    userBadge = <Skeleton mb='1.3rem' h='3rem' />;
  }

  if (ctx.availableRooms) {
    return (
      <Flex h='100%' justifyContent='space-between' flexDir='column'>
        <Box>
          <Box boxShadow='0 4px 4px -2px #00000061' paddingBottom='.45rem'>
            <Heading fontSize='3xl' letterSpacing='.1rem' marginLeft='.4rem' marginTop='.6rem'>
              {/*@ts-ignore*/}
              {ctx.currentNamespace?.nsp.slice(1)}
            </Heading>
          </Box>
          <Box marginTop='1rem'>
            {ctx.availableRooms.map((rm) => {
              let backgroundColor;
              ctx.currentRoom == rm.roomTitle ? (backgroundColor = bg) : (backgroundColor = "unset");
              return (
                <Flex
                  onClick={() => {
                    roomClickHandler(rm.roomTitle);
                  }}
                  justifyContent='spacebetween'
                  cursor='pointer'
                  alignItems='center'
                  marginBottom='.4rem'
                  marginLeft='.6rem'
                  padding='.4rem'
                  backgroundColor={backgroundColor}
                  borderRadius='.5rem'
                  key={rm.id}
                  margin='.2rem'
                  transition='.3s'
                  _hover={{
                    background: hover,
                  }}
                >
                  <ChatIcon />
                  <Text letterSpacing='.06rem' fontWeight='600' noOfLines={1}>
                    {`\u00A0${rm.roomTitle}`}
                  </Text>
                </Flex>
              );
            })}
          </Box>
        </Box>
        {userBadge}
      </Flex>
    );
  } else {
    return (
      <Heading marginLeft='.4rem' marginTop='1rem'>
        Rooms
      </Heading>
    );
  }
};

export default RoomList;
