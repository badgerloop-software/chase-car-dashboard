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
  useColorMode
} from "@chakra-ui/react";
import { useState } from "react";
import { useReducer } from "react";
import GraphData from "./graph-data.json";
import Expandable from "./ExpandableContent";
import getColor from "../Shared/colors"

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
  { label: "5s", seconds: 5 },
  { label: "10s", seconds: 10 },
  { label: "20s", seconds: 20 },
  { label: "30s", seconds: 30 },
  { label: "45s", seconds: 45 },
  { label: "1m", seconds: 60 },
  { label: "2m", seconds: 120 },
  { label: "3m", seconds: 180 },
  { label: "5m", seconds: 300 },
  { label: "7m", seconds: 420 },
  { label: "10m", seconds: 600 },
];

/**
 * Creates a new graph selection modal component
 *
 * @param {any} props the props to pass this graph selection modal
 * @param {boolean} props.isOpen whether this modal is to be open
 * @param {() => void} props.onClose the function callback for when this modal closes
 * @param {string[]} props.initialDatasets the initial list of datasets to use
 * @param {number} props.initialHistoryLength the initial history length to use
 * @param {(string[], number) => void} props.onSave the function callback for when the
 * user clicks the "save and exit" button, with the selected datasets' keys and the
 * new history length as the argument
 * @returns the modal component
 */
function GraphSelectModal(props) {
  // unpack props
  const { isOpen, onClose, initialDatasets, initialHistoryLength, onSave } =
    props;

  const {colorMode} = useColorMode()
  const contentBg = getColor('contentBg', colorMode);

  // a state variable that keeps track of which datasets are selected to be shown
  const [dataKeys, changeDataKeys] = useReducer(
    dataKeysReducer,
    initialDatasets
  );
  // a state variable that keeps track of the history length that the user wants to show
  const [historyLength, setHistoryLength] = useState(initialHistoryLength);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Datasets</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch">
            <hr/>
            {GraphData.Output.map((category) => (
              <VStack align="stretch" key={category.category}>
                <Expandable label={category.category} contentBg={contentBg} size="md">
                  {category.subcategories.map((subcategory) => (
                    <VStack align="strech" key={subcategory.subcategory}>
                      <Heading pt="2" size="sm">{subcategory.subcategory}</Heading>
                      <SimpleGrid columns={2}>
                        {subcategory.values.map((value) => (
                          <Checkbox
                            defaultChecked={dataKeys.includes(value.key)}
                            onInput={(e) => {
                              if (e.target.checked) {
                                // checked => add to checked datasets
                                changeDataKeys({ action: "add", key: value.key });
                              } else {
                                // unchecked => remove from checked datasets
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
                </Expandable>
                <hr/>
              </VStack>
            ))}
            <VStack align="stretch" pb={5}>
              <Heading size="md">History Length</Heading>
              <Slider
                aria-label="Time history length slider"
                defaultValue={timeLengths.findIndex(
                  (time) => time.seconds === initialHistoryLength
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

export default GraphSelectModal;
