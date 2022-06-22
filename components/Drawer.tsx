import React from "react";
import { Drawer, DrawerOverlay, DrawerContent, DrawerBody, Box, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useSwipeable } from "react-swipeable";

interface DrawerProps {
  onClose: () => void;
  isOpen: boolean;
  children: any;
}

const SideDrawer: React.FC<DrawerProps> = (props) => {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      props.onClose();
    },
  });

  return (
    <Drawer placement='left' onClose={props.onClose} isOpen={props.isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody {...swipeHandlers} p='-4'>
          {props.children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
