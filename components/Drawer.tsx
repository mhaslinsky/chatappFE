import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
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
        <DrawerBody>{props.children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
