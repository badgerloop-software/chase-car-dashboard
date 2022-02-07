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

export default function PowerGraph(props) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0,
        },
        scales: {
            y: {
                min: 0,
                suggestedMax: 50
            }
        },
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    const labels = props.data?.timestamps ?? [10,9,8,7,6,5,4,3,2,1];

    const data = {
        labels,
        datasets: [
            {
                label: 'Net Power',
                // NOTE Remove faker from package.json when actual data is put in
                // Multiplying each voltage in the array by its corresponding current to get array of net power values
                data: props.data?.pack_voltage.map((voltage, idx) => { return (voltage * props.data?.pack_current[idx]) })
                      ??
                      labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
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
                // NOTE Remove faker from package.json when actual data is put in
                // Multiplying each voltage in array by its corresponding MPPT current to get array of solar power values
                data: props.data?.pack_voltage.map((voltage, idx) => { return (voltage * props.data?.mppt_current_out[idx]) })
                      ??
                      labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                fill: false,
                borderColor: 'rgb(64, 255, 64)',
                backgroundColor: 'rgba(64, 255, 64, 0.5)',
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
                <Line options={ options } data={ data } />
            </Center>
        </HStack>
    );
}
