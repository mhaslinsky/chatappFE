import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormValue {
  username: string;
}

const UserNameModal: React.FC<{
  unHandler: (un: string) => void;
}> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
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
    console.log(data.username);
    if (!data.username)
      toast({
        title: "Can't set an empty username! 😥",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    else {
      props.unHandler(data.username);
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
