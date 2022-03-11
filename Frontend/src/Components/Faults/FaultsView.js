import { HStack, Text, VStack, Box, Tooltip } from "@chakra-ui/react";
import { FaBatteryQuarter, FaTemperatureHigh, FaGasPump, FaMapMarkedAlt } from "react-icons/fa"
import { BsLightningChargeFill, BsFillExclamationTriangleFill, BsWifiOff } from "react-icons/bs"
import { GiCarSeat, GiFlatTire } from "react-icons/gi"
import { MdHighlight } from "react-icons/md"



const stateTester = true

export default function Faults(props) {
  return (
    <VStack>
      <HStack>
        <Tooltip label="Battery charge is very low, under xx%" >
          {stateTester ? 
            <Box as={FaBatteryQuarter} size="24px" color="black.400" /> : <Text></Text>}
        </Tooltip> 
        <Tooltip label="Battery temperature is very high" >
          {stateTester ? 
            <Box as={FaTemperatureHigh} size="24px" color="black.400" /> : <Text></Text>}
        </Tooltip> 
        <Tooltip label="Car has few miles left, needs to be charged" >
          {stateTester ? 
            <Box as={FaGasPump} size="24px" color="black.400" /> : <Text></Text>}
        </Tooltip> 
        <Tooltip label="Not connected to navigation services" >
          {stateTester ? 
            <Box as={FaMapMarkedAlt} size="24px" color="black.400" /> : <Text></Text>}
        </Tooltip> 
      </HStack>
      <HStack>
        <Tooltip label="Batteries are not getting power, net charge is below zero" >
          {stateTester ? 
            <Box as={BsLightningChargeFill} size="24px" color="black.400" /> : <Text></Text>}
        </Tooltip> 
        <Tooltip label="Motors are at a high temperature" >
          {stateTester ? 
            <Box as={FaTemperatureHigh} size="24px" color="black.400" /> : <Text></Text>}
        </Tooltip> 
        <Tooltip label="Emergency lights are currently on" >
          {stateTester ? 
            <Box as={BsFillExclamationTriangleFill} size="24px" color="black.400" /> : <Text></Text>}
        </Tooltip> 
        <Tooltip label="No connection to internet" >
          {stateTester ? 
            <Box as={BsWifiOff} size="24px" color="black.400" /> : <Text></Text>}
        </Tooltip> 
      </HStack>
      <HStack>
        <Tooltip label="Driver does not have seatbelt on" >
          {stateTester ? 
            <Box as={GiCarSeat} size="24px" color="black.400" /> : <Text></Text>}
        </Tooltip> 
        <Tooltip label="Motor controller temperature is high" >
          {stateTester ? 
            <Box as={FaTemperatureHigh} size="24px" color="black.400" /> : <Text></Text>}
        </Tooltip> 
        <Tooltip label="Tire pressure is under the normal psi for either one or more tires" >
          {stateTester ? 
            <Box as={GiFlatTire} size="24px" color="black.400" /> : <Text></Text>}
        </Tooltip> 
        <Tooltip label="Headlights are currently on" >
          {stateTester ? 
            <Box as={MdHighlight} size="24px" color="black.400" /> : <Text></Text>}
        </Tooltip> 
      </HStack>
    </VStack>
    
    
  );
}
