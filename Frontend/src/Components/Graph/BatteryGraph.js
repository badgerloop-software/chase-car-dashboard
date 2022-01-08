import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [0, 1, 2, 3, 4, 5, 6],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: [13, 12, 11, null, 9, 8, 7],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export default function BatteryGraph(props) {
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
