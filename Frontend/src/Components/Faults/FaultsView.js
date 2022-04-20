import { Box, Tooltip, Image, SimpleGrid } from "@chakra-ui/react";
import MPPTContactorImage from "./Images/MPPT Contactor.png";
import LowContactorImage from "./Images/Low Contactor.png";
import MotorControllerContactorImage from "./Images/Motor Controller Contactor.png";
import DoorImage from "./Images/Door.png";
import BatteryFailsafeImage from "./Images/Battery Failsafe.png";
import BPSFaultImage from "./Images/BPS Fault.png";
import EStopImage from "./Images/E-Stop.png";
import IMDStatusImage from "./Images/IMD Status.png";
import CrashImage from "./Images/Crash.png";
import HighCurrentImage from "./Images/High Current.png";
import HighVoltageImage from "./Images/High Voltage.png";
import LowCurrentImage from "./Images/Low Current.png";
import LowVoltageImage from "./Images/Low Voltage.png";
import LowBatteryImage from "./Images/Low Battery.png";
import MCUCheckImage from "./Images/MCU Check.png";
import MPPTCurrentImage from "./Images/MPPT Current.png";
import BMSInputVoltageImage from "./Images/BMS Input Voltage.png";
import PhysicalConnectionImage from "./Images/Physical Connection Lost.png";
import WirelessCommsLostImage from "./Images/Wireless Comms Lost.png";
import HighTemperatureImage from "./Images/High Temperature.png";
import CONSTANTS from "../../data-constants.json";

