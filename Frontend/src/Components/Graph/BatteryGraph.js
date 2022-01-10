import { AddIcon } from "@chakra-ui/icons";
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
import { DateTime } from "luxon";

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
  function activeReducer(state, { key, value }) {
    state[key] = value;
    // console.log("After setting", key, "to", value, ":", state);
    return state;
  }
  const [active, setActive] = useReducer(activeReducer, {});

  function datasetReducer(state, { action, key }) {
    switch (action) {
      case "add":
        // key: string
        for (let i = 0; i < state.length; i++) {
          if (state[i].parsing.yAxisKey === key) {
            state[i].hidden = false;
            setActive({ key: state[i].parsing.yAxisKey, value: true });
            return state;
          }
        }

        // unable to find it
        return state;
      case "remove":
        // key: string
        for (let i = 0; i < state.length; i++) {
          if (state[i].parsing.yAxisKey === key) {
            state[i].hidden = true;
            setActive({ key: state[i].parsing.yAxisKey, value: false });
            return state;
          }
        }

        // unable to find it
        return state;
      case "toggle":
        // key: string
        for (let i = 0; i < state.length; i++) {
          if (state[i].parsing.yAxisKey === key) {
            state[i].hidden = !state[i].hidden;
            return state;
          }
        }

        // unable to find it
        return state;
      case "set":
        // key: string[]
        for (let i = 0; i < state.length; i++) {
          if (key.includes(state[i].parsing.yAxisKey)) {
            state[i].hidden = !state[i].hidden;
          }
        }
        return state;
      case "update":
        // key: undefined
        // console.log("updating...");
        for (let i = 0; i < state.length; i++) {
          if (active[state[i].parsing.yAxisKey] && !state[i].hidden)
            state[i].data = graphData;
        }
        return state;
      default:
        console.warn("Unknown operation:", action);
    }
  }

  const [datasets, updateDatasets] = useReducer(
    datasetReducer,
    allDatasets.map((dataset) => ({
      parsing: { yAxisKey: dataset.key },
      label: dataset.name,
      data: [],
      borderColor: dataset.color,
      backgroundColor: dataset.color + "B3",
      hidden: true,
    }))
  );
  useEffect(() => {
    updateDatasets({ action: "update" });
    // console.log("new state:", datasets);
  }, [graphData]);

  const labels = allDatasets.map((graphDataNode) => graphDataNode.timestamps);
  const data = { labels, datasets };
  console.log("new state:", data);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        // display: false,
      },
    },
    animation: false,
    scales: {
      xAxis: {
        type: "time",
        // min: DateTime.now()
        //   .minus(Duration.fromMillis(GraphData.historyLength))
        //   .toString(),
        max: DateTime.now().toString(),
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
            onClick={() =>
              updateDatasets({
                action: "add",
                key: allDatasets.filter((dataset) => !active[dataset.key])[
                  Math.floor(Math.random() * allDatasets.length)
                ].key,
              })
            }
          >
            <AddIcon />
          </Button>
          <Box flex={1} borderColor="black" borderWidth={1} spacing={2}>
            {datasets
              .filter((dataset) => active[dataset.parsing.yAxisKey])
              .map((dataset) => (
                <Button
                  key={dataset.parsing.yAxisKey}
                  borderColor={dataset.borderColor}
                  borderWidth={2}
                  backgroundColor={
                    dataset.hidden ? "transparent" : dataset.backgroundColor
                  }
                  textDecoration={dataset.hidden ? "line-through" : "none"}
                  onClick={() => {
                    // console.log("clicked", dataset.parsing.yAxisKey);
                    updateDatasets({
                      action: "toggle",
                      key: dataset.parsing.yAxisKey,
                    });
                  }}
                  mb={1}
                  mr={1}
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
