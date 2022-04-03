import {
  Grid, GridItem, VStack, HStack, Select, Button, ButtonGroup, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormLabel,
  FormControl,
  useDisclosure
} from "@chakra-ui/react";
import React, { useState, useLayoutEffect, useEffect } from "react";
import FaultsView from "../Faults/FaultsView";
import DataView from "../GeneralData/DataView";
import BatteryCells from "../BatteryCells/BatteryCells";
import MiniMap from "../MiniMap/MiniMap";
import BatteryGraph from "../Graph/BatteryGraph";
import PowerGraph from "../Graph/PowerGraph";
import TemperatureGraph from "../Graph/TemperatureGraph";
import CustomGraph from "../Graph/CustomGraph";

export default function Dashboard(props) {
  //-------------- Fetching data from backend and updating state/data --------------
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef()
  const finalRef = React.useRef()

  const callBackendAPI = async () => {
    const response = await fetch("/api");
    const body = await response.json();
    // console.log("gen data",body)

    if (response.status !== 200) {
      console.error("api: error");
      throw Error(body.message);
    }

    return body;
  };
  const getSessionsList= async () => {
    const response = await fetch("/getSessionList");
    if (response.status === 200) {
      const body = await response.json();
      return body
    }
    return null;
  };
  const getRecordedData = async () => {
    const response = await fetch("/get-recorded-data");
    if (response.status === 200) {
      const body = await response.json();
      return body
    } else{
      console.log("Error getting Rec data")
    }
    return null;
  };

  const [state, setState] = useState({ data: null });
  const [recordedData, setRecordedData] = useState({ data: null });
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingSessionCreated, setIsRecordingSessionCreated] = useState(false);
  const [sessionFileName, setSessionFileName] = useState("");

  useLayoutEffect(() => {
    callBackendAPI().then((res) => {
      setState({ data: res.response });
      // console.log("api::", res.response);
    }).catch((err) => console.log("/api error",err));

   
  }, [state]);


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
        alert("Session file has been created!!")
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

  const [dataView1, setDataView1] = React.useState("");
  const [dataView2, setDataView2] = React.useState("");

  // Update the value indicating which data view to display when an option is selected
  const selectDataView = (event) => {
    if (event.target.id === "dataViewSelect1") {
      // Avoid duplicate data views, unless they are both empty
      if (
        event.target.value ===
        document.getElementById("dataViewSelect2").value &&
        event.target.value !== ""
      ) {
        // If trying to switch to a data view that is already being displayed in the other
        // section, switch the data views in this section and the other one
        setDataView2(dataView1);
        console.log(event.target.value.toString());
      }
      setDataView1(event.target.value);
    } else if (event.target.id === "dataViewSelect2") {
      // Avoid duplicate data views, unless they are both empty
      if (
        event.target.value ===
        document.getElementById("dataViewSelect1").value &&
        event.target.value !== ""
      ) {
        // If trying to switch to a data view that is already being displayed in the other
        // section, switch the data views in this section and the other one
        setDataView1(dataView2);
      }
      setDataView2(event.target.value);
    }
  };

  // Choose the data view to return/display based on the given option
  const switchDataView = (optionValue) => {
    if (optionValue === "general") {
      return <DataView data={state.data} />;
    } else if (optionValue === "battery") {
      return <BatteryCells data={state.data} />;
    } else if (optionValue === "minimap") {
      return <MiniMap />;
    } else {
      return <VStack />;
    }
  };

  //------------------- Choosing graphs using Select components -------------------

  const [graph1, setGraph1] = React.useState("");
  const [graph2, setGraph2] = React.useState("");
  const [graph3, setGraph3] = React.useState("");

  // Update the value indicating which graph to display when an option is selected
  const selectGraph = (event) => {
    if (event.target.id === "graphSelect1") {
      // Avoid duplicate graphs, unless they are both empty or custom
      if ((event.target.value !== "") && (event.target.value !== "custom")) {
        // If trying to switch to a graph that is already being displayed in another
        // section, switch the graphs in this section and the other one
        switch (event.target.value) {
          case document.getElementById("graphSelect2").value:
            setGraph2(graph1);
            break;
          case document.getElementById("graphSelect3").value:
            setGraph3(graph1);
            break;
          // default:
          //   break;
        }
      }
      setGraph1(event.target.value);
    } else if (event.target.id === "graphSelect2") {
      // Avoid duplicate graphs, unless they are both empty or custom
      if ((event.target.value !== "") && (event.target.value !== "custom")) {
        // If trying to switch to a graph that is already being displayed in another
        // section, switch the graphs in this section and the other one
        switch (event.target.value) {
          case document.getElementById("graphSelect1").value:
            setGraph1(graph2);
            break;
          case document.getElementById("graphSelect3").value:
            setGraph3(graph2);
            break;
          // default:
          //   break;
        }
      }
      setGraph2(event.target.value);
    } else if (event.target.id === "graphSelect3") {
      // Avoid duplicate graphs, unless they are both empty or custom
      if ((event.target.value !== "") && (event.target.value !== "custom")) {
        // If trying to switch to a graph that is already being displayed in another
        // section, switch the graphs in this section and the other one
        switch (event.target.value) {
          case document.getElementById("graphSelect1").value:
            setGraph1(graph3);
            break;
          case document.getElementById("graphSelect2").value:
            setGraph2(graph3);
            break;
          // default:
          //   break;
        }
      }
      setGraph3(event.target.value);
    }
  };

  // Choose the graph to return/display based on the given option
  const switchGraph = (optionValue) => {
    if (optionValue === "battery") {
      return <BatteryGraph data={state.data} />;
    } else if (optionValue === "power") {
      return <PowerGraph data={state.data} />;
    } else if (optionValue === "temperature") {
      return <TemperatureGraph data={state.data} />;
    } else if (optionValue === "custom") {
      return <CustomGraph
        id=""
        data={state.data}
        title=""
        buttons={[]}
        datasets={[]}
        save={saveCustomGraph}
      />;
    } else if (optionValue in customGraphData) {
      return <CustomGraph
        id={optionValue}
        data={state.data}
        title={optionValue}
        buttons={customGraphData[optionValue].buttons}
        datasets={customGraphData[optionValue].datasets}
        save={saveCustomGraph}
      />;
    }
  };

  //------------------------- Saving custom graphs ----------------------------

  const [customGraphData, setCustomGraphData] = React.useState({});

  const saveCustomGraph = (data) => {
    let graphData = customGraphData;

    graphData[data.title] = data;

    setCustomGraphData(graphData);
  };

  return (
    <Grid templateColumns="1fr 2fr" h="100vh" w="100vw">
      {"(test) Is recording: " + isRecording}
      <HStack>
      <Button width={"15em"} colorScheme='blue' size='sm' onClick={async () => {
         getRecordedData().then((res) => {
          if (res.response) {
            setRecordedData({ data: res.response });
            localStorage.setItem("recordeData", JSON.stringify(res.response))
            console.log("Rec Data::", res);
          }
        }).catch((err) => console.log(err));
      }}>(test)Get Rec Data</Button>
        <Button width={"15em"} colorScheme='blue' size='sm' onClick={onOpen}>(test) Create session file</Button>
        <Button width={"15em"} colorScheme='blue' size='sm' onClick={() => { recordCarData() }}>(test) {isRecording ? "Stop" : "Start"} recording session</Button>
      </HStack>
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


      <GridItem colStart={1} colSpan={1}>
        <Grid h="100vh" templateRows="1fr 3fr">
          <GridItem
            rowStart={1}
            rowSpan={1}
            borderColor="black"
            borderWidth={1}
            p={2}
          >
            <FaultsView data={state.data} />
          </GridItem>
          <GridItem rowStart={2} rowSpan={1}>
            <VStack
              align="stretch"
              spacing={0}
              borderColor="black"
              borderWidth={1}
            >
              <Select
                id="dataViewSelect1"
                size="xs"
                variant="filled"
                bgColor="grey.300"
                placeholder="Select option"
                value={dataView1}
                onChange={selectDataView}
              >
                <DataViewOptions />
              </Select>
              {switchDataView(dataView1)}
            </VStack>
            <VStack
              align="stretch"
              spacing={0}
              borderColor="black"
              borderWidth={1}
            >
              <Select
                id="dataViewSelect2"
                size="xs"
                variant="filled"
                bgColor="grey.300"
                placeholder="Select option"
                value={dataView2}
                onChange={selectDataView}
              >
                <DataViewOptions />
              </Select>
              {switchDataView(dataView2)}
            </VStack>
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem colStart={2} colSpan={1}>
        <Grid h="100vh" templateRows="repeat(3, 1fr)">
          <VStack
            h="100%"
            align="stretch"
            spacing={0}
            borderColor="black"
            borderWidth={1}
          >
            <Select
              id="graphSelect1"
              size="xs"
              variant="filled"
              bgColor="grey.300"
              placeholder="Select option"
              value={graph1}
              onChange={selectGraph}
            >
              <GraphOptions customGraphs={customGraphData} />
            </Select>
            {switchGraph(graph1)}
          </VStack>
          <VStack
            h="100%"
            align="stretch"
            spacing={0}
            borderColor="black"
            borderWidth={1}
          >
            <Select
              id="graphSelect2"
              size="xs"
              variant="filled"
              bgColor="grey.300"
              placeholder="Select option"
              value={graph2}
              onChange={selectGraph}
            >
              <GraphOptions customGraphs={customGraphData} />
            </Select>
            {switchGraph(graph2)}
          </VStack>
          <VStack
            h="100%"
            align="stretch"
            spacing={0}
            borderColor="black"
            borderWidth={1}
          >
            <Select
              id="graphSelect3"
              size="xs"
              variant="filled"
              bgColor="grey.300"
              placeholder="Select option"
              value={graph3}
              onChange={selectGraph}
            >
              <GraphOptions customGraphs={customGraphData} />
            </Select>
            {switchGraph(graph3)}
          </VStack>
        </Grid>
      </GridItem>
    </Grid>
  );
}

function DataViewOptions(props) {
  return (
    <>
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
    </>
  );
}
