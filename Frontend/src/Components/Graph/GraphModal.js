import {
  Button,
  Checkbox,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useReducer } from "react";
import GraphData from "./graph-data.json";

function GraphModal(props) {
  const { isOpen, onClose, datasets, onSave } = props;

  const [dataKeys, changeDataKeys] = useReducer(
    (state, { action, key }) => {
      switch (action) {
        case "add":
          return state.concat([key]);
        case "remove":
          const index = state.indexOf(key);
          return state.slice(0, index).concat(state.slice(index + 1));
        default:
          console.warn("DEFAULT CASE REACHED IN GRAPH MODAL");
          return [];
      }
    },
    datasets.map((dataset) => dataset.key)
  );

  // useEffect(() => {
  //   console.log("new keys:", dataKeys);
  // }, [dataKeys]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Datasets</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack align="stretch">
            {GraphData.categories.map((category) => (
              <VStack align="stretch" key={category.category}>
                <Heading size="md">{category.category}</Heading>
                <SimpleGrid columns={2}>
                  {category.values.map((value) => (
                    <Checkbox
                      defaultChecked={dataKeys.includes(value.key)}
                      onInput={(e) => {
                        // console.log(value.name, e.target.checked);
                        if (e.target.checked) {
                          changeDataKeys({ action: "add", key: value.key });
                        } else {
                          changeDataKeys({ action: "remove", key: value.key });
                        }
                      }}
                      key={value.key}
                    >
                      {value.name}
                    </Checkbox>
                  ))}
                </SimpleGrid>
              </VStack>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            bg="#008640"
            mr={3}
            onClick={() => {
              // console.log("Saving and exiting...");
              onSave(dataKeys);
              onClose();
            }}
          >
            Save &amp; Close
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default GraphModal;
