import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { SocketContext } from "../context/socket-context";

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

  useEffect(() => {
    onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <Modal
      isCentered
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Please Select a Username!</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(submitHandler)}>
            <Input
              type='text'
              placeholder={`Username`}
              id='username'
              errorBorderColor='red'
              {...register("username", {
                onBlur: () => {},
              })}
            />
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserNameModal;
