import { useEffect, useState } from "react";
import { Select, Flex, useInterval } from "@chakra-ui/react";

export default function SerialSelector() {
    const [allDevices, setAllDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(""); // State to hold the selected device name
    const [selectedBaud, setSelectedBaud] = useState(115200);

    const refresh = () => {
        fetch('/serial-info')
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Error fetching serial port with code ${response.status}`);
            }
        })
        .then((body) => {
            setSelectedDevice(body['connected_device']['device']); // Set default device
            setSelectedBaud(body['connected_device']['baud']);
            setAllDevices(body['all_devices']);
        }).catch(error => console.error('Fetch error:', error));
    };

    useInterval(refresh, 3000);

    useEffect(()=> {
        fetch("/connect-device", {
            method: "POST",
            body: JSON.stringify({
                device: selectedDevice,
                baud: selectedBaud
            }),
            headers: {
                "Content-type": "application/json"
            }
        });

    }, [selectedBaud, selectedDevice])

    const getSerialPort = () => {
        return (
            <Select
                placeholder='Select option'
                width={'30%'}
                padding={2}
                value={selectedDevice} // Controlled component with selectedDevice as the current value
                onChange={e => setSelectedDevice(e.target.value)} // Handler to update state on user selection
            >
                {allDevices.map(device => (
                    <option key={device} value={device}>{device}</option>
                ))}
            </Select>
        );
    };

    const getBaud = () => {
        const defaultBaud = [4800, 9600, 14400, 19200, 38400, 57600, 115200, 128000, 256000];
        return (
            <Select
                width={'30%'}
                padding={2}
                value={selectedBaud}
                onChange={e => setSelectedBaud(e.target.value)}
            >
                {defaultBaud.map(baud => (
                    <option key={baud} value={baud}>{baud}</option>
                ))}
            </Select>
        )
    }

    return (
        <Flex flex="auto" direction="row" alignItems="center" justifyContent="center">
            <p>Serial Device:</p>
            {getSerialPort()}
            <p>Baud:</p>
            {getBaud()}
        </Flex>
    );
}
