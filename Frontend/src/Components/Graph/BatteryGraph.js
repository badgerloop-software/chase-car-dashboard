import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  HStack,
  Stack,
  Text,
  VStack,
  Icon,
  useConst,
} from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
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
import GraphContext from "./GraphContext";
import GraphData from "./graph-data.json";

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

  const allDatasets = categories.flatMap((category) => category.values);
  function reducer(state, { action, key }) {
    switch (action) {
      case "add":
        // key: string
        console.log("Adding", key, "...");
        const toAdd = allDatasets.find((dataset) => dataset.key === key);
        console.log("as", toAdd);
        if (toAdd && !state.find((dataset) => dataset.key === key)) {
          return state.concat({
            key: toAdd.key,
            label: toAdd.name,
            data: graphData[toAdd.key],
            borderColor: toAdd.color,
            backgroundColor: toAdd.color + "B3",
            hidden: false,
          });
        }
        return state;
      case "remove":
        // key: string
        for (let i = 0; i < state.length; i++) {
          if (state[i].key === key) {
            return state.slice(0, i).concat(state.slice(i + 1));
          }
        }
        return state;
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
        }));
      case "set":
        // key: string[]
        return key.map((value) => ({
          key: toAdd.key,
          label: value.name,
          data: graphData[value.key],
          borderColor: value.color,
          backgroundColor: value.color + "B3",
          hidden: false,
        }));
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
        }));
      default:
        console.warn("Unknown operation:", action);
    }
  }

  const [datasets, updateDatasets] = useReducer(reducer, []);
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
        // min: DateTime.now()
        //   .minus(Duration.fromMillis(GraphData.historyLength))
        //   .toString(),
        // suggestedMax: DateTime.now().toString(),
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
    <HStack h="100%" align="stretch" {...props}>
      <Text
        css={{ writingMode: "vertical-lr" }}
        transform="rotate(180deg)"
        borderLeftColor="grey.300"
        borderLeftWidth={1}
        textAlign="center"
      >
        Battery
      </Text>
      <VStack p={2} flex={1} align="stretch">
        <Stack direction="row">
          <Button>
            <Icon as={FaSave} />
          </Button>
          <Button
            onClick={() => {
              console.log("allDatasets:", allDatasets);
              console.log("datasets:", datasets);
              const filtered = allDatasets
                .map((dataset) => dataset.key)
                .filter(
                  (key) => !datasets.find((dataset) => dataset.key === key)
                );
              console.log("filtered:", filtered);
              updateDatasets({
                action: "add",
                key: filtered[Math.floor(Math.random() * filtered.length)],
              });
            }}
          >
            <EditIcon />
          </Button>
          <Box
            flex={1}
            borderColor="black"
            borderWidth={1}
            overflowX="scroll"
            spacing={2}
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
                mb={2}
                mr={2}
                size="xs"
              >
                {dataset.label}
              </Button>
            ))}
          </Box>
        </Stack>
        <Center flex={1}>
          <Line data={data} options={options} />
        </Center>
      </VStack>
    </HStack>
  );
}
