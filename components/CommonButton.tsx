import { Button } from "@chakra-ui/react";
import React from "react";

type Props = {
  leftIcon?: React.ReactElement;
  onClick?: () => void;
};

const CommonButton: React.FC<Props> = ({ children, leftIcon, onClick }) => {
  return (
    <Button
      leftIcon={leftIcon}
      onClick={onClick}
      rounded={"full"}
      boxShadow="xl"
      size={"lg"}
      fontWeight={"normal"}
      px={6}
      colorScheme={"red.400"}
      bg={"red.400"}
      _hover={{ opacity: 0.8 }}
    >
      {children}
    </Button>
  );
};

export default CommonButton;
