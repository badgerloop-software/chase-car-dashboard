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
import { useEffect, useState } from "react";
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
 * @param {Dataset[]} props.allDatasets a list of all datasets, complete with ID and color information
 * @param {string[]} props.initialDatasets a list of the IDs of the initial datasets
 * @param {any} props.packed the queue of data, packed in Chart.js format, coming from the solar car
 * @returns
 */
export default function CustomGraph(props) {
  const {
    onSave,
    title,
    categories,
    packedData,
    initialDatasets,
    allDatasets,
    ...stackProps
  } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [datasets, setDatasets] = useState(() => {
    const output = {};
    for (const dataset of initialDatasets) {
      output[dataset] = true;
    }
    return output;
  });
  // useEffect(() => {
  //   console.log("datasets updated :]", datasets);
  // }, [datasets]);

  // the data to pass to the graph
  // const formattedDatasets = Object.keys(datasets)
  //   .filter((key) => datasets[key])
  //   .map((key) => {
  //     const temp = packedData.find(
  //       (packedDataset) => packedDataset.key === key
  //     );
  //     // console.log("adding", key, ":", temp);
  //     return temp;
  //   });
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
            <Line data={data} options={options} />
          </Center>
        </VStack>
      </HStack>
      <GraphModal
        isOpen={isOpen}
        onClose={onClose}
        datasets={Object.keys(datasets)}
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
    </>
  );
}
