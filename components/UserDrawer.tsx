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

  return (
    <Drawer placement='right' onClose={props.onClose} isOpen={props.isOpen}>
      <DrawerOverlay />
      <DrawerContent w='200px' maxW='200px'>
        <DrawerBody {...swipeHandlers} p='0'>
          {props.children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default UserDrawer;
