import {Box, Tooltip, Image, SimpleGrid, useColorMode, Text} from "@chakra-ui/react";
import { FaultsViewImages } from "./Images/Images";
import CONSTANTS from "../../data-constants.json";
import {Alert, AlertIcon, AlertTitle, AlertDescription} from '@chakra-ui/react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'
import { Button } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import React from "react"; 
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'


export default function Faults(props) {
  const fitType = "scale-down";
  const imageHeight = "7vh";

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
      (props.data?.[dataLabel][0] ?? CONSTANTS[dataLabel].MIN) !==
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
    if (_checkBooleanData("battery_eStop")) {
      eStopStrings.push("Battery");
    }
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
   * Checks all of the BMS failsafe statuses.
   *
   * @returns {boolean} true if any of the BMS failsafe statuses are true; false otherwise
   */
  const checkBMSFailsafes = () => {
    return (
      _checkBooleanData("voltage_failsafe") ||
      _checkBooleanData("current_failsafe") ||
      _checkBooleanData("supply_power_failsafe") ||
      _checkBooleanData("memory_failsafe") ||
      _checkBooleanData("relay_failsafe")
    );
  };

  /**
   * Creates a string of all BMS failsafes that have been triggered
   *
   * @returns {string|*} A string listing all of the BMS failsafes that are currently triggered
   */
  const getBMSFailsafeString = () => {
    let failsafeStrings = [];

    // Add any triggered BMS failsafes to failsafeStrings
    // The first element pushed to failsafeStrings/added to the list of failsafes should be capitalized, and any
    // additional failsafes should not be capitalized
    if (_checkBooleanData("voltage_failsafe")) {
      failsafeStrings.push("Voltage");
    }
    if (_checkBooleanData("current_failsafe")) {
      failsafeStrings.push(
        failsafeStrings.length === 0 ? "Current" : "current"
      );
    }
    if (_checkBooleanData("supply_power_failsafe")) {
      failsafeStrings.push(failsafeStrings.length === 0 ? "Supply" : "supply");
    }
    if (_checkBooleanData("memory_failsafe")) {
      failsafeStrings.push(failsafeStrings.length === 0 ? "Memory" : "memory");
    }
    if (_checkBooleanData("relay_failsafe")) {
      failsafeStrings.push(failsafeStrings.length === 0 ? "Relay" : "relay");
    }

    // Create and return a formatted string containing a list of the triggered BMS failsafes
    return _formFaultString(failsafeStrings, " failsafe", " failsafes");
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
      props.data?.driverIO_temp[0] > CONSTANTS.driverIO_temp.MAX ||
      props.data?.driverIO_temp[0] < CONSTANTS.driverIO_temp.MIN ||
      props.data?.mainIO_temp[0] > CONSTANTS.mainIO_temp.MAX ||
      props.data?.mainIO_temp[0] < CONSTANTS.mainIO_temp.MIN ||
      props.data?.cabin_temp[0] > CONSTANTS.cabin_temp.MAX ||
      props.data?.cabin_temp[0] < CONSTANTS.cabin_temp.MIN ||
      props.data?.string1_temp[0] > CONSTANTS.string1_temp.MAX ||
      props.data?.string1_temp[0] < CONSTANTS.string1_temp.MIN ||
      props.data?.string2_temp[0] > CONSTANTS.string2_temp.MAX ||
      props.data?.string2_temp[0] < CONSTANTS.string2_temp.MIN ||
      props.data?.string3_temp[0] > CONSTANTS.string3_temp.MAX ||
      props.data?.string3_temp[0] < CONSTANTS.string3_temp.MIN ||
      props.data?.pack_temp[0] > CONSTANTS.pack_temp.MAX
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
    if (props.data?.pack_temp[0] > CONSTANTS.pack_temp.MAX) {
      highTempStrings.push(
        highTempStrings.length === 0 ? "Battery pack" : "battery pack"
      );
    }

    // Create formatted strings containing lists of items with high and low temperatures
    const highTempString = _formFaultString(highTempStrings, " temp", " temps");
    const lowTempString = _formFaultString(lowTempStrings, " temp", " temps");

    // Add each string to its own line (if the string is not empty) and return the resulting lines for the tooltip
    return (
      <>
        {highTempString !== "" ? (
          <>
            High: {highTempString}
            <br />
          </>
        ) : (
          ""
        )}
        {lowTempString !== "" ? "Low: " + lowTempString : ""}
      </>
    );
  };

  const [historyFaults, setHistoryFaults] = useState(["fault 1", "fault 2", "fault 3"]);

  const addFaultToHistory = (date, info) => {
    setHistoryFaults([...historyFaults, date + " " + info])
  }

  /**
   * This function prompts the alert for when there is a fault, can be closed or deleted when prompted. After deletion the information of the fault will be saved to the tab of history of faults on the top left of the faults window.
   * 
   * @param {*} textInfo information of why the fault occured
   * @param {*} icon image of the icon that will be displayed
   * @returns 
   */
  function AlertDialogExample(textInfo, icon) {
    // const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
    const cancelRef = React.useRef()
    // const [display, setDisplay] = useState(true)

    const { isOpen, onOpen, onClose } = useDisclosure({defaultIsOpen: true})
    const [display, setDisplay] = useState(true)
  

    const onDelete = () => {
      var today = new Date(),
      date = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + " | " + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      addFaultToHistory(date, textInfo)
      setDisplay(false)
    }
    

    const innerBoxStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      boxSize: 'full',
      color: 'white',
      textShadow: '0 0 20px black',
      fontWeight: 'bold',
      fontSize: '20px',
    }
      const outerBoxStyles = {
      boxSize: '250px',
      p: '10',
    }

    return (
      <>
      {display &&
      
      <Box>
        {/* <h1>{textInfo} Until this fault has been cleared, the following icon will be present in the top left-hand corner of the app </h1>
        <Image fit={fitType} boxSize={imageHeight} src={icon} />
        <Button colorScheme='red' onClick={onOpen}>
          Close Alert
        </Button> */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          closeOnOverlayClick={false}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold' textColor='red'>
                Alert: Uncleared Fault
              </AlertDialogHeader>
        
              <AlertDialogBody>
                <h1>{textInfo} Until this fault has been cleared, the following icon will be present in the top left-hand corner of the app. If windos is closed, the information of this fault and what had caused it will be saved to the tab of faults.</h1>
                <Image fit={fitType} boxSize={imageHeight} src={icon} />
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDelete}>
                  Close
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
      }
      </>
    )
  }

  return (
    <>
    <SimpleGrid
      columns={6}
      rows={3}
      spacingX="2vw"
      spacingY="0.5vh"
      alignItems="center" 
      overflowY='scroll'
    >
      <Popover>
        <PopoverTrigger>
          <Button 
            border= "2px solid rgb(201, 38, 74)"
            width="62.5px"
          >Faults</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Previusly Occured Faults</PopoverHeader>
          <PopoverBody>
            <div>
            {historyFaults.map((fault) => {
              return (
                <li>
                  {fault}
                </li>
              );
            })}
          </div>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      {_checkBooleanData("mppt_contactor") ? (
        <Tooltip label={"MPPT contactor is open"}>
          <Image fit={fitType} boxSize={imageHeight} src={Images.MPPTContactor} />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {_checkBooleanData("mppt_contactor") ? (
        AlertDialogExample("MPPT contactor is open." , Images.MPPTContactor)
      ) : (
        <></>
      )}

      {_checkBooleanData("low_contactor") ? (
        <Tooltip label={"Low contactor is open"}>
          <Image fit={fitType} boxSize={imageHeight} src={Images.LowContactor} />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {_checkBooleanData("low_contactor") ? (
        AlertDialogExample("Low contactor is open.", Images.LowContactor)
      ) : (
        <></>
      )}

      {_checkBooleanData("motor_controller_contactor") ? (
        <Tooltip label={"Motor controller contactor is open"}>
          <Image
            fit={fitType}
            boxSize={imageHeight}
            src={Images.MotorControllerContactor}
          />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {_checkBooleanData("motor_controller_contactor") ? (
        AlertDialogExample("Motor controller contactor is open.", Images.MotorControllerContactor)
      ) : (
        <></>
      )}

      {_checkBooleanData("battery_eStop") ||
      _checkBooleanData("driver_eStop") ||
      _checkBooleanData("external_eStop") ? (
        <Tooltip label={getEStopString()}>
          <Image fit={fitType} boxSize={imageHeight} src={Images.EStop} />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {_checkBooleanData("battery_eStop") ||
      _checkBooleanData("driver_eStop") ||
      _checkBooleanData("external_eStop") ? (
        AlertDialogExample(getEStopString() + ".", Images.EStop)
      ) : (
        <></>
      )}

      {_checkBooleanData("door") ? (
        <Tooltip label={"Door is open"}>
          <Image fit={fitType} boxSize={imageHeight} src={Images.Door} />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {_checkBooleanData("door") ? (
        AlertDialogExample("Door is open.", Images.Door)
      ) : (
        <></>
      )}

      {_checkBooleanData("crash") ? (
        <Tooltip label={"Solar car has crashed"}>
          <Image fit={fitType} boxSize={imageHeight} src={Images.Crash} />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {_checkBooleanData("crash") ? (
        AlertDialogExample("Solar car has crashed.", Images.Crash)
      ) : (
        <></>
      )}

      {_checkBooleanData("mcu_check") ? (
        <Tooltip label={"MCU check failed"}>
          <Image fit={fitType} boxSize={imageHeight} src={Images.MCUCheck} />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {_checkBooleanData("mcu_check") ? (
        AlertDialogExample("MCU check failed.", Images.MCUCheck)
      ) : (
        <></>
      )}

      {_checkBooleanData("imd_status") ? (
        <Tooltip label={"IMD status (battery isolation) fault"}>
          <Image fit={fitType} boxSize={imageHeight} src={Images.IMDStatus} />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {_checkBooleanData("imd_status") ? (
        AlertDialogExample("IMD status (battery isolation) fault", Images.IMDStatus)
      ) : (
        <></>
      )}

      {checkBMSFailsafes() ? (
        <Tooltip label={getBMSFailsafeString()}>
          <Image
            fit={fitType}
            boxSize={imageHeight}
            src={Images.BatteryFailsafe}
          />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {checkBMSFailsafes() ? (
        AlertDialogExample(getBMSFailsafeString() + ".", Images.BatteryFailsafe)
      ) : (
        <></>
      )}

      {_checkBooleanData("bps_fault") ? (
        <Tooltip label={"BPS fault"}>
          <Image fit={fitType} boxSize={imageHeight} src={Images.BPSFault} />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {_checkBooleanData("bps_fault") ? (
        AlertDialogExample("BPS fault.", Images.BPSFault)
      ) : (
        <></>
      )}

      {props.data?.soc[0] < CONSTANTS.soc.MIN ? (
        <Tooltip label={`Battery charge is low (<${CONSTANTS.soc.MIN}%)`}>
          <Image fit={fitType} boxSize={imageHeight} src={Images.LowBattery} />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {props.data?.soc[0] < CONSTANTS.soc.MIN ? (
        AlertDialogExample(`Battery charge is low (<${CONSTANTS.soc.MIN}%.)`, Images.LowBattery)
      ) : (
        <></>
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
      {props.data?.mppt_current_out[0] > CONSTANTS.mppt_current_out.MAX ? (
        AlertDialogExample(`High MPPT current (>${CONSTANTS.mppt_current_out.MAX}Amps.)`, Images.MPPTCurrent)
      ) : props.data?.mppt_current_out[0] < CONSTANTS.mppt_current_out.MIN ? (
        AlertDialogExample(`MPPT current is negative (<${CONSTANTS.mppt_current_out.MIN}Amps.)`, Images.MPPTCurrent)
      ) : (
        <></>
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
      {props.data?.pack_current[0] > CONSTANTS.pack_current.MAX ? (
        AlertDialogExample(`High battery pack current (>${CONSTANTS.pack_current.MAX}Amps.)`, Images.HighCurrent)
      ) : props.data?.pack_current[0] < CONSTANTS.pack_current.MIN ? (
        AlertDialogExample(`Low battery pack current (<${CONSTANTS.pack_current.MIN}Amps.)`, Images.LowCurrent)
      ) : (
        <></>
      )}

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
      {props.data?.pack_voltage[0] > CONSTANTS.pack_voltage.MAX ? (
        AlertDialogExample(`High battery pack voltage (>${CONSTANTS.pack_voltage.MAX}V.)`, Images.HighVoltage)
      ) : props.data?.pack_voltage[0] < CONSTANTS.pack_voltage.MIN ? (
        AlertDialogExample(`Low battery pack voltage (<${CONSTANTS.pack_current.MIN}V.)`, Images.LowVoltage)
      ) : (
        <></>
      )}

      {!(props.data?.solar_car_connection[0] ?? false) ? (
        <Tooltip label={"Lost communication with the solar car"}>
          <Image
            fit={fitType}
            boxSize={imageHeight}
            src={Images.WirelessCommsLost}
          />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {!(props.data?.solar_car_connection[0] ?? false) ? (
        AlertDialogExample("Lost communication with the solar car.", Images.WirelessCommsLost)
      ) : (
        <Box h={imageHeight} />
      )}

      {_checkBooleanData("bms_canbus_failure") ? (
        _checkBooleanData("mainIO_heartbeat") ? (
          <Tooltip
            label={"BMS CANBUS failure and Driver IO/Main IO connection lost"}
          >
            <Image
              fit={fitType}
              boxSize={imageHeight}
              src={Images.PhysicalConnection}
            />
          </Tooltip>
        ) : (
          <Tooltip label={"BMS CANBUS failure"}>
            <Image
              fit={fitType}
              boxSize={imageHeight}
              src={Images.PhysicalConnection}
            />
          </Tooltip>
        )
      ) : _checkBooleanData("mainIO_heartbeat") ? (
        <Tooltip label={"Driver IO/Main IO connection lost"}>
          <Image
            fit={fitType}
            boxSize={imageHeight}
            src={Images.PhysicalConnection}
          />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {_checkBooleanData("bms_canbus_failure") ? (
        _checkBooleanData("mainIO_heartbeat") ? (
          AlertDialogExample("BMS CANBUS failure and Driver IO/Main IO connection lost.", Images.PhysicalConnection)
        ) : (
          AlertDialogExample("BMS CANBUS failure.", Images.PhysicalConnection)
        )
      ) : _checkBooleanData("mainIO_heartbeat") ? (
          AlertDialogExample("Driver IO/Main IO connection lost.", Images.PhysicalConnection)
      ) : (
        <></>
      )}

      {props.data?.bms_input_voltage[0] > CONSTANTS.bms_input_voltage.MAX ? (
        <Tooltip label={"High BMS input voltage"}>
          <Image
            fit={fitType}
            boxSize={imageHeight}
            src={Images.BMSInputVoltage}
          />
        </Tooltip>
      ) : props.data?.bms_input_voltage[0] < CONSTANTS.bms_input_voltage.MIN ? (
        <Tooltip label={"Low BMS input voltage"}>
          <Image
            fit={fitType}
            boxSize={imageHeight}
            src={Images.BMSInputVoltage}
          />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {props.data?.bms_input_voltage[0] > CONSTANTS.bms_input_voltage.MAX ? (
        AlertDialogExample(`High BMS input voltage (>${CONSTANTS.bms_input_voltage.MAX}V.)`, Images.BMSInputVoltage)
      ) : props.data?.bms_input_voltage[0] < CONSTANTS.bms_input_voltage.MIN ? (
        AlertDialogExample(`Low BMS input voltage (<${CONSTANTS.bms_input_voltage.MIN}V.)`, Images.BMSInputVoltage)
      ) : (
        <></>
      )}

      {checkTemps() ? (
        <Tooltip label={getTempString()} shouldWrapChildren size={"5"}>
          <Image
            fit={fitType}
            boxSize={imageHeight}
            src={Images.HighTemperature}
          />
        </Tooltip>
      ) : (
        <Box h={imageHeight} />
      )}
      {checkTemps() ? (
        AlertDialogExample(getTempString() + ".", Images.HighTemperature)
      ) : (
        <></>
      )}

    </SimpleGrid>
    </>
  );
}
