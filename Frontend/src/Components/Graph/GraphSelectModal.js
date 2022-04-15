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
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useReducer } from "react";
import GraphData from "./graph-data.json";

/**
 * The reducer for the dataKeys state variable
 *
 * @param {string[]} state the previous list of selected data keys
 * @param {{action: string, key: string}}} new the action to perform and the key to add or remove
 * @returns the new state (or list of selected data keys)
 */
const dataKeysReducer = (state, { action, key }) => {
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
};

/**
 * All the time lengths that are selectible by the slider
 */
const timeLengths = [
  { label: "5 seconds", seconds: 5 },
  { label: "10 seconds", seconds: 10 },
  { label: "20 seconds", seconds: 20 },
  { label: "30 seconds", seconds: 30 },
  { label: "45 seconds", seconds: 45 },
  { label: "1 minute", seconds: 60 },
  { label: "2 minutes", seconds: 120 },
  { label: "3 minutes", seconds: 180 },
  { label: "5 minutes", seconds: 300 },
  { label: "7 minutes", seconds: 420 },
  { label: "10 minutes", seconds: 600 },
];

/**
 * Creates a new graph selection modal component
 *
 * @param {any} props the props to pass this graph selection modal
 * @param {boolean} props.isOpen whether this modal is to be open
 * @param {() => void} props.onClose the function callback for when this modal closes
 * @param {string[]} props.initialDatasets the initial list of datasets to use
 * @param {number} props.initialHistoryLength the initial history length to use
 * @param {(string[], number) => void)} props.onSave the function callback for when the
 * user clicks the "save and exit" button, with the selected datasets' keys and the
 * new history length as the argument
 * @returns the modal component
 */
function GraphModal(props) {
  const { isOpen, onClose, initialDatasets, initialHistoryLength, onSave } =
    props;

  const [dataKeys, changeDataKeys] = useReducer(
    dataKeysReducer,
    initialDatasets
  );
  const [historyLength, setHistoryLength] = useState(initialHistoryLength);

  // useEffect(() => {
  //   console.log("GraphModal dialog updated");
  // });
  // useEffect(() => {
  //   console.log("GraphModal should be updated");
  // }, [isOpen, onClose, initialDatasets, onSave, dataKeys]);

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
            <VStack align="stretch">
              <Heading size="md">History Length</Heading>
              <Slider
                aria-label="Time history length slider"
                defaultValue={timeLengths.findIndex(
                  (time) => time.seconds === (initialHistoryLength ?? 60)
                )}
                min={0}
                max={timeLengths.length - 1}
                step={1}
                onChangeEnd={(val) => {
                  console.log(
                    `set history length to ${timeLengths[val].seconds} seconds`
                  );
                  setHistoryLength(timeLengths[val].seconds);
                }}
              >
                {timeLengths.map((value, index) => (
                  <SliderMark
                    value={index}
                    mt={2}
                    ml={-2.5}
                    fontSize="sm"
                    key={value.label}
                  >
                    {value.label}
                  </SliderMark>
                ))}
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            bg="#008640"
            mr={3}
            onClick={() => {
              // console.log("Saving and exiting...");
              onSave(dataKeys, historyLength);
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
