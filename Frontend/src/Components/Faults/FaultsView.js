import {Box, Tooltip, Image, SimpleGrid, Center, useColorMode} from "@chakra-ui/react";
import { FaultsViewImages } from "./Images/Images";
import CONSTANTS from "../../data-constants.json";

export default function Faults(props) {
  const fitType = "scale-down";
  const imageHeight = "5vh";

  const { colorMode } = useColorMode();

  // Get set of images for light mode or dark mode
  const Images = FaultsViewImages[`${colorMode}`];

  /**
   * Checks the boolean value specified by dataLabel against its nominal value. Returns true if the boolean value
   * indicates a fault (i.e. if the value is not equal to its nominal value).
   *
   * @param dataLabel Name of the specific boolean/piece of data (found in the
   *                  <a href="https://github.com/badgerloop-software/sc1-data-format/blob/main/format.json">data
   *                  format</a>) whose value is being checked
   * @returns {boolean} true if the specified boolean value is NOT equal to its nominal value; false otherwise
   * @private
   */
  const _checkBooleanData = (dataLabel) => {
    return (
      (props.data?.[dataLabel][0] ?? CONSTANTS[dataLabel].MIN) !=
      CONSTANTS[dataLabel].MIN
    );
  };

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
    // Check if the list of specific faults/items is empty. If so, return an empty string
    if (strArr.length === 0) return "";

    // There is at least one item in the list. Format the list according to the number of items
    if (strArr.length === 1) {
      // There is only 1 item in the list
      return strArr[0] + singularEndStr;
    } else if (strArr.length === 2) {
      // There are 2 items in the list
      return strArr[0] + " and " + strArr[1] + pluralEndStr;
    } else {
      // There are 3 or more items in the list
      let retStr = "";
      for (let i = 0; i < strArr.length - 1; i++) {
        retStr += strArr[i] + ", ";
      }
      return retStr + "and " + strArr[strArr.length - 1] + pluralEndStr;
    }
  };

  /**
   * Creates a string of all E-stops that have been triggered
   *
   * @returns {string|*} A string listing all of the E-stops that are currently triggered
   */
  const getEStopString = () => {
    let eStopStrings = [];

    // Add any pressed E-stops to eStopStrings
    // The first element pushed to eStopStrings/added to the list of E-stops should be capitalized, and any
    // additional E-stops should not be capitalized
    if (_checkBooleanData("driver_eStop")) {
      eStopStrings.push(eStopStrings.length === 0 ? "Driver" : "driver");
    }
    if (_checkBooleanData("external_eStop")) {
      eStopStrings.push(eStopStrings.length === 0 ? "External" : "external");
    }

    // Create and return a formatted string containing a list of pressed E-stops
    return _formFaultString(
      eStopStrings,
      " E-stop was pressed",
      " E-stops were pressed"
    );
  };

  /**
   * Checks all of the BMS failure statuses.
   *
   * @returns {boolean} true if any of the BMS failure statuses are true; false otherwise
   */
  const checkBMSFailures = () => {
    return (
      _checkBooleanData("voltage_failsafe") ||
      _checkBooleanData("current_failsafe") ||
      _checkBooleanData("relay_failsafe") ||
      _checkBooleanData("cell_balancing_active") ||
      _checkBooleanData("charge_interlock_failsafe") ||
      _checkBooleanData("thermistor_b_value_table_invalid") ||
      _checkBooleanData("input_power_supply_failsafe") ||
      _checkBooleanData("discharge_limit_enforcement_fault") ||
      _checkBooleanData("charger_safety_relay_fault") ||
      _checkBooleanData("internal_hardware_fault") ||
      _checkBooleanData("internal_heatsink_fault") ||
      _checkBooleanData("internal_software_fault") ||
      _checkBooleanData("highest_cell_voltage_too_high_fault") ||
      _checkBooleanData("lowest_cell_voltage_too_low_fault") ||
      _checkBooleanData("pack_too_hot_fault") ||
      _checkBooleanData("internal_communication_fault") ||
      _checkBooleanData("cell_balancing_stuck_off_fault") ||
      _checkBooleanData("weak_cell_fault") ||
      _checkBooleanData("low_cell_voltage_fault") ||
      _checkBooleanData("open_wiring_fault") ||
      _checkBooleanData("current_sensor_fault") ||
      _checkBooleanData("highest_cell_voltage_over_5V_fault") ||
      _checkBooleanData("cell_asic_fault") ||
      _checkBooleanData("weak_pack_fault") ||
      _checkBooleanData("fan_monitor_fault") ||
      _checkBooleanData("thermistor_fault") ||
      _checkBooleanData("external_communication_fault") ||
      _checkBooleanData("redundant_power_supply_fault") ||
      _checkBooleanData("high_voltage_isolation_fault") ||
      _checkBooleanData("input_power_supply_fault") ||
      _checkBooleanData("charge_limit_enforcement_fault")
    );
  };

  /**
   * Creates a string of all BMS failures that have been triggered
   *
   * @returns {string|*} A string listing all of the BMS failures that are currently triggered
   */
  const getBMSFailureString = () => {
    let failureStrings = [];

    // Add any triggered BMS failures to failureStrings
    // The first element pushed to failureStrings/added to the list of failures should be capitalized, and any
    // additional failsafes should not be capitalized
    if (_checkBooleanData("voltage_failsafe")) {
      failureStrings.push("Voltage failsafe");
    }
    if (_checkBooleanData("current_failsafe")) {
      failureStrings.push(failureStrings.length === 0 ? "Current failsafe" : "current failsafe");
    }
    if (_checkBooleanData("relay_failsafe")) {
      failureStrings.push(failureStrings.length === 0 ? "Relay failsafe" : "relay failsafe");
    }
    if (_checkBooleanData("cell_balancing_active")) {
      failureStrings.push(failureStrings.length === 0 ? "Cell balancing inactive" : "cell balancing inactive");
    }
    if (_checkBooleanData("charge_interlock_failsafe")) {
      failureStrings.push(failureStrings.length === 0 ? "Charge interlock failsafe" : "charge interlock failsafe");
    }
    if (_checkBooleanData("thermistor_b_value_table_invalid")) {
      failureStrings.push(failureStrings.length === 0 ? "Thermistor B-value table invalid" : "thermistor B-value table invalid");
    }
    if (_checkBooleanData("input_power_supply_failsafe")) {
      failureStrings.push(failureStrings.length === 0 ? "Input power supply failsafe" : "input power supply failsafe");
    }
    if (_checkBooleanData("discharge_limit_enforcement_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Discharge limit enforcement fault" : "discharge limit enforcement fault");
    }
    if (_checkBooleanData("charger_safety_relay_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Charger safety relay fault" : "charger safety relay fault");
    }
    if (_checkBooleanData("internal_hardware_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Internal hardware fault" : "internal hardware fault");
    }
    if (_checkBooleanData("internal_heatsink_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Internal heatsink fault" : "internal heatsink fault");
    }
    if (_checkBooleanData("internal_software_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Internal software fault" : "internal software fault");
    }
    if (_checkBooleanData("highest_cell_voltage_too_high_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Highest cell voltage too high fault" : "highest cell voltage too high fault");
    }
    if (_checkBooleanData("lowest_cell_voltage_too_low_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Lowest cell voltage too low fault" : "lowest cell voltage too low fault");
    }
    if (_checkBooleanData("pack_too_hot_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Pack too hot fault" : "pack too hot fault");
    }
    if (_checkBooleanData("internal_communication_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Internal communication fault" : "internal communication fault");
    }
    if (_checkBooleanData("cell_balancing_stuck_off_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Cell balancing stuck off fault" : "cell balancing stuck off fault");
    }
    if (_checkBooleanData("weak_cell_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Weak cell fault" : "weak cell fault");
    }
    if (_checkBooleanData("low_cell_voltage_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Low cell voltage fault" : "low cell voltage fault");
    }
    if (_checkBooleanData("open_wiring_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Open wiring fault" : "open wiring fault");
    }
    if (_checkBooleanData("current_sensor_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Current sensor fault" : "current sensor fault");
    }
    if (_checkBooleanData("highest_cell_voltage_over_5V_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Highest cell voltage over 5V fault" : "highest cell voltage over 5V fault");
    }
    if (_checkBooleanData("cell_asic_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Cell ASIC fault" : "cell ASIC fault");
    }
    if (_checkBooleanData("weak_pack_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Weak pack fault" : "weak pack fault");
    }
    if (_checkBooleanData("fan_monitor_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Fan monitor fault" : "fan monitor fault");
    }
    if (_checkBooleanData("thermistor_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Thermistor fault" : "thermistor fault");
    }
    if (_checkBooleanData("external_communication_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "External communication fault" : "external communication fault");
    }
    if (_checkBooleanData("redundant_power_supply_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Redundant power supply fault" : "redundant power supply fault");
    }
    if (_checkBooleanData("high_voltage_isolation_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "High voltage isolation fault" : "high voltage isolation fault");
    }
    if (_checkBooleanData("input_power_supply_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Input power supply fault" : "input power supply fault");
    }
    if (_checkBooleanData("charge_limit_enforcement_fault")) {
      failureStrings.push(failureStrings.length === 0 ? "Charge limit enforcement fault" : "charge limit enforcement fault");
    }

    // Create and return a formatted string containing a list of the triggered BMS failures
    return _formFaultString(failureStrings, " occurred", " occurred");
  };

  /**
   * Checks all of the temperatures against their nominal minimum and maximum values.
   *
   * @returns {boolean} true if any of the temperatures are outside or their nominal ranges; false otherwise
   */
  const checkTemps = () => {
    return (
      props.data?.motor_temp[0] > CONSTANTS.motor_temp.MAX ||
      props.data?.motor_temp[0] < CONSTANTS.motor_temp.MIN ||
      props.data?.motor_controller_temp[0] > CONSTANTS.motor_controller_temp.MAX ||
      props.data?.motor_controller_temp[0] < CONSTANTS.motor_controller_temp.MIN ||
      props.data?.dcdc_temp[0] > CONSTANTS.dcdc_temp.MAX ||
      props.data?.dcdc_temp[0] < CONSTANTS.dcdc_temp.MIN ||
      props.data?.driverIO_temp[0] > CONSTANTS.driverIO_temp.MAX ||
      props.data?.driverIO_temp[0] < CONSTANTS.driverIO_temp.MIN ||
      props.data?.mainIO_temp[0] > CONSTANTS.mainIO_temp.MAX ||
      props.data?.mainIO_temp[0] < CONSTANTS.mainIO_temp.MIN ||
      props.data?.cabin_temp[0] > CONSTANTS.cabin_temp.MAX ||
      props.data?.cabin_temp[0] < CONSTANTS.cabin_temp.MIN ||
      props.data?.road_temp[0] > CONSTANTS.road_temp.MAX ||
      props.data?.road_temp[0] < CONSTANTS.road_temp.MIN ||
      props.data?.brake_temp[0] > CONSTANTS.brake_temp.MAX ||
      props.data?.brake_temp[0] < CONSTANTS.brake_temp.MIN ||
      props.data?.air_temp[0] > CONSTANTS.air_temp.MAX ||
      props.data?.air_temp[0] < CONSTANTS.air_temp.MIN ||
      props.data?.string1_temp[0] > CONSTANTS.string1_temp.MAX ||
      props.data?.string1_temp[0] < CONSTANTS.string1_temp.MIN ||
      props.data?.string2_temp[0] > CONSTANTS.string2_temp.MAX ||
      props.data?.string2_temp[0] < CONSTANTS.string2_temp.MIN ||
      props.data?.string3_temp[0] > CONSTANTS.string3_temp.MAX ||
      props.data?.string3_temp[0] < CONSTANTS.string3_temp.MIN ||
      props.data?.pack_temp[0] < CONSTANTS.pack_temp.MIN ||
      props.data?.pack_temp[0] > CONSTANTS.pack_temp.MAX ||
      props.data?.pack_internal_temp[0] < CONSTANTS.pack_internal_temp.MIN ||
      props.data?.pack_internal_temp[0] > CONSTANTS.pack_internal_temp.MAX
    );
  };

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
   *                  <a href="https://github.com/badgerloop-software/sc1-data-format/blob/main/format.json">data
   *                  format</a>) whose value is being checked
   * @param uppercaseLabel A more user-friendly label for the device/item whose temperature might be high or low.
   *                       Starts with an uppercase letter (in case this is the first item in one of the lists)
   * @param lowercaseLabel A more user-friendly label for the device/item whose temperature might be high or low.
   *                       Starts with a lowercase letter (in case this is not the first item in one of the lists)
   * @author James Vollmer
   * @private
   */
  const _updateTempArrays = (
    lowArray,
    highArray,
    dataLabel,
    uppercaseLabel,
    lowercaseLabel
  ) => {
    if (props.data?.[dataLabel][0] > CONSTANTS[dataLabel].MAX) {
      // Item is overtemperature. If highArray is empty, add uppercaseLabel; otherwise, add lowercaseLabel
      highArray.push(highArray.length === 0 ? uppercaseLabel : lowercaseLabel);
    } else if (props.data?.[dataLabel][0] < CONSTANTS[dataLabel].MIN) {
      // Item is undertemperature. If lowArray is empty, add uppercaseLabel; otherwise, add lowercaseLabel
      lowArray.push(lowArray.length === 0 ? uppercaseLabel : lowercaseLabel);
    }
  };

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

    // Add any items with non-nominal temperatures to the appropriate array
    // The first element pushed to each array/added to each of the lists should be capitalized, and any additional
    // items should not be capitalized
    _updateTempArrays(
      lowTempStrings,
      highTempStrings,
      "motor_temp",
      "Motor",
      "motor"
    );
    _updateTempArrays(
        lowTempStrings,
        highTempStrings,
        "motor_controller_temp",
        "Motor controller",
        "motor controller"
    );
    _updateTempArrays(
        lowTempStrings,
        highTempStrings,
        "dcdc_temp",
        "DCDC",
        "DCDC"
    );
    _updateTempArrays(
      lowTempStrings,
      highTempStrings,
      "driverIO_temp",
      "Driver IO",
      "driver IO"
    );
    _updateTempArrays(
      lowTempStrings,
      highTempStrings,
      "mainIO_temp",
      "Main IO",
      "main IO"
    );
    _updateTempArrays(
      lowTempStrings,
      highTempStrings,
      "cabin_temp",
      "Cabin",
      "cabin"
    );
    _updateTempArrays(
        lowTempStrings,
        highTempStrings,
        "road_temp",
        "Road",
        "road"
    );
    _updateTempArrays(
        lowTempStrings,
        highTempStrings,
        "brake_temp",
        "Brake",
        "brake"
    );
    _updateTempArrays(
        lowTempStrings,
        highTempStrings,
        "air_temp",
        "Air",
        "air"
    );
    _updateTempArrays(
      lowTempStrings,
      highTempStrings,
      "string1_temp",
      "Cell string 1",
      "cell string 1"
    );
    _updateTempArrays(
      lowTempStrings,
      highTempStrings,
      "string2_temp",
      "Cell string 2",
      "cell string 2"
    );
    _updateTempArrays(
      lowTempStrings,
      highTempStrings,
      "string3_temp",
      "Cell string 3",
      "cell string 3"
    );
    _updateTempArrays(
        lowTempStrings,
        highTempStrings,
        "pack_temp",
        "Battery pack",
        "battery pack"
    );
    _updateTempArrays(
        lowTempStrings,
        highTempStrings,
        "pack_internal_temp",
        "Internal pack",
        "internal pack"
    );

    // Create formatted strings containing lists of items with high and low temperatures
    const highTempString = _formFaultString(highTempStrings, " temp", " temps");
    const lowTempString = _formFaultString(lowTempStrings, " temp", " temps");

    // Add each string to its own line (if the string is not empty) and return the resulting lines for the tooltip
    return (
      <>
        {highTempString !== "" ? (
          <>
            <b>High:</b> {highTempString}
            <br />
          </>
        ) : (
          ""
        )}
        {lowTempString !== "" ? (
          <>
            <b>Low:</b> {lowTempString}
          </>
        ) : (
          ""
        )}
      </>
    );
  };

  const getHeartbeatString = () => {
    let heartbeatStrings = [];

    // Add any failing heartbeats
    if (_checkBooleanData("mainIO_heartbeat")) {
      heartbeatStrings.push("Main IO");
    }
    if (_checkBooleanData("mppt_can_heartbeat")) {
      heartbeatStrings.push("MPPT CAN");
    }
    if (_checkBooleanData("mcc_can_heartbeat")) {
      heartbeatStrings.push("MCC CAN");
    }
    if (_checkBooleanData("bms_can_heartbeat")) {
      heartbeatStrings.push("BMS CAN");
    }

    // Create and return a formatted string containing a list of heartbeat failures
    return _formFaultString(
      heartbeatStrings,
      " heartbeat was not detected",
      " heartbeats were not detected"
    );
  };

  const getMCUString = () => {
    let MCUStrings = [];

    if (_checkBooleanData("mcu_check")) {
      MCUStrings.push("MCU check");
    }
    if (_checkBooleanData("mcu_stat_fdbk")) {
      MCUStrings.push("MCU status feedback");
    }
    if (_checkBooleanData("mcu_hv_en")) {
      MCUStrings.push("MCU HV enable");
    }

    // Create and return a formatted string containing a list of MCU errors
    return _formFaultString(
      MCUStrings,
      " error was found",
      " errors were found"
    );
  };

  const getMainDriverPowerString = () => {
    let mainDriverPowerStrings = [];

    // Add any erroneous main or driver power values to the tooltip
    // The first element pushed should be capitalized, and any additional
    // parts of the string should not be
    if (_checkBooleanData("main_power_warning")) {
      mainDriverPowerStrings.push("Main power warning");
    }
    if (_checkBooleanData("main_power_critical")) {
      mainDriverPowerStrings.push(mainDriverPowerStrings.length === 0 ? "Main power critical" : "main power critical");
    }
    if (_checkBooleanData("main_power_valid")) {
      mainDriverPowerStrings.push(mainDriverPowerStrings.length === 0 ? "Main power invalid" : "main power invalid");
    }
    if (_checkBooleanData("driver_power_warning")) {
      mainDriverPowerStrings.push(mainDriverPowerStrings.length === 0 ? "Driver power warning" : "driver power warning");
    }
    if (_checkBooleanData("driver_power_critical")) {
      mainDriverPowerStrings.push(mainDriverPowerStrings.length === 0 ? "Driver power critical" : "driver power critical");
    }
    if (_checkBooleanData("driver_power_valid")) {
      mainDriverPowerStrings.push(mainDriverPowerStrings.length === 0 ? "Driver power invalid" : "driver power invalid");
    }

    // Create and return a formatted string containing a list of board power errors
    return _formFaultString(
      mainDriverPowerStrings,
      " error was found",
      " errors were found"
    );
  };

  const getMotorControllerString = () => {
    let motorControllerString;

    /**
     * Generates a string correlating an overheating status to the actual temperature value and
     * displays the action that the motor controller is taking in response
     */
    const getTempActionString = () => {
      let motorControllerTemperature = props.data?.motor_controller_temp[0];
      let overheatAction = "";
      if (motorControllerTemperature >= 105) {
        overheatAction = "drive will stop";
      } else if (motorControllerTemperature >= 95) {
        overheatAction = "controller will reduce power to 1/4";
      } else if (motorControllerTemperature >= 85) {
        overheatAction = "controller will reduce power to 1/2"
      } else {
        overheatAction = "no action taken";
      }
      return "MC temp: " + motorControllerTemperature + " -> " + overheatAction;
    }

    // Set the motor controller status issue for the tooltip
    switch(props.data?.mc_status[0]) {
      case 0:
        // Non-error code. Pass
        break;
      case 1:
        motorControllerString = "Over current (motor or battery current too high)";
        break;
      case 2:
        motorControllerString = "Unused error code 2, possibly 'Over current (motor or battery current too high)' or 'Hole sensor fault'";
        break;
      case 3:
        motorControllerString = "Hole sensor fault";
        break;
      case 4:
        motorControllerString = "Motor locked";
        break;
      case 5:
        motorControllerString = "Sensor fault 1 (current sensor, thermistor, voltage sensor)";
        break;
      case 6:
        motorControllerString = "Sensor fault 2 (accelerator voltage out of range)";
        break;
      case 7:
        motorControllerString = "Unused error code 7, possibly 'Sensor fault 2 (accelerator voltage out of range)' or 'High battery voltage'";
        break;
      case 8:
        motorControllerString = "High battery voltage";
        break;
      case 9:
        motorControllerString = "Controller overheating (" + getTempActionString() + ")";
        break;
      default:
        motorControllerString = "Controller overheating (error code " + props.data?.mc_status[0] + ", " + getTempActionString() + ")";
        break;
    }

    // Create and return a string indicating the motor controller error
    return motorControllerString;
  };

  const checkCellGroupVoltages = () => {
    for (let i = 1; i < 32; i++) {
      if (props.data?.[`cell_group${i}_voltage`][0] < CONSTANTS[`cell_group${i}_voltage`].MIN
          || props.data?.[`cell_group${i}_voltage`][0] > CONSTANTS[`cell_group${i}_voltage`].MAX) {
        return true;
      }
    }
  };

  const getCellGroupVoltageString = () => {
    let highCellGroupVoltageStrings = [];
    let lowCellGroupVoltageStrings = [];

    for (let i = 1; i < 32; i++) {
      if (props.data?.[`cell_group${i}_voltage`][0] > CONSTANTS[`cell_group${i}_voltage`].MAX) {
        highCellGroupVoltageStrings.push(i);
      } else if (props.data?.[`cell_group${i}_voltage`][0] < CONSTANTS[`cell_group${i}_voltage`].MIN) {
        lowCellGroupVoltageStrings.push(i);
      }
    }

    // Create formatted strings containing lists of cell groups with high and low voltages
    const highCellGroupVoltageString = highCellGroupVoltageStrings.length === 0 ?
      "" : "Cell group " + _formFaultString(highCellGroupVoltageStrings, " voltage", " voltages");
    const lowCellGroupVoltageString = lowCellGroupVoltageStrings.length === 0 ?
      "" : "Cell group " + _formFaultString(lowCellGroupVoltageStrings, " voltage", " voltages");

    // Add each string to its own line (if the string is not empty) and return the resulting lines for the tooltip
    return (
      <>
        {highCellGroupVoltageString !== "" ? (
          <>
            <b>High:</b> {highCellGroupVoltageString}
            <br />
          </>
        ) : (
          ""
        )}
        {lowCellGroupVoltageString !== "" ? (
          <>
            <b>Low:</b> {lowCellGroupVoltageString}
          </>
        ) : (
          ""
        )}
      </>
    );
  };

  return (
    <Center w="100%" h="100%">
      <SimpleGrid
        columns={8}
        rows={3}
        spacingX="1.6vw"
        spacingY="3.3vh"
      >
        {!(props.data?.solar_car_connection[0] ?? false) ? (
          <Tooltip label={"Lost communication with the solar car"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.WirelessCommsLost} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {_checkBooleanData("mainIO_heartbeat")
          || _checkBooleanData("mppt_can_heartbeat")
          || _checkBooleanData("mcc_can_heartbeat")
          || _checkBooleanData("bms_can_heartbeat") ? (
          <Tooltip label={getHeartbeatString()}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.PhysicalConnection} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {_checkBooleanData("mppt_contactor") ? (
          <Tooltip label={"MPPT contactor is open"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.MPPTContactor} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {_checkBooleanData("low_contactor") ? (
          <Tooltip label={"Low contactor is open"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.LowContactor} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {_checkBooleanData("motor_controller_contactor") ? (
          <Tooltip label={"Motor controller contactor is open"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.MotorControllerContactor} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {_checkBooleanData("crash") ? (
          <Tooltip label={"Solar car has crashed"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.Crash} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {_checkBooleanData("mcu_check")
          || _checkBooleanData("mcu_stat_fdbk")
          || _checkBooleanData("mcu_hv_en") ? (
          <Tooltip label={getMCUString()}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.MCUCheck} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {_checkBooleanData("door") ? (
          <Tooltip label={"Door is open"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.Door} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {_checkBooleanData("driver_eStop") ||
        _checkBooleanData("external_eStop") ? (
          <Tooltip label={getEStopString()}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.EStop} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {_checkBooleanData("main_power_warning")
          || _checkBooleanData("main_power_critical")
          || _checkBooleanData("main_power_valid")
          || _checkBooleanData("driver_power_warning")
          || _checkBooleanData("driver_power_critical")
          || _checkBooleanData("driver_power_valid") ? (
          <Tooltip label={getMainDriverPowerString()}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.PowerWarnings} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {_checkBooleanData("bps_fault") ? (
          <Tooltip label={"BPS fault"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.BPSFault} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {_checkBooleanData("discharge_enable") ? (
          <Tooltip label={"Discharge enable"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.DischargeEnable} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {_checkBooleanData("imd_status") ? (
          <Tooltip label={"IMD status (battery isolation) fault"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.IMDStatus} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {checkBMSFailures() ? (
          <Tooltip label={getBMSFailureString()}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.BMSFailures} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {props.data?.mc_status[0] > CONSTANTS.mc_status.MIN ? (
          <Tooltip label={getMotorControllerString()}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.MCStatus} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {props.data?.pack_current[0] > CONSTANTS.pack_current.MAX ? (
          <Tooltip label={"High battery pack current"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.HighCurrent} />
          </Tooltip>
        ) : props.data?.pack_current[0] < CONSTANTS.pack_current.MIN ? (
          <Tooltip label={"Low battery pack current"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.LowCurrent} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {/* Box to horizontally center the lowest row of faults */}
        <Box h={imageHeight} />
        {props.data?.pack_voltage[0] > CONSTANTS.pack_voltage.MAX ? (
          <Tooltip label={"High battery pack voltage"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.HighVoltage} />
          </Tooltip>
        ) : props.data?.pack_voltage[0] < CONSTANTS.pack_voltage.MIN ? (
          <Tooltip label={"Low battery pack voltage"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.LowVoltage} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {props.data?.mppt_current_out[0] > CONSTANTS.mppt_current_out.MAX ? (
          <Tooltip label={"High MPPT current"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.MPPTCurrent} />
          </Tooltip>
        ) : props.data?.mppt_current_out[0] < CONSTANTS.mppt_current_out.MIN ? (
          <Tooltip label={"MPPT current is negative"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.MPPTCurrent} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {props.data?.bms_input_voltage[0] > CONSTANTS.bms_input_voltage.MAX ? (
          <Tooltip label={"High BMS input voltage"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.BMSInputVoltage} />
          </Tooltip>
        ) : props.data?.bms_input_voltage[0] < CONSTANTS.bms_input_voltage.MIN ? (
          <Tooltip label={"Low BMS input voltage"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.BMSInputVoltage} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {props.data?.soc[0] < CONSTANTS.soc.MIN ? (
          <Tooltip label={`Battery charge is low (<${CONSTANTS.soc.MIN}%)`}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.LowBattery} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {checkCellGroupVoltages() ? (
          <Tooltip label={getCellGroupVoltageString()} shouldWrapChildren size={"5"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.CellGroupVoltage} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
        {checkTemps() ? (
          <Tooltip label={getTempString()} shouldWrapChildren size={"5"}>
            <Image fit={fitType} boxSize={imageHeight} src={Images.Temperature} />
          </Tooltip>
        ) : (
          <Box h={imageHeight} />
        )}
      </SimpleGrid>
    </Center>
  );
}
