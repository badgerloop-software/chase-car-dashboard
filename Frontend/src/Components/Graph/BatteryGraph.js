import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  HStack,
  Icon,
  Stack,
  Text,
  useConst,
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
import { useContext, useEffect, useReducer } from "react";
import { Line } from "react-chartjs-2";
import { FaSave } from "react-icons/fa";
import GraphData from "./graph-data.json";
import GraphContext from "./GraphContext";
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

function generateCategories() {
  const output = [];
  for (const category of GraphData.categories) {
    const values = category.values.map((obj) => {
      const colorNum = Math.floor(Math.random() * 0x3fffff + 0x3fffff);
      const color = "#" + colorNum.toString(16);

      const output = { key: obj.key, name: obj.name, color };
      // console.log("Generated color for", obj, ":", output);
      return output;
    });
    output.push({ category: category.category, values });
  }

  return output;
}

export default function BatteryGraph(props) {
  const categories = useConst(generateCategories);
  const graphData = useContext(GraphContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const allDatasets = categories.flatMap((category) => category.values);
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
          data: graphData[dataset.key],
          borderColor: dataset.borderColor,
          backgroundColor: dataset.backgroundColor,
          hidden: dataset.key === key ? !dataset.hidden : dataset.hidden,
          pointBackgroundColor: "transparent",
          pointBorderColor: "transparent",
          pointRadius: 10,
        }));
      case "set":
        // key: string[]
        return key.map((key) => {
          const value = allDatasets.find((dataset) => dataset.key === key);
          return {
            key: value.key,
            label: value.name,
            data: graphData[value.key],
            borderColor: value.color,
            backgroundColor: value.color + "B3",
            hidden: false,
            pointBackgroundColor: "transparent",
            pointBorderColor: "transparent",
            pointRadius: 10,
          };
        });
      case "update":
        // key: undefined
        // console.log("updating...");
        return state.map((dataset) => ({
          key: dataset.key,
          label: dataset.label,
          data: graphData[dataset.key],
          borderColor: dataset.borderColor,
          backgroundColor: dataset.backgroundColor,
          hidden: dataset.hidden,
          pointBackgroundColor: "transparent",
          pointBorderColor: "transparent",
          pointRadius: 10,
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
  }, [graphData]);

  const data = { datasets };
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
  };

  return (
    <>
      <HStack w="100%" h="100%" align="stretch" {...props}>
        <Text
          css={{ writingMode: "vertical-lr" }}
          transform="rotate(180deg)"
          borderLeftColor="grey.300"
          borderLeftWidth={1}
          textAlign="center"
        >
          Battery
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
