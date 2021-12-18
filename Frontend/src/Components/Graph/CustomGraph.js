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

function generateData(data) {
    let datasets = [];
    const labels = data?.timestamps ?? [10,9,8,7,6,5,4,3,2,1];
    let i=0;

    // Add all datasets
    for(const key in data) {
        // Don't add timestamps as a dataset
        if(key !== "timestamps") {
            datasets.push(
                {
                    label: key,
                    // NOTE Remove faker from package.json when actual data is put in
                    data: data[key] ?? labels.map(() => faker.datatype.number({min: 0, max: 100})),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            );
        }
    }

    return {
        labels,
        datasets,
    };
}

export default function CustomGraph(props) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0,
        },
        scales: {
            y: {
                suggestedMin: 0,
                suggestedMax: 50
            }
        },
        plugins: {
            legend: {
                position: 'left',
            },
            title: {
                display: true,
                text: 'Custom Chart',
            },
        },
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
                Custom
            </Text>
            <Center flex={1}>
                <Line options={ options } data={ generateData(props.data) } />
            </Center>
        </HStack>
    );
}
