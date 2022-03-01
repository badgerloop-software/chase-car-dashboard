import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-luxon";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { FaSave } from "react-icons/fa";
import GraphSelectModal from "./GraphSelectModal";

ChartJS.register(
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// the options fed into the graph object, save regardless of datasets
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  animation: false,
  scales: {
    xAxis: {
      type: "time",
      reverse: true,
      bounds: "data", // ticks?
      source: "auto",
      time: {
        unit: 'second',
        unitStepSize: 1,
        tooltipFormat: "h:mm:ss a",
        displayFormats: {
          second: 'h:mm:ss a'
        }
      }
    },
    yAxis: {
      suggestedMin: 0,
    },
  },
  elements: {
    line: {
      borderCapStyle: "round",
      borderJoinStyle: "round",
    },
  },
  datasets: {
    line: {
      pointBackgroundColor: "transparent",
      pointBorderColor: "transparent",
      pointRadius: 10,
    },
  },
};

/**
 * Creates a customizable graph
 *
 * @param {any} props the props to pass to this graph; any {@link StackProps} will be passed to the overarching container
 * @param {(name: string, datasets: string[]) => void} props.onSave the callback function for when the user attempts to save this graph
 * @param {string} props.title the title that this graph has
 * @param {{category: string, values: Dataset[]}[]} props.categories the color and other associated data for each dataset, organized in an object
 * @param {Dataset[]} props.allDatasets a list of all datasets, complete with ID and color information
 * @param {string[]} props.initialDatasets a list of the IDs of the initial datasets
 * @param {any} props.packed the queue of data, packed in Chart.js format, coming from the solar car
 * @returns
 */
export default function CustomGraph(props) {
  // destructure props
  const {
    onSave,
    title,
    categories,
    packedData,
    initialDatasets,
    allDatasets,
    ...stackProps
  } = props;

  // disclosure for the data selection modal
  const {
    isOpen: isDataSelectOpen,
    onOpen: onDataSelectOpen,
    onClose: onDataSelectClose,
  } = useDisclosure();
  // disclosure for the name modal
  const {
    isOpen: isNameModalOpen,
    onOpen: onNameModalOpen,
    onClose: onNameModalClose,
  } = useDisclosure();

  // an object that contains every selected dataset and a boolean to store whether it is enabled
  const [datasets, setDatasets] = useState(() => {
    const output = {};
    for (const dataset of initialDatasets) {
      output[dataset] = true;
    }

    console.log("init datasets:", output, "from", initialDatasets);

    return output;
  });
  // useEffect(() => {
  //   console.log("datasets updated :]", datasets);
  // }, [datasets]);

  // the data to pass to the graph
  const formattedDatasets = [];
  for (const key in datasets) {
    const temp = packedData.find((packedDataset) => packedDataset.key === key);
    if (temp) {
      temp.hidden = !datasets[key];
      formattedDatasets.push(temp);
    }
  }

  // console.log("formatted datasets:", formattedDatasets);
  // console.log(datasets, "keys:", Object.keys(datasets));
  const data = { datasets: formattedDatasets };

  return (
    <>
      <HStack w="100%" h="100%" align="stretch" {...stackProps}>
        <Text
          css={{ writingMode: "vertical-lr" }}
          transform="rotate(180deg)"
          borderLeftColor="grey.300"
          borderLeftWidth={1}
          textAlign="center"
        >
          {title?.length ? title : "Custom"}
        </Text>
        <VStack
          p={2}
          flex={1}
          align="stretch"
          justify="stretch"
          overflow="hidden"
        >
          <Stack direction="row">
            <Button
              onClick={() => {
                if (title.length) {
                  onSave(title, Object.keys(datasets));
                } else {
                  onNameModalOpen();
                }
              }}
            >
              <Icon as={FaSave} />
            </Button>

            <Button onClick={onDataSelectOpen}>
              <EditIcon />
            </Button>

            <HStack
              flex="1 1 0"
              spacing={2}
              borderWidth={1}
              borderColor="black"
              overflowX="scroll"
              px={2}
            >
              {Object.keys(datasets).map((key) => {
                const dataset = formattedDatasets.find(
                  (temp) => temp.key === key
                );
                // console.log("dataset", dataset, "for", key);
                return (
                  <Button
                    key={key}
                    borderColor={dataset.borderColor}
                    borderWidth={2}
                    backgroundColor={
                      datasets[key] ? dataset.backgroundColor : "transparent"
                    }
                    textDecoration={datasets[key] ? "none" : "line-through"}
                    onClick={() => {
                      console.log("clicked", key);
                      // updateDatasets({ action: "toggle", key: dataset.key });
                      datasets[key] = !datasets[key];
                      setDatasets(datasets);
                    }}
                    flexShrink={0}
                    size="xs"
                  >
                    {dataset.label}
                  </Button>
                );
              })}
            </HStack>
          </Stack>

          <Center flex={1}>
            <Line data={data} options={options} parsing="false" />
          </Center>
        </VStack>
      </HStack>

      <GraphSelectModal
        isOpen={isDataSelectOpen}
        onClose={onDataSelectClose}
        initialDatasets={Object.keys(datasets)}
        onSave={(keys) => {
          // updateDatasets({ action: "set", key: keys })
          // console.log("keys:", keys);

          const newDatasets = {};
          for (const key of keys) {
            newDatasets[key] = datasets[key] ?? true;
          }
          // console.log("new datasets:", newDatasets);
          setDatasets(newDatasets);
        }}
      />

      <GraphNameModal
        isOpen={isNameModalOpen}
        onClose={onNameModalClose}
        onSave={(name) => onSave(name, Object.keys(datasets))}
      />
    </>
  );
}

/**
 * Creates a new component that is a dialog that prompts the user for a name
 * for a graph
 *
 * @param {any} props the props to pass this component
 * @param {boolean} props.isOpen whether the dialog is to be open
 * @param {() => void} props.onClose the function callback for when the modal
 * is closed
 * @param {(string) => void} props.onSave the function callback for when the
 * user clicks "save and continue", with the new title as the argument
 * @return the modal component
 */
function GraphNameModal(props) {
  // destructure the props
  const { isOpen, onClose, onSave } = props;

  // the new name, stored as part of the state
  const [name, setName] = useState("");

  const isInvalid = !name.length || name === "Custom";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Please enter a name for the graph</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl isInvalid={isInvalid}>
            <FormLabel htmlFor="graphName">Name</FormLabel>
            <Input
              id="graphName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(evt) => {
                if (!isInvalid && evt.key === "Enter") {
                  onSave(name);
                  onClose();
                }
              }}
              required
            />
            {isInvalid ? (
              <FormErrorMessage>
                A name for the graph is required, and it cannot be "Custom".
              </FormErrorMessage>
            ) : (
              <FormHelperText>
                Please enter a unique name to refer to the graph.
              </FormHelperText>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            bg="#008640"
            type="submit"
            mr={3}
            onClick={() => {
              // console.log("Saving and exiting...");
              onSave(name);
              onClose();
            }}
            isDisabled={isInvalid}
          >
            Save &amp; Continue
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
