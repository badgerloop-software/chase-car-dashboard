import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  HStack,
  Icon,
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
import { useEffect, useReducer } from "react";
import { Line } from "react-chartjs-2";
import { FaSave } from "react-icons/fa";
import GraphModal from "./GraphModal";

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
 * @param {Dataset[]} props.allDatasets a list of all datasets, including color data
 * @param {any} props.queue the queue of data coming from the solar car
 * @returns
 */
export default function CustomGraph(props) {
  const {
    onSave,
    title,
    categories,
    allDatasets,
    initialDatasets,
    queue,
    ...stackProps
  } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  function reducer(state, { action, key }) {
    console.log("reducer called :(");
    switch (action) {
      case "toggle":
        // key: string
        // const toToggle = state.find((dataset) => dataset.key === key);
        // if (toToggle) {
        //   toToggle.hidden = !toToggle.hidden;
        // }
        // return state;
        return state.map((dataset) => ({
          key: dataset.key,
          label: dataset.label,
          data: queue[dataset.key],
          borderColor: dataset.borderColor,
          backgroundColor: dataset.backgroundColor,
          hidden: dataset.key === key ? !dataset.hidden : dataset.hidden,
        }));
      case "set":
        // key: string[]
        return key.map((key) => {
          const value = allDatasets.find((dataset) => dataset.key === key);
          return {
            key: value.key,
            label: value.name,
            data: queue[value.key],
            borderColor: value.color,
            backgroundColor: value.color + "B3",
            hidden: false,
          };
        });
      case "update":
        // key: undefined
        // console.log("updating...");
        return state.map((dataset) => ({
          key: dataset.key,
          label: dataset.label,
          data: queue[dataset.key],
          borderColor: dataset.borderColor,
          backgroundColor: dataset.backgroundColor,
          hidden: dataset.hidden,
        }));
      default:
        console.warn("Unknown operation:", action);
    }
  }

  const [datasets, updateDatasets] = useReducer(reducer, []);
  useEffect(() => {
    console.log("datasets updated :]");
  }, [datasets]);
  useEffect(() => {
    updateDatasets({ action: "update" });
    // console.log("new state:", datasets);
  }, [queue]);

  // the data to pass to the graph
  const data = { datasets };

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
            <Button>
              <Icon as={FaSave} />
            </Button>
            <Button onClick={onOpen}>
              <EditIcon />
            </Button>
            <HStack
              flex="1 1 0"
              spacing={2}
              borderWidth={1}
              borderColor="black"
              overflowX="scroll"
              px={2}
              // whiteSpace="nowrap"
            >
              {datasets.map((dataset) => (
                <Button
                  key={dataset.key}
                  borderColor={dataset.borderColor}
                  borderWidth={2}
                  backgroundColor={
                    dataset.hidden ? "transparent" : dataset.backgroundColor
                  }
                  textDecoration={dataset.hidden ? "line-through" : "none"}
                  onClick={() => {
                    console.log("clicked", dataset.key);
                    updateDatasets({ action: "toggle", key: dataset.key });
                  }}
                  flexShrink={0}
                  size="xs"
                >
                  {dataset.label}
                </Button>
              ))}
            </HStack>
          </Stack>
          <Center flex={1}>
            <Line data={data} options={options} />
          </Center>
        </VStack>
      </HStack>
      <GraphModal
        isOpen={isOpen}
        onClose={onClose}
        datasets={datasets}
        onSave={(keys) => updateDatasets({ action: "set", key: keys })}
      />
    </>
  );
}
