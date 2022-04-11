import { Box, Tooltip, Image, SimpleGrid } from "@chakra-ui/react";
import MPPTContactorImage from "./MPPT Contactor.png";
import LowContactorImage from "./Low Contactor.png";
import MotorControllerContactorImage from "./Motor Controller Contactor.png";
import DoorImage from "./Door.png";
import BatteryFailsafeImage from "./Battery Failsafe.png";
import BPSFaultImage from "./BPS Fault.png";
import EStopImage from "./E-Stop.png";
import IMDStatusImage from "./IMD Status.png";
import CrashImage from "./Crash.png";
import HighCurrentImage from "./High Current.png";
import HighVoltageImage from "./High Voltage.png";
import HighVoltageCurrentImage from "./High Voltage Current.png";
import LowCurrentImage from "./Low Current.png";
import LowVoltageImage from "./Low Voltage.png";
import LowVoltageCurrentImage from "./Low Voltage Current.png";
import LowBatteryImage from "./Low Battery.png";
import MCUCheckImage from "./MCU Check.png";
import MPPTCurrentImage from "./MPPT Current.png";
import PowerWarningImage from "./Power Warning.png";
import BMSInputVoltageImage from "./BMS Input Voltage.png";
import PhysicalConnectionImage from "./Physical Connection Lost.png";
import WirelessCommsLostImage from "./Wireless Comms Lost.png";
import HighTemperatureImage from "./High Temperature.png";

