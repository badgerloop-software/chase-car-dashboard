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
    /**
     * Takes in an array of strings pertaining to a certain type of fault (like an array of devices with temperatures
     * outside of their nominal ranges) and converts it into a formatted string listing all of the array elements as
     * they pertain to the particular type of fault
     *
     * @param strArr Array of specific troublesome devices/failsafes/whatever went wrong
     * @param singularEndStr String to follow a single issue (like " was pressed"), just to give some color to the warning
     * @param pluralEndStr String to follow multiple issues (like " were pressed"). Again, just to give some color to
     *                     the warning, but this time it's a bigger deal
     * @returns {string|*} A formatted string listing all of the specific issues/items pertaining to a fault. An empty
     *                     string is returned if this list is empty
     * @private
     */
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

    /**
     * Creates a string of all E-stops that have been triggered
     *
     * @returns {string|*} A string listing all of the E-stops that are currently triggered
     */
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

    /**
     * Checks all of the BMS failsafe statuses.
     *
     * @returns {boolean} true if any of the BMS failsafe statuses are true; false otherwise
     */
    const checkBMSFailsafes = () => {
        return (props.data?.voltage_failsafe[0]) || (props.data?.current_failsafe[0]) ||
               (props.data?.supply_power_failsafe[0]) || (props.data?.memory_failsafe[0]) ||
               (props.data?.relay_failsafe[0]);
    }

    /**
     * Creates a string of all BMS failsafes that have been triggered
     *
     * @returns {string|*} A string listing all of the BMS failsafes that are currently triggered
     */
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

    /**
     * Checks all of the temperatures against their nominal minimum and maximum values.
     *
     * @returns {boolean} true if any of the temperatures are outside or their nominal ranges; false otherwise
     */
    const checkTemps = () => {
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
               (props.data?.pack_temp[0] > CONSTANTS.pack_temp.MAX);
    }

    /**
     * A function for which more time was spent working to get a reference to the data format file in the method header
     * than was actually spent making function. In the end, I gave up on linking to the actual file, so I just linked
     * to the sc1-data-format repo on GitHub (see the link in the dataLabel parameter description). If you know how to
     * link to the file so that it opens in the IDE when you click on it in the method header, or if you know that it
     * isn't possible, DM on teams. My name is listed in the "Author" section of this method header.
     * <p>This function adds the provided uppercaseLabel/lowercaseLabel to lowArray or highArray if the value specified
     * by dataLabel is below its nominal minimum value or above its nominal maximum value, respectively. If no other
     * elements have been added to the array, uppercaseLabel is added; otherwise, lowercaseLabel is added.</p>
     *
     * @param lowArray Array of devices/items with low temperatures
     * @param highArray Same thing but with high temperatures
     * @param dataLabel Name of the specific temperature/piece of data (found in the
     *                  <a href="https://github.com/badgerloop-software/sc1-data-format/blob/main/format.json">data format</a>)
     *                  whose value is being checked
     * @param uppercaseLabel A more user-friendly label for the device/item whose temperature might be high or low.
     *                       Starts with an uppercase letter (in case this is the first item in one of the lists)
     * @param lowercaseLabel A more user-friendly label for the device/item whose temperature might be high or low.
     *                       Starts with a lowercase letter (in case this is not the first item in one of the lists)
     * @author James Vollmer
     * @private
     */
    const _updateTempArrays = (lowArray, highArray, dataLabel, uppercaseLabel, lowercaseLabel) => {
        if(props.data[dataLabel][0] > CONSTANTS[dataLabel].MAX) {
            highArray.push((highArray.length == 0) ? uppercaseLabel : lowercaseLabel);
        } else if(props.data[dataLabel][0] < CONSTANTS[dataLabel].MIN) {
            lowArray.push((lowArray.length == 0) ? uppercaseLabel : lowercaseLabel);
        }
    }

    /**
     * Creates and returns lists containing items that are overtemperature or undertemperature.
     *
     * @returns {JSX.Element} Two lines or text, each with a string listing temperature-related issues. On the top line,
     *                        there is a string listing all items with high temperatures. On the bottom line, there is
     *                        a string listing all item with low temperatures. If either list is empty, that line of
     *                        text will not be included.
     */
    const getTempString = () => {
        let highTempStrings = [];
        let lowTempStrings = [];

        _updateTempArrays(lowTempStrings, highTempStrings, "motor_temp", "Motor", "motor");
        _updateTempArrays(lowTempStrings, highTempStrings, "driverIO_temp", "Driver IO", "driver IO");
        _updateTempArrays(lowTempStrings, highTempStrings, "mainIO_temp", "Main IO", "main IO");
        _updateTempArrays(lowTempStrings, highTempStrings, "cabin_temp", "Cabin", "cabin");
        _updateTempArrays(lowTempStrings, highTempStrings, "string1_temp", "Cell string 1", "cell string 1");
        _updateTempArrays(lowTempStrings, highTempStrings, "string2_temp", "Cell string 2", "cell string 2");
        _updateTempArrays(lowTempStrings, highTempStrings, "string3_temp", "Cell string 3", "cell string 3");

        /* TODO
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
        }*/
        if(props.data?.pack_temp[0] > CONSTANTS.pack_temp.MAX) {
            highTempStrings.push((highTempStrings.length == 0) ? "Battery pack" : "battery pack");
        }

        const highTempString = _formFaultString(highTempStrings, " temp", " temps");
        const lowTempString = _formFaultString(lowTempStrings, " temp", " temps");

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
