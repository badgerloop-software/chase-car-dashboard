import { Center, HStack, Text } from "@chakra-ui/react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
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
    Title,
    Tooltip,
    Legend
);

export default function PowerGraph(props) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0,
        },
        plugins: {
            legend: {
                position: 'left',
            },
            title: {
                display: true,
                text: 'Power Chart',
            }
        },
    };

    const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const data = {
        labels,
        datasets: [
            {
                label: 'Net Power',
                // NOTE Remove faker from package.json when actual data is put in
                data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                fill: {
                    above: 'rgba(255, 64, 64, 0.25)',
                    below: 'rgba(64, 255, 64, 0.25)',
                    target:'+1'
                },
                borderColor: 'rgb(255, 64, 64)',
                backgroundColor: 'rgba(255, 64, 64, 0.5)',
            },
            {
                label: 'Solar Power',
                data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                fill: false,
                borderColor: 'rgb(64, 255, 64)',
                backgroundColor: 'rgba(64, 255, 64, 0.5)',
            },
            {
                label: 'Motor Power',
                data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                fill: false,
                borderColor: 'rgb(127, 127, 127)',
                backgroundColor: 'rgba(127, 127, 127, 0.5)',
            },
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
                Power
            </Text>
            <Center flex={1}>
                <Line options={ options} data={ data } />
            </Center>
        </HStack>
    );
}
