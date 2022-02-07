import { Center, HStack, Text } from "@chakra-ui/react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from "react-chartjs-2";
import faker from 'faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export default function BatteryGraph(props) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0,
        },
        scales: {
            y: {
                min: 0,
                suggestedMax: 100
            }
        },
        plugins: {
            legend: {
                position: 'top',
            }
        },
    };

    const labels = props.data?.timestamps ?? [10,9,8,7,6,5,4,3,2,1];

    const data = {
        labels,
        datasets: [
            {
                label: 'Battery %',
                // NOTE Remove faker from package.json when actual data is put in
                data: props.data?.soc ?? labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

    return (
        <HStack h="100%" align="stretch" >
            <Text
                css={{ writingMode: "vertical-lr" }}
                transform="rotate(180deg)"
                borderLeftColor="grey.300"
                borderLeftWidth={1}
                textAlign="center"
            >
                Battery
            </Text>
            <Center flex={1}>
                <Line options={ options } data={ data } />
            </Center>
        </HStack>
    );
}
