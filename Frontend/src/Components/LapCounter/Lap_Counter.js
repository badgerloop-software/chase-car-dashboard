/*
	Lap_Counter component

	Expects backend WebSocket messages (JSON) with the following shape, sent by
	`Frontend/src/Components/LapCounter/LapCounterBackend.py` over ws://localhost:8765:

	{
		"lap_count": <number>,         // total laps detected (int)
	}

	The component will attempt to connect to ws://localhost:8765 and auto-reconnect
	on disconnect. It renders connection status, lap count, last lap, and best lap.

*/
import React, {useEffect, useState, useRef} from 'react';
import {Flex, Box, Spacer, Text, useColorMode, Circle} from "@chakra-ui/react";

export default function Lap_Counter() {
	const {colorMode} = useColorMode();
	const [connected, setConnected] = useState(false);
	const [lapCount, setLapCount] = useState(0);
	const wsRef = useRef(null);

	// Format seconds into M:SS.mmm
	function formatTime(s) {
		if (s === null || s === undefined || !isFinite(s) || s === Infinity) return "0:00.000";
		const minutes = Math.floor(s / 60);
		const seconds = s % 60;
		const secondsFixed = seconds.toFixed(3); // "SSS.mmm" or "S.mmm"
		const [secPart, ms] = secondsFixed.split('.');
		const secPartPadded = secPart.padStart(2, '0');
		return `${minutes}:${secPartPadded}.${ms}`;
	}

	useEffect(() => {
		let shouldReconnect = true;
		const connect = () => {
			try {
				const ws = new WebSocket('ws://localhost:8765');
				wsRef.current = ws;

				ws.onopen = () => {
					setConnected(true);
				};

				ws.onmessage = (evt) => {
					try {
						const data = JSON.parse(evt.data);
						if (typeof data.lap_count !== 'undefined') setLapCount(data.lap_count);
					} catch (e) {
						  console.error('LapCounter: failed to parse message', e);
					}
				};

				ws.onclose = () => {
					setConnected(false);
					if (shouldReconnect) setTimeout(connect, 3000);
				};

				ws.onerror = () => {
					// ensure socket is closed so onclose triggers reconnect
					try { ws.close(); } catch (e) {}
				};
			} catch (e) {
				// connection attempt failed — retry
				setConnected(false);
				if (shouldReconnect) setTimeout(connect, 3000);
			}
		};

		connect();

		return () => {
			shouldReconnect = false;
			if (wsRef.current) {
				try { wsRef.current.close(); } catch (e) {}
			}
		};
	}, []);

	return (
		<Box padding={4} borderRadius="md" boxShadow="sm" bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}>
			<Flex direction="column">
				<Flex align="center">
					<Text fontSize="lg" fontWeight="bold">Lap Counter</Text>
					<Spacer />
					<Flex align="center" gap={2}>
						<Circle size="10px" bg={connected ? 'green.400' : 'red.400'} />
						<Text fontSize="sm">{connected ? 'Connected' : 'Disconnected'}</Text>
					</Flex>
				</Flex>

				<Flex mt={4} direction={{base: 'column', md: 'row'}} gap={4}>
					<Box flex="1" p={3} bg={colorMode === 'light' ? 'white' : 'gray.800'} borderRadius="md">
						<Text fontSize="xs" color="gray.500">Laps</Text>
						<Text fontSize="3xl" fontWeight="semibold">{lapCount}</Text>
					</Box>
				</Flex>
			</Flex>
		</Box>
	);
}
