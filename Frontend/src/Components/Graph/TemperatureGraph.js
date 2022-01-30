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

export default function TemperatureGraph(props) {
    const plugin = [{
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    }];

    const gridColorStr = 'rgba(100,100,100,1)'; // TODO

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0,
        },
        scales: {
            y: {
                ticks: {
                    color: '#FFFFFF',
                },
                grid: {
                    color: gridColorStr,
                    borderColor: gridColorStr,
                    borderWidth: 2,
                },
                suggestedMin: 0,
                suggestedMax: 50
            },
            x: {
                ticks: {
                    color: '#FFFFFF',
                },
                grid: {
                    color: gridColorStr,
                    borderColor: gridColorStr,
                    borderWidth: 2,
                },
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#FFFFFF',
                },
                position: 'top',
            }
        },
    };

    const labels = props.data?.timestamps ?? [10,9,8,7,6,5,4,3,2,1];

    const data = {
        labels,
        datasets: [
            {
                label: 'Battery',
                // NOTE Remove faker from package.json when actual data is put in
                data: props.data?.batteryTemp ?? labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Motor',
                data: props.data?.motorTemp ?? labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Motor Controller',
                data: props.data?.motorControllerTemp ?? labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                borderColor: 'rgb(255, 210, 100)',
                backgroundColor: 'rgba(255, 210, 100, 0.5)',
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
                Temperature
            </Text>
            <Center flex={1}>
                <Line options={ options } data={ data } plugins={ plugin } />
            </Center>
        </HStack>
    );
}
