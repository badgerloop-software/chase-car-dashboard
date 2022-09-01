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
  useColorMode,
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
import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { FaSave } from "react-icons/fa";
import GraphSelectModal from "./GraphSelectModal";
import GraphData from "./graph-data.json";
import getColor from "../Shared/colors";

ChartJS.register(
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Stores all the units in the graph-data json file as key: value pairs
 */
const units = {};
for (const category of GraphData.categories) {
  for (const dataset of category.values) {
    units[dataset.key] = dataset.unit;
  }
}

// the options fed into the graph object, save regardless of datasets
function getOptions(now, secondsRetained, colorMode) {
  // console.log("now:", now);
  // console.log("diff:", DateTime.now().diff(now).toHuman());

  const gridColor = getColor("grid", colorMode);
  const gridBorderColor = getColor("gridBorder", colorMode);
  const ticksColor = getColor("ticks", colorMode);

  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "x",
    animation: false,
    plugins: {
      // unknown if decimation is functional
      // decimation: {
      //   enabled: true,
      //   algorithm: "min-max",
      // },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (item) => {
            // console.log(item);

            // custom dataset label
            // name: value unit
            return `${item.dataset.label}: ${item.formattedValue}${
              units[item.dataset.key]
            }`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        reverse: true,
        bounds: "data", // ticks?
        time: {
          unit: "second",
          stepSize: 1,
          tooltipFormat: "h:mm:ss a",
          displayFormats: {
            second: "h:mm:ss a",
          },
        },
        ticks: {
          color: ticksColor,
        },
        grid: {
          color: gridColor,
          borderColor: gridBorderColor,
          borderWidth: 2,
        },

        // show the last secondsRetained seconds
        max: now.toISO(),
        min: now.minus(secondsRetained * 1000).toISO(),
      },
      y: {
        suggestedMin: 0,
        ticks: {
          color: ticksColor,
        },
        grid: {
          color: gridColor,
          borderColor: gridBorderColor,
          borderWidth: 2,
        },
      },
    },
    elements: {
      line: {
        borderCapStyle: "round",
        borderJoinStyle: "round",
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    datasets: {
      line: {
        pointBackgroundColor: "transparent",
        pointBorderColor: "transparent",
        pointRadius: 10,
      },
    },
  };
}

/**
 * Creates a customizable graph.
 *
 * @param {any} props the props to pass to this graph; any {@link StackProps} will be passed to the overarching container
 * @param {(name: string, isNew: boolean, data: {datasets: string[], historyLength: number}) => void} props.onSave the callback function for when the user attempts to save this graph
 * @param {string} props.title the title that this graph has
 * @param {string[]} props.initialDatasets a list of the IDs of the initial datasets
 * @param {any} props.packedData the queue of data, packed in Chart.js format, coming from the solar car
 * @param {number} props.secondsRetained the number of seconds to retain a point on this grpah
 * @returns
 */
export default function CustomGraph(props) {
  const { colorMode } = useColorMode();

  const borderCol = getColor("border", colorMode);

  // destructure props
  const {
    onSave,
    title,
    packedData,
    initialDatasets,
    secondsRetained,
    latestTime,
    ...stackProps
  } = props;

  // useEffect(() => {
  //   console.log(
  //     packedData
  //       .find((data) => data.key === "speed")
  //       .data.map((point) => point.x)
  //       .join(", ")
  //   );
  // }, [packedData]);

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

    // console.log("init datasets:", output, "from", initialDatasets);

    return output;
  });
  // useEffect(() => {
  //   console.log(`datasets for "${title}" updated:`, datasets);
  // }, [datasets, title]);

  // a state variable that stores how many seconds' worth of data to display on the graph
  const [historyLength, setHistoryLength] = useState(
    secondsRetained ?? GraphData.defaultHistoryLength
  );

  // the data to pass to the graph
  const [formattedDatasets, setFormattedDatasets] = useState([]);
  // the keys of the dataset array
  const [datasetKeys, setDatasetKeys] = useState(Object.keys(datasets));
  // called when the name is to be saved for the first time, memoized for performance
  const onNewSave = useCallback(
    (name) => onSave(name, true, { datasets: datasetKeys, historyLength }),
    [onSave, datasetKeys, historyLength]
  );

  // side-effects for when new datasets are chosen
  useEffect(() => {
    // console.log("yo, new datasets dropped:", datasetKeys);
    // console.log("keys:", keys);

    // update dataset object {key: boolean}
    const newDatasets = {};
    for (const key of datasetKeys) {
      newDatasets[key] = datasets[key] ?? true;
    }
    // console.log("new datasets:", newDatasets);
    setDatasets(newDatasets);
  }, [datasetKeys]);

  useEffect(() => {
    // update formatted datasets storage array if all datasets are updated
    const formattedDatasets = [];
    for (const key of datasetKeys) {
      const temp = packedData.find(
        (packedDataset) => packedDataset.key === key
      );
      if (temp) {
        // copy the data to ensure that this function remains pure
        const copy = Object.assign({}, temp);
        copy.hidden = !datasets[key];
        // console.log(`${title} pushed:`, copy);
        formattedDatasets.push(copy);
      } else {
        console.warn(`unable to find "${key}" for "${title}"`);
      }
    }

    // console.log("formatted datasets:", formattedDatasets);
    setFormattedDatasets(formattedDatasets);
  }, [datasets, packedData]);

  // console.log("formatted datasets:", formattedDatasets);
  // console.log(datasets, "keys:", datasetKeys);

  // the modal that appears when the user wants to update the datasets that are shown
  const graphSelectModal = useMemo(() => {
    const onSelectSave = (newDatasetKeys, newHistoryLength) => {
      setDatasetKeys(newDatasetKeys);
      setHistoryLength(newHistoryLength);
    };
    return (
      <GraphSelectModal
        isOpen={isDataSelectOpen}
        onClose={onDataSelectClose}
        initialDatasets={datasetKeys}
        initialHistoryLength={historyLength}
        onSave={onSelectSave}
      />
    );
  }, [
    isDataSelectOpen,
    onDataSelectClose,
    datasetKeys,
    setDatasetKeys,
    setHistoryLength,
    historyLength,
  ]);

  // the modal that appears when the user saves the graph,
  // but the graph has no name associated with it
  const graphNameModal = useMemo(
    () => (
      <GraphNameModal
        isOpen={isNameModalOpen}
        onClose={onNameModalClose}
        onSave={onNewSave}
      />
    ),
    [isNameModalOpen, onNameModalClose, onNewSave]
  );

  // the actual graph shown to the user
  const graph = useMemo(() => {
    // const min = DateTime.now().minus(historyLength * 1_000);
    console.time("graph update");
    const temp = (
      <Line
        data={{ datasets: formattedDatasets }}
        options={getOptions(
          DateTime.fromFormat(latestTime, "HH:mm:ss.SSS") ?? DateTime.now(),
          historyLength,
          colorMode
        )}
        parsing="false"
      />
    );
    console.timeEnd("graph update");
    return temp;
  }, [formattedDatasets, historyLength, latestTime]);

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
                  onSave(title, false, {
                    datasets: datasetKeys,
                    historyLength,
                  });
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
              borderColor={borderCol}
              overflowX="scroll"
              px={2}
            >
              {datasetKeys.map((key) => {
                const dataset = formattedDatasets.find(
                  (temp) => temp.key === key
                );
                // console.log("dataset", dataset, "for", key);
                return (
                  dataset && (
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
                        const temp = Object.assign({}, datasets);
                        temp[key] = !temp[key];
                        setDatasets(temp);
                      }}
                      flexShrink={0}
                      size="xs"
                    >
                      {dataset.label}
                    </Button>
                  )
                );
              })}
            </HStack>
          </Stack>

          <Center flex={1}>{graph}</Center>
        </VStack>
      </HStack>

      {graphSelectModal}
      {graphNameModal}
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
 * @param {(name: string, isNew: boolean) => boolean} props.onSave the function callback for when the
 * user clicks "save and continue", with the new title (and true) as the argument,
 * and returns whether the operation was successful
 * @return the modal component
 */
function GraphNameModal(props) {
  // destructure the props
  const { isOpen, onClose, onSave } = props;

  // the new name, stored as part of the state
  const [name, setName] = useState("");

  // whether the currently chosen name is valid
  // const isInvalid = !name.length || name === "Custom";
  const [isInvalid, setInvalid] = useState(true);
  useEffect(() => {
    setInvalid(!name.length || name === "Custom");
  }, [name]);

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
                  if (onSave(name)) {
                    onClose();
                  } else {
                    setInvalid(true);
                  }
                }
              }}
              required
            />
            {isInvalid ? (
              <FormErrorMessage>
                A unique name for the graph is required, and it cannot be
                "Custom".
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
              if (onSave(name)) onClose();
              else setInvalid(true);
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
