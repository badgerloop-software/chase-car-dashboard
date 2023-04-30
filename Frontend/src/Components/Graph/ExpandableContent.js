import { useState } from "react";
import { Collapse, Box, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

function Expandable(props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box maxW="2xl">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        leftIcon={<ChevronDownIcon />}
        variant="ghost"
        colorScheme="gray"
        size={props.size}
        w="100%"
        justifyContent="left"
      >
        {props.label}
      </Button>
      <Collapse in={isExpanded} animateOpacity>
        <Box m="3" p="4" bg={props.contentBg} rounded="lg" shadow="md">
          {props.children}
        </Box>
      </Collapse>
    </Box>
  );
}

export default Expandable;
