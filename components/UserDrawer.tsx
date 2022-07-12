import React from "react";
import { Drawer, DrawerOverlay, DrawerContent, DrawerBody, Box, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useSwipeable } from "react-swipeable";

interface DrawerProps {
  onClose: () => void;
  isOpen: boolean;
  children: any;
}

const UserDrawer: React.FC<DrawerProps> = (props) => {
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      props.onClose();
    },
  });
  const BGColor = useColorModeValue("rgba(240, 238, 238, 0.228)", "rgba(0, 0, 0, 0.63)");

  return (
    <Drawer placement='right' onClose={props.onClose} isOpen={props.isOpen}>
      <DrawerContent backdropFilter='blur(4px)' bg='none' w='200px' maxW='200px'>
        <DrawerBody bg={BGColor} {...swipeHandlers} p='0'>
          {props.children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default UserDrawer;
