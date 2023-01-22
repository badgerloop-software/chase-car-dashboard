import {
  Button,
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormLabel,
  FormControl,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverBody,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useEffect, useLayoutEffect, useReducer, useState, useRef } from "react";
import { FaPlay, FaPause, FaStop } from 'react-icons/fa';
import { BsFillRecordCircleFill } from 'react-icons/bs';
import FaultsView from "../Faults/FaultsView";
import DriverComms from "../GeneralData/DriverComms";
import IOView from "../GeneralData/IOView";
import BatteryCells from "../BatteryCells/BatteryCells";
import BatteryPack from "../BatteryCells/BatteryPack";
import PPC_MPPT from "../PPC_MPPT/PPC_MPPT";
import GraphContainer from "./GraphContainer";
import colors from "../Shared/colors";

// Importing toastify module
import { toast } from 'react-toastify';

// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';

// toast-configuration method,
// it is compulsory method.
toast.configure()


/**
 *ToDo:
 *  Handling empty parems sent to the back end
 *  Making get data experience more user frendly
 *  Fixing unexpected getSessionsList error (Usually happens when app is left idal)
 */


// prevent accidental reloading/closing
window.onbeforeunload = () => true;

/**
 * The reducer used for the main queue of data from the database
 * @param {[any[], string]} prevData the previous queue and last time data
 * @param {any[]} prevData[0] the queued data
 * @param {any} newData the new data that is recieved directly from the backend
 * @returns the new queue of data to use
 */
function reducer([currentQueue], newData) {
  // console.log("reducer called :~)", newData);

  // const timestamps = newData.timestamps.map((timestamp) =>
  //   DateTime.fromISO(timestamp)
  // );

  const output = {};
  for (const key in newData) {
    if (key === "timestamps" || key.startsWith("tstamp")) continue;

    output[key] = newData[key].map((value, idx) => ({
      x: newData.timestamps[idx],
      y: value,
    }));
  }

  return [output, newData.timestamps[0]];
}

/**
 * Requests the API endpoint and returns the response
 * @returns the JSON response from the API
 */
async function callBackendAPI() {
  console.time("http call");

  const response = await fetch("/api");
  console.timeLog("http call", "fetch finished");
  const body = await response.json();
  console.timeLog("http call", "json extracted");

  if (response.status !== 200) {
    console.error("api: error");
    throw Error(body.message);
  }

  console.timeEnd("http call");
  // console.log("body", body);
  return body;
}

/**
 * The Dashboard component
 * @param {any} props the props to pass this dashboard component (none are used)
 * @returns the dashboard component
 */
export default function Dashboard(props) {
  //-------------- Fetching data from backend and updating state/data --------------
  const { isOpen, onOpen, onClose } = useDisclosure()
  /*TODO const initialRef = React.useRef()
  const finalRef = React.useRef()*/
  const initialRef = useRef()
  const finalRef = useRef()

  const [sessionsList, setSessionsList] = useState({ data: null });

  const [framePointer, setFramePointer] = useState(0);
  let [frameIntervalId, setframeIntervalId] = useState(null);
  const [playMode, setPlayMode] = useState(false)

  const [currentSession, setCurrentSession] = useState("");
  const [recordedData, setRecordedData] = useState({ data: null });
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingSessionCreated, setIsRecordingSessionCreated] = useState(false);
  const [sessionFileName, setSessionFileName] = useState("");

  const [[queue, latestTimestamp], updateQueue] = useReducer(reducer, [
    {},
    null,
  ]);

  // useEffect(() => {
  //   console.log("recieved", latestTimestamp);
  // }, latestTimestamp);

  const [state, setState] = useState({ data: null });
  useEffect(() => {
    callBackendAPI()
      .then((res) => {
        console.time("update react");

        setState({ data: res.response });
        updateQueue(res.response);
        // console.log("api::", res.response);

        console.timeEnd("update react");
      })
      .catch((err) => console.log(err));
  }, [state]);
