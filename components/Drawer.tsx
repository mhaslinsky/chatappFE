import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";

interface DrawerProps {
  onClose: () => void;
  isOpen: boolean;
  children: any;
}

const SideDrawer: React.FC<DrawerProps> = (props) => {
  return (
    <Drawer placement='left' onClose={props.onClose} isOpen={props.isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody h='100%' p='0'>
          {props.children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
