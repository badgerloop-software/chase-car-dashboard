import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
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
import { useContext } from "react";
import { Line } from "react-chartjs-2";
import GraphContext from "./GraphContext";

ChartJS.register(
  // CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function BatteryGraph(props) {
  const graphData = useContext(GraphContext);
  const data = {
    datasets: [
      {
        label: "Battery Group 1",
        data: graphData.batteryGroup1,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      // {
      //   label: "Dataset 2",
      //   data: [{ x: startTime.plus(Duration.fromMillis(1000)), y: 13 }],
      //   borderColor: "rgb(53, 162, 235)",
      //   backgroundColor: "rgba(53, 162, 235, 0.5)",
      // },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 0,
    },
    scales: {
      xAxis: {
        type: "time",
        // min: DateTime.now()
        //   .minus(Duration.fromMillis(GraphData.historyLength))
        //   .toString(),
        // suggestedMax: DateTime.now().toString(),
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
      <Stack p={2} flex={1}>
        <Stack direction="row">
          <Button>Add</Button>
          <Box flex={1} borderColor="black" borderWidth={1}></Box>
        </Stack>
        <Line data={data} options={options} />
      </Stack>
    </HStack>
  );
}
