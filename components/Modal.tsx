import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Input,
  useToast,
  Text,
  Button,
  Box,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { SocketContext } from "../context/socket-context";
import { signIn, useSession } from "next-auth/react";
import { FaDiscord, FaGoogle } from "react-icons/fa";

interface FormValue {
  username: string;
}

const UserNameModal: React.FC<{}> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const ctx = useContext(SocketContext);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValue>({ defaultValues: { username: "" } });
  const { data: session, status } = useSession();
  let loading = status == "loading" ? true : false;

  useEffect(() => {
    if (status == "loading") return;
    if (status == "authenticated") {
      nextauthSignIn(session.user!.name!);
    }
    if (status == "unauthenticated") {
      onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function submitHandler(data: any) {
    if (!data.username)
      toast({
        title: "Can't set an empty username! 😥",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    else {
      ctx.setUserName(data.username);
      onClose();
      reset({ username: "" });
    }
  }

  function nextauthSignIn(username: string) {
    ctx.setUserName(username);
    onClose();
  }

  return (
    <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mb='-3.5'>Please Choose a Username!</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(submitHandler)}>
            <Input
              type='text'
              variant='filled'
              fontWeight={500}
              letterSpacing='.05rem'
              placeholder={`Username`}
              id='username'
              errorBorderColor='red'
              {...register("username", {
                onBlur: () => {},
              })}
            />
          </form>
          <Text mt='3.5'>Or select another method to login</Text>
          <Box>
            <Button
              leftIcon={<Icon as={FaGoogle} />}
              mr='.5rem'
              isLoading={loading}
              loadingText='Loading'
              onClick={() => {
                signIn("google");
              }}
            >
              Google
            </Button>
            <Button
              leftIcon={<Icon as={FaDiscord} />}
              isLoading={loading}
              loadingText='Loading'
              onClick={() => {
                signIn("discord");
              }}
            >
              Discord
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserNameModal;
