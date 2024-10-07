import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  HStack,
  VStack,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  Interaction,
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
import { memo, useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import { FaSave } from "react-icons/fa";
import GraphSelectModal from "./GraphSelectModal";
import GraphData from "./graph-data.json";
import getColor from "../Shared/colors";
import { ROUTES } from "../Shared/misc-constants";
import {getRelativePosition} from "chart.js/helpers";

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
 * Stores all the units and nominal minimum/maximum values in the graph-data json file as key: value pairs
 */
const valueInfo = {};
for (const category of GraphData.Output) {
  for (const subcategory of category.subcategories) {
    for (const dataset of subcategory.values) {
      valueInfo[dataset.key] = {
        unit: dataset.unit,
        min: dataset.min,
        max: dataset.max
      };
    }
  }
}

// the options fed into the graph object, save regardless of datasets
function getOptions(now, secondsRetained, colorMode, optionInfo, extremes) {
  const gridColor = getColor("grid", colorMode);
  const gridBorderColor = getColor("gridBorder", colorMode);
  const ticksColor = getColor("ticks", colorMode);

  // Custom interaction (feat. ChatGPT)
  Interaction.modes.myCustomMode = function(chart, e, options, useFinalPosition) {
    const position = chart.chartArea ? getRelativePosition(e, chart) : getRelativePosition(e, chart.chart);

    const nearestPoints = [];

    // Store the minimum distance and index of the nearest point for each dataset
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (!chart.getDatasetMeta(datasetIndex).hidden) {
        let minDistance = Number.POSITIVE_INFINITY;
        let nearestIndex = -1;
        // find the data point that is closest to the cursor
        for (let index = 0; index < dataset.data.length; ++index) {
          const element = chart.getDatasetMeta(datasetIndex).data[index];
          const xValue = element.x;
          const distance = Math.abs(xValue - position.x);
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = index;
          }
        }

        if (nearestIndex !== -1) {
          nearestPoints.push({ element: chart.getDatasetMeta(datasetIndex).data[nearestIndex], datasetIndex, index: nearestIndex });
        }
      }
    });
    return nearestPoints;
  }

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
            // custom dataset label
            // name: value unit
            return `${item.dataset.label}: ${item.formattedValue} ${optionInfo[item.dataset.key].unit}`;
          },
          labelColor: (item) => {
            return {
              borderColor: optionInfo[item.dataset.key].borderColor,
              backgroundColor: optionInfo[item.dataset.key].backgroundColor
            }
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
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
        max: DateTime.fromMillis(Math.floor(now/1000) * 1000).toISO(),
        min: DateTime.fromMillis((Math.floor(now/1000) - secondsRetained) * 1000).toISO(),
      },
      y: {
        suggestedMin: extremes[0],
        suggestedMax: extremes[1],
        position: "right",
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
      mode: 'myCustomMode'
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
 * The graph component, pass in list of data and it will fetch itself
 * @param props
 * @constructor
 */
function Graph(props) {
  const { querylist, histLen, colorMode, optionInfo, extremes } = props;
  // response from the server
  const [data, setData] = useState([]);
  const fetchDelay = 500;
  const ws = useRef(null);

  // open websocket on mount
  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:4001/components/graph`);

    ws.current.onmessage = (event) => {
      try {
        const carData = JSON.parse(event.data);
        setData(carData.response);
      } catch {
        console.log('Error recieving data from websocket');
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // close connection on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  },[])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const message = {
        querylist: querylist.join(','),
        start_time: now - (histLen + 1) * 1000,
        end_time: now,
      };

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message));
      }
    }, fetchDelay);

    return () => clearInterval(intervalId);
  },[querylist, histLen]);

  // get the latest timestamp in the packet
  let tstamp = 0;
  if ("timestamps" in data) {
    tstamp = data["timestamps"].slice(-1)[0];
  } else {
    tstamp = Date.now()
  }

  let formattedData = {};
  formattedData['datasets'] = [];
  for(const key in data) {
    if(key !== 'timestamps' && optionInfo[key])
      formattedData['datasets'].push({
        key: key,
        label: optionInfo[key].label,
        data: data[key],
        borderColor: optionInfo[key].borderColor,
        backgroundColor: optionInfo[key].backgroundColor
      });
  }

  console.log(formattedData, "formatted");

  return (
      <Line
        data={formattedData}
        options={getOptions(
          tstamp,
          histLen,
          colorMode,
          optionInfo,
          extremes
        )}
        parsing="false"
      />
  );
}

/**
 * Custom graph component and the data selector for the graph component
 * @param props {}
 * @returns {JSX.Element}
 * @constructor
 */
function CustomGraph(props) {
  const { colorMode } = useColorMode();

  const borderCol = getColor("border", colorMode);

  // destructure props
  const {
    onSave,
    title,
    packedData,
    initialDatasets,
    secondsRetained,
  } = props;

  // The datasets to be displayed on the graph
  const [datasetKeys, setDatasetKeys] = useState(initialDatasets);
  const [historyLength, setHistoryLength] = useState(secondsRetained ?? GraphData.defaultHistoryLength);
  // those keys are crossed out
  const [noShowKeys, setNoShowKeys] = useState({});
  // Information about options for styling purposes,
  // reduced and combined so that minimal information is passed to other components
  const [optionInfo, yRange] = useMemo(() => {
    return datasetKeys
        .filter((key) => !noShowKeys[key])
        .reduce((info, key) => {
          info[0][key] = {
            label: packedData[key].label,
            borderColor: packedData[key].borderColor,
            backgroundColor: packedData[key].backgroundColor,
            unit: valueInfo[key].unit
          };
          if(valueInfo[key].min < info[1][0])
            info[1][0] = valueInfo[key].min;
          if(valueInfo[key].max > info[1][1])
            info[1][1] = valueInfo[key].max;
          return info;
        }, [{}, [0,1]]);
  }, [datasetKeys, noShowKeys]);


  const {
    isOpen: isDataSelectOpen,
    onOpen: onDataSelectOpen,
    onClose: onDataSelectClose,
  } = useDisclosure();

  const {
    isOpen: isNameModalOpen,
    onOpen: onNameModalOpen,
    onClose: onNameModalClose,
  } = useDisclosure();

  const graphSelectModal = useMemo(() => {
    const onSelectSave = (newDatasetKeys, newHistoryLength) => {

      setDatasetKeys(newDatasetKeys);
      setHistoryLength(newHistoryLength);
      setNoShowKeys((oldKeys) => {
        return newDatasetKeys.reduce((noShow, key) => {
          noShow[key] = oldKeys[key] ?? false;
          return noShow;
        }, {});
      });

      // Save edits to graphs that are named
      if(title?.length && title !== "Custom") {
        onSave(title, false, { datasets: newDatasetKeys, historyLength: newHistoryLength });
      }
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
  }, [isDataSelectOpen, onDataSelectClose]);

  const graphNameModal = useMemo(
    () => (
      <GraphNameModal
        isOpen={isNameModalOpen}
        onClose={onNameModalClose}
        onSave={(name)=>onSave(name, true, { datasets: datasetKeys, historyLength })}
      />
    ),
    [isNameModalOpen, onNameModalClose]
  );

  return (
    <>
      <HStack w="100%" h="100%" align="stretch">
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
                return (
                    <Button
                      key={`${key}-show-btn`}
                      borderWidth={2}
                      borderColor={packedData[key].borderColor}
                      backgroundColor={noShowKeys[key] ? "transparent" : packedData[key].backgroundColor}
                      textDecoration={noShowKeys[key] ? "line-through" : "none"}
                      flexShrink={0}
                      size="xs"
                      onClick={() => {
                        setNoShowKeys((oldKeys) => ({
                          ...oldKeys,
                          [key]: !oldKeys[key]
                        }))
                      }}
                    >
                      {key}
                    </Button>
                );
              })}
            </HStack>
          </Stack>

          <Center flex={1}>
            <Graph
              querylist={datasetKeys.filter(key=>!noShowKeys[key])}
              histLen={historyLength}
              colorMode={colorMode}
              optionInfo={optionInfo}
              extremes={yRange}
            />
          </Center>
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

export default memo(CustomGraph);