export default function Faults(props) {
    const getEStopString = () => {
        let eStopStrings = [];

        if(props.data?.battery_eStop[0]) {
            eStopStrings.push("Battery");
        }
        if(props.data?.driver_eStop[0]) {
            eStopStrings.push("Driver");
        }
        if(props.data?.external_eStop[0]) {
            eStopStrings.push("External");
        }

        if(eStopStrings.length > 0) {
            if(eStopStrings.length > 2) {
                return eStopStrings[0] + ", " + eStopStrings[1].toLowerCase() + ", and " + eStopStrings[2].toLowerCase() + " E-stops were pressed";
            } else if(eStopStrings.length > 1) {
                return eStopStrings[0] + " and " + eStopStrings[1].toLowerCase() + " E-stops were pressed";
            } else {
                return eStopStrings[0] + " E-stop was pressed";
            }
        }
        return "";
    }

    const checkBMSFailsafes = () => {
        return (props.data?.voltage_failsafe[0]) || (props.data?.current_failsafe[0]) ||
               (props.data?.supply_power_failsafe[0]) || (props.data?.memory_failsafe[0]) ||
               (props.data?.relay_failsafe[0]);
    }

    const getBMSFailsafeString = () => {
        let failsafeStrings = []; // TODO Rename

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

        if(failsafeStrings.length > 0) {
            if(failsafeStrings.length > 2) {
                return failsafeStrings[0] + ", " + failsafeStrings[1].toLowerCase() + ", and " + failsafeStrings[2].toLowerCase() + " failsafes";
            } else if(failsafeStrings.length > 1) {
                return failsafeStrings[0] + " and " + failsafeStrings[1].toLowerCase() + " failsafes";
            } else {
                return failsafeStrings[0] + " failsafe";
            }
        }
        return "";
    }

    const checkTemps = () => {
        return (props.data?.motor_temp[0] > 100) || (props.data?.driverIO_temp[0] > 100) ||
               (props.data?.mainIO_temp[0] > 100) || (props.data?.cabin_temp[0] > 100) ||
               (props.data?.string1_temp[0] > 50) || (props.data?.string1_temp[0] < 20) ||
               (props.data?.string2_temp[0] > 50) || (props.data?.string2_temp[0] < 20) ||
               (props.data?.string3_temp[0] > 50) || (props.data?.string3_temp[0] < 20) ||
               (props.data?.pack_temp[0] > 60);
    }

    const getTempString = () => {
        let highTempStrings = [];
        let lowTempStrings = [];

        if(props.data?.motor_temp[0] > 100) {
            highTempStrings.push("Motor");
        }
        if(props.data?.driverIO_temp[0] > 100) {
            highTempStrings.push((highTempStrings.length == 0) ? "Driver IO" : "driver IO");
        }
        if(props.data?.mainIO_temp[0] > 100) {
            highTempStrings.push((highTempStrings.length == 0) ? "Main IO" : "main IO");
        }
        if(props.data?.cabin_temp[0] > 100) {
            highTempStrings.push((highTempStrings.length == 0) ? "Cabin" : "cabin");
        }
        if(props.data?.string1_temp[0] > 50) {
            highTempStrings.push((highTempStrings.length == 0) ? "Cell string 1" : "cell string 1");
        } else if(props.data?.string1_temp[0] < 20) {
            lowTempStrings.push("Cell string 1");
        }
        if(props.data?.string2_temp[0] > 50) {
            highTempStrings.push((highTempStrings.length == 0) ? "Cell string 2" : "cell string 2");
        } else if(props.data?.string2_temp[0] < 20) {
            lowTempStrings.push((lowTempStrings.length == 0) ? "Cell string 2" : "cell string 2");
        }
        if(props.data?.string3_temp[0] > 50) {
            highTempStrings.push((highTempStrings.length == 0) ? "Cell string 3" : "cell string 3");
        } else if(props.data?.string3_temp[0] < 20) {
            lowTempStrings.push((lowTempStrings.length == 0) ? "Cell string 3" : "cell string 3");
        }
        if(props.data?.pack_temp[0] > 60) {
            highTempStrings.push((highTempStrings.length == 0) ? "Battery pack" : "battery pack");
        }

        let highTempString = "";
        let lowTempString = "";

        if(highTempStrings.length > 0) {
            if(highTempStrings.length == 1) {
                highTempString = highTempStrings[0] + " temp is high";
            } else if(highTempStrings.length == 2) {
                highTempString = highTempStrings[0] + " and " + highTempStrings[1] + " temps are high";
            } else {
                highTempString = highTempStrings[0];
                for(let i=1; i < highTempStrings.length - 1; i++) {
                    highTempString += ", " + highTempStrings[i];
                }
                highTempString += ", and " + highTempStrings[highTempStrings.length - 1] + " temps are high";
            }
        }
        if(lowTempStrings.length > 0) {
            if(highTempStrings.length > 0) {
                lowTempString = ". ";
            }

            if(lowTempStrings.length == 1) {
                lowTempString += lowTempStrings[0] + " temp is low";
            } else if(lowTempStrings.length == 2) {
                lowTempString += lowTempStrings[0] + " and " + lowTempStrings[1] + " temps are low";
            } else {
                lowTempString += lowTempStrings[0];
                for(let i=1; i < lowTempStrings.length - 1; i++) {
                    lowTempString += ", " + lowTempStrings[i];
                }
                lowTempString += ", and " + lowTempStrings[lowTempStrings.length - 1] + " temps are low";
            }
        }

        return highTempString + lowTempString;
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
              <Box></Box>
          }
          {!(props.data?.low_contactor[0] ?? true) ?
              <Tooltip label={"Low contactor is open"} >
                   <Image src={LowContactorImage}/>
              </Tooltip>
              :
              <Box></Box>
          }
          {!(props.data?.motor_controller_contactor[0] ?? true) ?
              <Tooltip label={"Motor controller contactor is open"} >
                  <Image src={MotorControllerContactorImage}/>
              </Tooltip>
              :
              <Box></Box>
          }
          {(props.data?.battery_eStop[0] || props.data?.driver_eStop[0] || props.data?.external_eStop[0]) ?
              <Tooltip label={getEStopString()} >
                  <Image src={EStopImage}/>
              </Tooltip>
              :
              <Box></Box>
          }
          {!(props.data?.door[0] ?? true) ?
              <Tooltip label={"Door is open"} >
                  <Image src={DoorImage}/>
              </Tooltip>
              :
              <Box></Box>
          }
          {props.data?.crash[0] ?
              <Tooltip label={"Solar car has crashed"} >
                  <Image src={CrashImage}/>
              </Tooltip>
              :
              <Box></Box>
          }
          {props.data?.mcu_check[0] ?
              <Tooltip label={"MCU check failed"} >
                  <Image src={MCUCheckImage}/>
              </Tooltip>
              :
              <Box></Box>
          }
          {props.data?.imd_status[0] ?
              <Tooltip label={"IMD status (battery isolation) fault"} >
                  <Image src={IMDStatusImage}/>
              </Tooltip>
              :
              <Box></Box>
          }
          {checkBMSFailsafes() ?
              <Tooltip label={getBMSFailsafeString()} >
                  <Image src={BatteryFailsafeImage}/>
              </Tooltip>
              :
              <Box></Box>
          }
          {props.data?.bps_fault[0] ?
              <Tooltip label={"BPS fault"} >
                   <Image src={BPSFaultImage}/>
              </Tooltip>
              :
              <Box></Box>
          }
          {/*<Tooltip label={"Power warnings"} >
              {true ? <Image src={PowerWarningImage}/> : <Box></Box>}
          </Tooltip>*/}
          {(props.data?.soc[0] < 5) ?
              <Tooltip label={"Battery charge is low (<5%)"} >
                  <Image src={LowBatteryImage}/>
              </Tooltip>
              :
              <Box></Box>
          }
          {(props.data?.mppt_current_out[0] > 7) ?
              <Tooltip label={"High MPPT current"} >
                  <Image src={MPPTCurrentImage}/>
              </Tooltip>
              :
              (props.data?.mppt_current_out[0] < 0) ?
                  <Tooltip label={"MPPT current is negative"} >
                      <Image src={MPPTCurrentImage}/>
                  </Tooltip>
                  :
                  <Box></Box>
          }
          {(props.data?.pack_current[0] > 75) ?
              <Tooltip label={"High battery pack current"} >
                  <Image src={HighCurrentImage}/>
              </Tooltip>
              :
              (props.data?.pack_current[0] < 25) ?
                  <Tooltip label={"Low battery pack current"} >
                      <Image src={LowCurrentImage}/>
                  </Tooltip>
                  :
                  <Box></Box>
          }
          {(props.data?.pack_voltage[0] > 108) ?
              <Tooltip label={"High battery pack voltage"} >
                  <Image src={HighVoltageImage}/>
              </Tooltip>
              :
              (props.data?.pack_voltage[0] < 69) ?
                  <Tooltip label={"Low battery pack voltage"} >
                      <Image src={LowVoltageImage}/>
                  </Tooltip>
                  :
                  <Box></Box>
          }
          {true ? // TODO Use packet delays to determine if there is a wireless comms issue
              <Tooltip label={"Lost communication with the solar car"} >
                  <Image src={WirelessCommsLostImage} />
              </Tooltip>
              :
              <Box></Box>
          }
          {props.data?.bms_canbus_failure[0] ?
              !(props.data?.mainIO_heartbeat[0] ?? true) ?
                  <Tooltip label={"BMS CANBUS failure and Driver IO/Main IO connection lost"} >
                      <Image src={PhysicalConnectionImage}/>
                  </Tooltip>
                  :
                  <Tooltip label={"BMS CANBUS failure"} >
                      <Image src={PhysicalConnectionImage}/>
                  </Tooltip>
              :
              !(props.data?.mainIO_heartbeat[0] ?? true) ?
                  <Tooltip label={"Driver IO/Main IO connection lost"} >
                      <Image src={PhysicalConnectionImage}/>
                  </Tooltip>
                  :
                  <Box></Box>
          }
          {(props.data?.bms_input_voltage[0] > 24) ?
              <Tooltip label={"High BMS input voltage"} >
                  <Image src={BMSInputVoltageImage}/>
              </Tooltip>
              :
              (props.data?.bms_input_voltage[0] < 12) ?
                  <Tooltip label={"Low BMS input voltage"} >
                      <Image src={BMSInputVoltageImage}/>
                  </Tooltip>
                  :
                  <Box></Box>
          }
          {checkTemps() ?
              <Tooltip label={getTempString()} >
                  <Image src={HighTemperatureImage}/>
              </Tooltip>
              :
              <Box></Box>
          }
      </SimpleGrid>
  );
}