export default function Faults(props) {

    const _formFaultString = (strArr, singularEndStr, pluralEndStr) => {
        if(strArr.length > 0) {
            if(strArr.length > 2) {
                return strArr[0] + ", " + strArr[1].toLowerCase() + ", and " + strArr[2].toLowerCase() + pluralEndStr;
            } else if(strArr.length > 1) {
                return strArr[0] + " and " + strArr[1].toLowerCase() + pluralEndStr;
            } else {
                return strArr[0] + singularEndStr;
            }
        }
        return "";
    }

    const getEStopString = () => {
        let eStopStrings = [];

        if(props.data?.battery_eStop[0] != CONSTANTS.battery_eStop.MIN) {
            eStopStrings.push("Battery");
        }
        if(props.data?.driver_eStop[0] != CONSTANTS.driver_eStop.MIN) {
            eStopStrings.push("Driver");
        }
        if(props.data?.external_eStop[0] != CONSTANTS.external_eStop.MIN) {
            eStopStrings.push("External");
        }

        return _formFaultString(eStopStrings, " E-stop was pressed", " E-stops were pressed");
    }

    const checkBMSFailsafes = () => {
        return (props.data?.voltage_failsafe[0]) || (props.data?.current_failsafe[0]) ||
               (props.data?.supply_power_failsafe[0]) || (props.data?.memory_failsafe[0]) ||
               (props.data?.relay_failsafe[0]);
    }

    const getBMSFailsafeString = () => {
        let failsafeStrings = [];

        if(props.data?.voltage_failsafe[0]) {
            failsafeStrings.push("Voltage");
        }
        if(props.data?.current_failsafe[0]) {
            failsafeStrings.push("Current");
        }
        if(props.data?.supply_power_failsafe[0]) {
            failsafeStrings.push("Supply");
        }
        if(props.data?.memory_failsafe[0]) {
            failsafeStrings.push("Memory");
        }
        if(props.data?.relay_failsafe[0]) {
            failsafeStrings.push("Relay");
        }

        return _formFaultString(failsafeStrings, " fialsafe", " failsafes");
    }

    const checkTemps = () => {
        // TODO Go back through these and see which ones are only concerned with max temperatures (e.g. pack temp is only concerned about temp>60)
        return (props.data?.motor_temp[0] > CONSTANTS.motor_temp.MAX) ||
               (props.data?.motor_temp[0] < CONSTANTS.motor_temp.MIN) ||
               (props.data?.driverIO_temp[0] > CONSTANTS.driverIO_temp.MAX) ||
               (props.data?.driverIO_temp[0] < CONSTANTS.driverIO_temp.MIN) ||
               (props.data?.mainIO_temp[0] > CONSTANTS.mainIO_temp.MAX) ||
               (props.data?.mainIO_temp[0] < CONSTANTS.mainIO_temp.MIN) ||
               (props.data?.cabin_temp[0] > CONSTANTS.cabin_temp.MAX) ||
               (props.data?.cabin_temp[0] < CONSTANTS.cabin_temp.MIN) ||
               (props.data?.string1_temp[0] > CONSTANTS.string1_temp.MAX) ||
               (props.data?.string1_temp[0] < CONSTANTS.string1_temp.MIN) ||
               (props.data?.string2_temp[0] > CONSTANTS.string2_temp.MAX) ||
               (props.data?.string2_temp[0] < CONSTANTS.string2_temp.MIN) ||
               (props.data?.string3_temp[0] > CONSTANTS.string3_temp.MAX) ||
               (props.data?.string3_temp[0] < CONSTANTS.string3_temp.MIN) ||
               (props.data?.pack_temp[0] > CONSTANTS.pack_temp.MAX) ||
               (props.data?.pack_temp[0] < CONSTANTS.pack_temp.MIN);
    }

    const getTempString = () => {
        let highTempStrings = [];
        let lowTempStrings = [];

        // TODO A lot of repetitive stuff. See if I can just loop through these
        //      I could probably make a private function and pass the data, min, max, uppercase string, and lowercase string
        // TODO Go back through these and see which ones are only concerned with max temperatures (e.g. pack temp is only concerned about temp>60)
        if(props.data?.motor_temp[0] > CONSTANTS.motor_temp.MAX) {
            highTempStrings.push("Motor");
        } else if(props.data?.motor_temp[0] < CONSTANTS.motor_temp.MIN) {
            lowTempStrings.push("Motor");
        }
        if(props.data?.driverIO_temp[0] > CONSTANTS.driverIO_temp.MAX) {
            highTempStrings.push((highTempStrings.length == 0) ? "Driver IO" : "driver IO");
        } else if(props.data?.driverIO_temp[0] < CONSTANTS.driverIO_temp.MIN) {
            lowTempStrings.push((lowTempStrings.length == 0) ? "Driver IO" : "driver IO");
        }
        if(props.data?.mainIO_temp[0] > CONSTANTS.mainIO_temp.MAX) {
            highTempStrings.push((highTempStrings.length == 0) ? "Main IO" : "main IO");
        } else if(props.data?.mainIO_temp[0] < CONSTANTS.mainIO_temp.MIN) {
            lowTempStrings.push((lowTempStrings.length == 0) ? "Main IO" : "main IO");
        }
        if(props.data?.cabin_temp[0] > CONSTANTS.cabin_temp.MAX) {
            highTempStrings.push((highTempStrings.length == 0) ? "Cabin" : "cabin");
        } else if(props.data?.cabin_temp[0] < CONSTANTS.cabin_temp.MIN) {
            lowTempStrings.push((lowTempStrings.length == 0) ? "Cabin" : "cabin");
        }
        if(props.data?.string1_temp[0] > CONSTANTS.string1_temp.MAX) {
            highTempStrings.push((highTempStrings.length == 0) ? "Cell string 1" : "cell string 1");
        } else if(props.data?.string1_temp[0] < CONSTANTS.string1_temp.MIN) {
            lowTempStrings.push((lowTempStrings.length == 0) ? "Cell string 1" : "cell string 1");
        }
        if(props.data?.string2_temp[0] > CONSTANTS.string2_temp.MAX) {
            highTempStrings.push((highTempStrings.length == 0) ? "Cell string 2" : "cell string 2");
        } else if(props.data?.string2_temp[0] < CONSTANTS.string2_temp.MIN) {
            lowTempStrings.push((lowTempStrings.length == 0) ? "Cell string 2" : "cell string 2");
        }
        if(props.data?.string3_temp[0] > CONSTANTS.string3_temp.MAX) {
            highTempStrings.push((highTempStrings.length == 0) ? "Cell string 3" : "cell string 3");
        } else if(props.data?.string3_temp[0] < CONSTANTS.string3_temp.MIN) {
            lowTempStrings.push((lowTempStrings.length == 0) ? "Cell string 3" : "cell string 3");
        }
        if(props.data?.pack_temp[0] > CONSTANTS.pack_temp.MAX) {
            highTempStrings.push((highTempStrings.length == 0) ? "Battery pack" : "battery pack");
        }

        let highTempString = "";
        let lowTempString = "";

        highTempString = _formFaultString(highTempStrings, " temp", " temps");
        lowTempString = _formFaultString(lowTempStrings, " temp", " temps");

        return <>
                {(highTempString != "") ? <>High: {highTempString}<br/></> : ""}
                {(lowTempString != "") ? "Low: " + lowTempString : ""}
            </>;
    }

  return (
      <SimpleGrid
          columns={6}
          rows={3}
          spacingX="2vw"
          spacingY="0.5vh"
          alignItems="center"
      >
          {!(props.data?.mppt_contactor[0] ?? true) ?
              <Tooltip label={"MPPT contactor is open"} >
                  <Image src={MPPTContactorImage}/>
              </Tooltip>
              :
              <Box h="70px" />
          }
          {!(props.data?.low_contactor[0] ?? true) ?
              <Tooltip label={"Low contactor is open"} >
                   <Image src={LowContactorImage}/>
              </Tooltip>
              :
              <Box h="70px" />
          }
          {!(props.data?.motor_controller_contactor[0] ?? true) ?
              <Tooltip label={"Motor controller contactor is open"} >
                  <Image src={MotorControllerContactorImage}/>
              </Tooltip>
              :
              <Box h="70px" />
          }
          {(props.data?.battery_eStop[0] || props.data?.driver_eStop[0] || props.data?.external_eStop[0]) ?
              <Tooltip label={getEStopString()} >
                  <Image src={EStopImage}/>
              </Tooltip>
              :
              <Box h="70px" />
          }
          {!(props.data?.door[0] ?? true) ?
              <Tooltip label={"Door is open"} >
                  <Image src={DoorImage}/>
              </Tooltip>
              :
              <Box h="70px" />
          }
          {props.data?.crash[0] ?
              <Tooltip label={"Solar car has crashed"} >
                  <Image src={CrashImage}/>
              </Tooltip>
              :
              <Box h="70px" />
          }
          {props.data?.mcu_check[0] ?
              <Tooltip label={"MCU check failed"} >
                  <Image src={MCUCheckImage}/>
              </Tooltip>
              :
              <Box h="70px" />
          }
          {props.data?.imd_status[0] ?
              <Tooltip label={"IMD status (battery isolation) fault"} >
                  <Image src={IMDStatusImage}/>
              </Tooltip>
              :
              <Box h="70px" />
          }
          {checkBMSFailsafes() ?
              <Tooltip label={getBMSFailsafeString()} >
                  <Image src={BatteryFailsafeImage}/>
              </Tooltip>
              :
              <Box h="70px" />
          }
          {props.data?.bps_fault[0] ?
              <Tooltip label={"BPS fault"} >
                   <Image src={BPSFaultImage}/>
              </Tooltip>
              :
              <Box h="70px" />
          }
          {(props.data?.soc[0] < (CONSTANTS.soc.MIN + 5)) ? // TODO Do I want to just change the minimum of soc to 5 and not use addition here????
              <Tooltip label={"Battery charge is low (<5%)"} >
                  <Image src={LowBatteryImage}/>
              </Tooltip>
              :
              <Box h="70px" />
          }
          {(props.data?.mppt_current_out[0] > CONSTANTS.mppt_current_out.MAX) ?
              <Tooltip label={"High MPPT current"} >
                  <Image src={MPPTCurrentImage}/>
              </Tooltip>
              :
              (props.data?.mppt_current_out[0] < CONSTANTS.mppt_current_out.MIN) ?
                  <Tooltip label={"MPPT current is negative"} >
                      <Image src={MPPTCurrentImage}/>
                  </Tooltip>
                  :
                  <Box h="70px" />
          }
          {(props.data?.pack_current[0] > CONSTANTS.pack_current.MAX) ?
              <Tooltip label={"High battery pack current"} >
                  <Image src={HighCurrentImage}/>
              </Tooltip>
              :
              (props.data?.pack_current[0] < CONSTANTS.pack_current.MIN) ?
                  <Tooltip label={"Low battery pack current"} >
                      <Image src={LowCurrentImage}/>
                  </Tooltip>
                  :
                  <Box h="70px" />
          }
          {(props.data?.pack_voltage[0] > CONSTANTS.pack_voltage.MAX) ?
              <Tooltip label={"High battery pack voltage"} >
                  <Image src={HighVoltageImage}/>
              </Tooltip>
              :
              (props.data?.pack_voltage[0] < CONSTANTS.pack_voltage.MIN) ?
                  <Tooltip label={"Low battery pack voltage"} >
                      <Image src={LowVoltageImage}/>
                  </Tooltip>
                  :
                  <Box h="70px" />
          }
          {!(props.data?.solar_car_connection[0] ?? false) ?
              <Tooltip label={"Lost communication with the solar car"} >
                  <Image src={WirelessCommsLostImage} />
              </Tooltip>
              :
              <Box h="70px" />
          }
          {props.data?.bms_canbus_failure[0] ? // TODO
              !props.data?.mainIO_heartbeat[0] ?
                  <Tooltip label={"BMS CANBUS failure and Driver IO/Main IO connection lost"} >
                      <Image src={PhysicalConnectionImage}/>
                  </Tooltip>
                  :
                  <Tooltip label={"BMS CANBUS failure"} >
                      <Image src={PhysicalConnectionImage}/>
                  </Tooltip>
              :
              !(props.data?.mainIO_heartbeat[0] ?? true) ? // TODO
                  <Tooltip label={"Driver IO/Main IO connection lost"} >
                      <Image src={PhysicalConnectionImage}/>
                  </Tooltip>
                  :
                  <Box h="70px" />
          }
          {(props.data?.bms_input_voltage[0] > CONSTANTS.bms_input_voltage.MAX) ?
              <Tooltip label={"High BMS input voltage"} >
                  <Image src={BMSInputVoltageImage}/>
              </Tooltip>
              :
              (props.data?.bms_input_voltage[0] < CONSTANTS.bms_input_voltage.MIN) ?
                  <Tooltip label={"Low BMS input voltage"} >
                      <Image src={BMSInputVoltageImage}/>
                  </Tooltip>
                  :
                  <Box h="70px" />
          }
          {checkTemps() ?
              <Tooltip label={getTempString()} shouldWrapChildren size={"5"} >
                  <Image src={HighTemperatureImage}/>
              </Tooltip>
              :
              <Box h="70px" />
          }
      </SimpleGrid>
  );
}