/*TODO=======
  const callBackendAPI = async () => {
    const response = await fetch("/api");
    const body = await response.json();
    // console.log("gen data",body)

    if (response.status !== 200) {
      console.error("api: error");
      throw Error(body.message);
    }

    return body;
  };*/
  const getSessionsList = async () => {
    const response = await fetch("/sessionsList");
    const body = await response.json();
    if (response.status !== 200) {
      console.error("sessionList: error");
      // throw Error(body.message);
      return
    }
    return body;
  };



  const getSessionData = (session) => {
    fetch('http://localhost:4001/get-recorded-data/x', {
      method: "POST",
      body: JSON.stringify({ fileName: session }),
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(response => response.json()).then((data) => {
      console.log("session res::", data)

    }).catch((e) => {
      setIsRecording(false)
      console.log("Error:", e)
    })
  }




  useLayoutEffect(() => {
    //-------
    if (playMode) {
      if (framePointer >= recordedData.data.length) {
        clearInterval(frameIntervalId)
        setFramePointer(0)
        console.log("End of frames")
        toast("End of frames!!")

      } else {
        setState((prev) => prev.data = recordedData.data[framePointer])
      }
      console.log("frame:", framePointer)
    } else {
      callBackendAPI().then((res) => {
        setState({ data: res.response })
      }).catch((err) => console.log("/api error", err));
    }


  }, [state, framePointer]);

  useLayoutEffect(() => {
    //-------
    // console.log("Running once")
    getSessionsList().then((res) => {
      setSessionsList({ data: res.response });
    }).catch((err) => console.log("error", err));
  }, []);


  const playData = (speed = 1) => {
    let time = 1000 * speed // 1000 = 1000ms = 1sec
    // check if already an interval has been set up
    if (!recordedData.data || recordedData.data === null && recordedData.data?.length == 0) {
      console.log("No data")
      toast("No session data found.")
      return
    }

    console.log("paying...", recordedData.data)
    setPlayMode(true)
    if (!frameIntervalId) {
      setframeIntervalId(setInterval(() => {
        //What to do during the interval
        setFramePointer(prev => prev + 1)
      }, time))
    }
  };

  const pause = () => {
    console.log("stopping:", frameIntervalId)
    clearInterval(frameIntervalId)
    setframeIntervalId(null)
  }

  const stop = () => {
    console.log("stopping:", frameIntervalId)
    clearInterval(frameIntervalId)
    setframeIntervalId(null)
    setFramePointer(0)
  }

  const getRecordedData = async () => {
    const response = await fetch("/get-recorded-data");
    if (response.status === 200) {
      const body = await response.json();
      return body
    } else {
      console.log("Error getting Rec data")
    }
    return null;
  };

  const recordCarData = () => {
    fetch('http://localhost:4001/record-data', {
      method: "POST",
      body: JSON.stringify({ doRecord: !isRecording }),
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(response => response.json()).then((data) => {
      console.log("rcd res::", data)
      if (data.response === "NoFile") {
        //ToDo
      }
      if (data.response === "Recording") {
        //Then Request is sent
        setIsRecording(!isRecording)
      } else {
        setIsRecording(false)
        // Handle the error
        alert("Something went wrong")
      }

    }).catch((e) => {
      setIsRecording(false)
      console.log("Error:", e)
    })
  }

  const setCurrentRecordingSession = (fileName) => {
    fetch('http://localhost:4001/current-recording-session', {
      method: "POST",
      body: JSON.stringify({ fileName: fileName }),
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(response => response.json()).then((data) => {
      console.log("crs res::", data)
      if (data.response == -1) {
        toast("Empty name")
        return
      }
      if (data.response == 200) {
        setCurrentSession(fileName)
        toast("Current recording session is set !!")
      } else {
        // Handle the error
        toast("Something went wrong")
      }
    }).catch((e) => {
      console.log("Error:", e)
    });
  }

  const createRecordingSession = (fileName) => {
    fetch('http://localhost:4001/create-recording-session', {
      method: "POST",
      body: JSON.stringify({ fileName: fileName }),
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(response => response.json()).then((data) => {
      console.log("crs res::", data)
      if (data.response === "Empty") {
        alert("Empty feild")
        return
      }
      if (data.response === "Created") {
        // Get the updated sessions list
        getSessionsList().then((res) => {
          // console.log("Getting")
          setSessionsList({ data: res.response });
        }).catch((err) => console.log("error", err));
        setCurrentSession(fileName)

        // alert("Session file has been created!!")
        toast("Session file has been created!!")
        //Then Request is sent
      } else {
        setIsRecordingSessionCreated(false)
        // Handle the error
        alert("Something went wrong")
      }

    }).catch((e) => {
      setIsRecordingSessionCreated(false)
      console.log("Error:", e)
    });
  }

  //------------------- Choosing data views using Select components -------------------

  const [dataView1, setDataView1] = useState("");
  const [dataView2, setDataView2] = useState("");
  const [dataView3, setDataView3] = useState("");
  const [dataView4, setDataView4] = useState("");

  // Update the value indicating which data view to display when an option is selected
  const selectDataView = (event) => {
    if (event.target.id === "dataViewSelect1") {
      // Avoid duplicate data views, unless they are both empty
      if(event.target.value !== "") {
        if (event.target.value === document.getElementById("dataViewSelect2").value) {
          // TODO Update comments like this: If trying to switch to a data view that is already being displayed in the other
          // section, switch the data views in this section and the other one
          setDataView2(dataView1);
        } else if (event.target.value === document.getElementById("dataViewSelect3").value) {
          // If trying to switch to a data view that is already being displayed in the other
          // section, switch the data views in this section and the other one
          setDataView3(dataView1);
        } else if (event.target.value === document.getElementById("dataViewSelect4").value) {
          // If trying to switch to a data view that is already being displayed in the other
          // section, switch the data views in this section and the other one
          setDataView4(dataView1);
          console.log(event.target.value.toString()); // TODO Remove
        }
      }
      setDataView1(event.target.value);
    } else if (event.target.id === "dataViewSelect2") {
      // Avoid duplicate data views, unless they are both empty
      if(event.target.value !== "") {
        if (event.target.value === document.getElementById("dataViewSelect1").value) {
          // TODO Update comments like this: If trying to switch to a data view that is already being displayed in the other
          // section, switch the data views in this section and the other one
          setDataView1(dataView2);
        } else if (event.target.value === document.getElementById("dataViewSelect3").value) {
          // If trying to switch to a data view that is already being displayed in the other
          // section, switch the data views in this section and the other one
          setDataView3(dataView2);
        } else if (event.target.value === document.getElementById("dataViewSelect4").value) {
          // If trying to switch to a data view that is already being displayed in the other
          // section, switch the data views in this section and the other one
          setDataView4(dataView2);
        }
      }
      setDataView2(event.target.value);
    } else if (event.target.id === "dataViewSelect3") {
      // Avoid duplicate data views, unless they are both empty
      if(event.target.value !== "") {
        if (event.target.value === document.getElementById("dataViewSelect1").value) {
          // TODO Update comments like this: If trying to switch to a data view that is already being displayed in the other
          // section, switch the data views in this section and the other one
          setDataView1(dataView3);
        } else if (event.target.value === document.getElementById("dataViewSelect2").value) {
          // If trying to switch to a data view that is already being displayed in the other
          // section, switch the data views in this section and the other one
          setDataView2(dataView3);
        } else if (event.target.value === document.getElementById("dataViewSelect4").value) {
          // If trying to switch to a data view that is already being displayed in the other
          // section, switch the data views in this section and the other one
          setDataView4(dataView3);
        }
      }
      setDataView3(event.target.value);
    } else if (event.target.id === "dataViewSelect4") {
      // Avoid duplicate data views, unless they are both empty
      if(event.target.value !== "") {
        if (event.target.value === document.getElementById("dataViewSelect1").value) {
          // TODO Update comments like this: If trying to switch to a data view that is already being displayed in the other
          // section, switch the data views in this section and the other one
          setDataView1(dataView4);
        } else if (event.target.value === document.getElementById("dataViewSelect2").value) {
          // If trying to switch to a data view that is already being displayed in the other
          // section, switch the data views in this section and the other one
          setDataView2(dataView4);
        } else if (event.target.value === document.getElementById("dataViewSelect3").value) {
          // If trying to switch to a data view that is already being displayed in the other
          // section, switch the data views in this section and the other one
          setDataView3(dataView4);
        }
      }
      setDataView4(event.target.value);
    }
  };

  // Choose the data view to return/display based on the given option
  const switchDataView = (optionValue) => {
    if (optionValue === "battery_pack") {
      return <BatteryPack data={state.data} />; // TODO Split up
    } else if (optionValue === "cell_groups") {
      return <BatteryCells data={state.data} />; // TODO Split up
    } else if (optionValue === "ppc_mppt") {
      return <PPC_MPPT data={state.data}/>; // TODO Check
    } else if (optionValue === "driver_comms") {
      return <DriverComms data={state.data}/>; // TODO Check
    } else if (optionValue === "io_boards") {
      return <IOView data={state.data}/>; // TODO Check
    } else {
      return <Box />;
    }
  };

  /*TODO const getRecordedData = async () => {
    const response = await fetch("/get-recorded-data");
    if (response.status === 200) {
      console.log("--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
      const body = response.json();
      return body
    } else {
      console.log("Error getting Rec data")
    }
    return null;
  };*/

  const {colorMode} = useColorMode();

  // TODO Just make the overall colorscheme change. Separate light and dark colors into two objects in colors.js.
  //      Then, use the same names within those objects, and set a generic value (e.g. themeColors) to either
  //      colors.light or colors.dark, depending on colorMode. Also, memoize colorTheme based on colorMode so it doesn't
  //      reevaluate the value all the time
  const colorPalette = colorMode === "light" ? colors.light : colors.dark;

  //const [selColors, setSelColors] = useState({tl: colorPalette.selectTxt, tr: colorPalette.selectTxt, bl: colorPalette.selectTxt, br: colorPalette.selectTxt});

  const [selColorStr1, setSelColorStr1] = useState(colorPalette.selectTxt);
  const [selColorStr2, setSelColorStr2] = useState(colorPalette.selectTxt);
  const [selColorStr3, setSelColorStr3] = useState(colorPalette.selectTxt);
  const [selColorStr4, setSelColorStr4] = useState(colorPalette.selectTxt);

  const [selectFocus, setSelectFocus] = useState("");

  const _updateSelColor = (targetId, newColor) => {
    switch (targetId) {
      case "dataViewSelect1":
        setSelColorStr1(newColor);
        break;
      case "dataViewSelect2":
        setSelColorStr2(newColor);
        break;
      case "dataViewSelect3":
        setSelColorStr3(newColor);
        break;
      case "dataViewSelect4":
        setSelColorStr4(newColor);
        break;
    }
  }

  const removeSelectFocus = (event) => {
    setSelectFocus("");
    _updateSelColor(event.target.id, colorPalette.selectTxt);
  }

  const changeSelColor = (event) => {
    if(selectFocus !== event.target.id)
      _updateSelColor(event.target.id, colorPalette.selectTxtFocus);
  }

  const changeSelColorBack = (event) => {
    if (selectFocus !== event.target.id)
      _updateSelColor(event.target.id, colorPalette.selectTxt);
  }

  return (
    <HStack h="100vh" w="100vw" align="stretch" spacing={0}>
      <Grid margin={0.5} gap={1} flex="1 1 0" templateRows="2fr 3fr 3fr" templateColumns="1fr 1fr" >
        <GridItem
          minH="min-content"
          rowStart={1}
          rowSpan={1}
          colStart={1}
          colSpan={2}
          borderColor={colorPalette.border}
          borderWidth={1}
          p={2}
        >
          {/*TODO
          <Button width={"auto"} colorScheme='blue' size='sm' onClick={async () => {
            //if(false) getRecordedData() // TODO
            //if (currentSession) {
              getRecordedData().then((res) => {
                if (res.response) {
                  //setRecordedData({ data: res.response });
                  //console.log("Rec Data::", res.response);
                  localStorage.setItem("recordedData", res.response)
                }
              }).catch((err) => console.log(err));
            //} else {
            //  alert("Please select a session to get the data from")
            //}

          }}> Get session data</Button>*/}

          <Popover>
            <PopoverTrigger>
              <Button>
                Open Data Recording Stuff
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverCloseButton/>
              <PopoverBody>
                <VStack>

                  <HStack style={{ marginBottom: "0.5em" }}>
                    <Select
                        width={"15em"}
                        placeholder={"Select session to view"}
                        value={currentSession}

                        onChange={(e) => {
                          setCurrentRecordingSession(e.target.value)
                        }}>
                      {sessionsList?.data?.map((name, i) => {
                        return (<option key={i} value={name}>{name}</option>)
                      })}

                    </Select>
                    <Button width={"auto"} colorScheme='blue' size='sm' onClick={onOpen}>+ Create</Button>
                  </HStack>
                  {
                    currentSession ?
                        <>

                          <HStack>
                            <Button width={"auto"} colorScheme='blue' size='sm' onClick={async () => {
                              if (currentSession) {
                                getRecordedData().then((res) => {
                                  if (res.response) {
                                    setRecordedData({ data: res.response });
                                    console.log("Rec Data::", res.response);
                                    localStorage.setItem("recordeData", JSON.stringify(res.response))
                                  }
                                }).catch((err) => console.log(err));
                              } else {
                                alert("Please select a session to get the data from")
                              }

                            }}> Get session data</Button>

                            <Button width={"auto"} colorScheme='blue' size='sm'
                                    onClick={() => { if (currentSession) { recordCarData() } else { alert("No session created or selected") } }}>
                              <BsFillRecordCircleFill color={isRecording ? "red" : null} />
                            </Button>

                          </HStack>

                          {
                            recordedData.data ?
                                <>
                                  <HStack>
                                    <Button width={"auto"} colorScheme='blue' size='sm' onClick={() => playData()} > <FaPlay /> </Button>
                                    <Button width={"auto"} colorScheme='blue' size='sm' onClick={() => pause()}><FaPause /> </Button>
                                    <Button width={"auto"} colorScheme='blue' size='sm' onClick={() => stop()}><FaStop /></Button>

                                  </HStack>
                                  <Box><span>Data Frames: {framePointer}/{recordedData.data?.length}</span></Box>
                                </>
                                : null
                          }

                        </>
                        : null
                  }
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          {/* Create new session popup */}
          <Modal
              initialFocusRef={initialRef}
              finalFocusRef={finalRef}
              isOpen={isOpen}
              onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create recording session</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>File name</FormLabel>
                  <Input ref={initialRef} placeholder='File name' onChange={(e) => {
                    setSessionFileName(e.target.value)
                  }} />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={() => {
                  if (sessionFileName == "") {
                    alert("Error: Empty feild")
                    return
                  }
                  createRecordingSession(sessionFileName);
                  onClose()
                }}>
                  Create
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>


          <FaultsView data={state.data} />
        </GridItem>
        <GridItem
          minH="min-content"
          rowStart={2}
          rowSpan={1}
          colStart={1}
          colSpan={1}
          borderColor={colorPalette.border}
          borderWidth={1}
          display="flex"
          flexDir="column"
        >
          <Select
            id="dataViewSelect1"
            size="xs"
            variant="filled"
            bgColor={colorPalette.selectBg}
            color={selColorStr1}
            focusBorderColor={colorPalette.border}
            value={dataView1}
            onFocus={() => {setSelectFocus("dataViewSelect1")}}
            onBlur={removeSelectFocus}
            onMouseEnter={changeSelColor}
            onMouseLeave={changeSelColorBack}
            onChange={selectDataView}
          >
            <DataViewOptions txtColor={colorPalette.optionTxt} />
          </Select>
          {switchDataView(dataView1)}
        </GridItem>
        <GridItem
          minH="fit-content"
          rowStart={2}
          rowSpan={1}
          colStart={2}
          colSpan={1}
          borderColor={colorPalette.border}
          borderWidth={1}
          display="flex"
          flexDir="column"
        >
          <Select
            id="dataViewSelect2"
            size="xs"
            variant="filled"
            bgColor={colorPalette.selectBg}
            color={selColorStr2}
            focusBorderColor={colorPalette.border}
            value={dataView2}
            onFocus={() => {setSelectFocus("dataViewSelect2")}}
            onBlur={removeSelectFocus}
            onMouseEnter={changeSelColor}
            onMouseLeave={changeSelColorBack}
            onChange={selectDataView}
          >
            <DataViewOptions txtColor={colorPalette.optionTxt} />
          </Select>
            {switchDataView(dataView2)}
        </GridItem>
        <GridItem
            minH="min-content"
            rowStart={3}
            rowSpan={1}
            colStart={1}
            colSpan={1}
            borderColor={colorPalette.border}
            borderWidth={1}
            display="flex"
            flexDir="column"
        >
          <Select
              id="dataViewSelect3"
              size="xs"
              variant="filled"
              bgColor={colorPalette.selectBg}
              color={selColorStr3}
              focusBorderColor={colorPalette.border}
              value={dataView3}
              onFocus={() => {setSelectFocus("dataViewSelect3")}}
              onBlur={removeSelectFocus}
              onMouseEnter={changeSelColor}
              onMouseLeave={changeSelColorBack}
              onChange={selectDataView}
          >
            <DataViewOptions txtColor={colorPalette.optionTxt} />
          </Select>
          {switchDataView(dataView3)}
        </GridItem>
        <GridItem
            minH="min-content"
            rowStart={3}
            rowSpan={1}
            colStart={2}
            colSpan={1}
            borderColor={colorPalette.border}
            borderWidth={1}
            display="flex"
            flexDir="column"
        >
          <Select
              id="dataViewSelect4"
              size="xs"
              variant="filled"
              bgColor={colorPalette.selectBg}
              color={selColorStr4}
              focusBorderColor={colorPalette.border}
              value={dataView4}
              onFocus={() => {setSelectFocus("dataViewSelect4")}}
              onBlur={removeSelectFocus}
              onMouseEnter={changeSelColor}
              onMouseLeave={changeSelColorBack}
              onChange={selectDataView}
          >
            <DataViewOptions txtColor={colorPalette.optionTxt} />
          </Select>
          {switchDataView(dataView4)}
        </GridItem>
      </Grid>
      <GraphContainer
        queue={queue}
        latestTime={latestTimestamp}
        flex="2 2 0"
        maxW="67vw"
        selectBg={colorPalette.selectBg}
        selectTxt={colorPalette.selectTxt}
        selectTxtFocus={colorPalette.selectTxtFocus}
        optionTxt={colorPalette.optionTxt}
        borderCol={colorPalette.border}
      />
    </HStack>
  );
}

function DataViewOptions(props) {
  return (
    <>
      <option style={{color: props.txtColor}} value="">Select option</option>
      <option style={{color: props.txtColor}} value="battery_pack">BMS - Battery Pack</option>
      <option style={{color: props.txtColor}} value="cell_groups">BMS - Cell Groups</option>
      <option style={{color: props.txtColor}} value="ppc_mppt">PPC and MPPT</option>
      <option style={{color: props.txtColor}} value="driver_comms">Driver/Cabin and Communication</option>
      <option style={{color: props.txtColor}} value="io_boards">I/O Boards</option>
      {/*TODO=======
      <option value="general">General Data</option>
      <option value="battery">Battery Cells</option>
      <option value="minimap">Minimap</option>
    </>
  );
}

function GraphOptions(props) {
  let customGraphs = [];

  for (const title in props.customGraphs) {
    customGraphs.push(
      <option value={title} >{title}</option>
    );
  }

  return (
    <>
      <option value="battery">Battery</option>
      <option value="power">Power</option>
      <option value="temperature">Temperature</option>
      {customGraphs}
      <option value="custom">Custom</option>
>>>>>>> sw-10-to-merge*/}
    </>
  );
}
