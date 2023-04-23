import { useState } from "react";
import { Collapse, Box, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

function Expandable(props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box maxW="2xl">
      <Box>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          leftIcon={<ChevronDownIcon />}
          variant="ghost"
          colorScheme="gray"
          size={props.size}
        >
          {props.label}
        </Button>
      </Box>
      <Collapse in={isExpanded} animateOpacity>
        <Box p="3">
          <Box p="4" bg="gray.50" rounded="md" shadow="md">
            {props.children}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export default Expandable;
