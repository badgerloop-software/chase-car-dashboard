import { Button, Box, Grid, GridItem, HStack, Select, useColorMode } from "@chakra-ui/react";
import { useEffect, useReducer, useState } from "react";
import FaultsView from "../Faults/FaultsView";
import DriverComms from "../GeneralData/DriverComms";
import IOView from "../GeneralData/IOView";
import BatteryCells from "../BatteryCells/BatteryCells";
import BatteryPack from "../BatteryCells/BatteryPack";
import PPC_MPPT from "../PPC_MPPT/PPC_MPPT";
import GraphContainer from "./GraphContainer";
import colors from "../Shared/colors";

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

  // Stringify currentQueue and then parse that string bc stateful objects shouldn't be copied without caution
  let output = JSON.parse(JSON.stringify(currentQueue));

  // Add data from newData to output
  for(const key in newData) {
    if (key === "timestamps" || key.startsWith("tstamp")) continue;

    // If output/currentQueue does not have a certain key yet (i.e. it is the first time data is being added), create the key
    if(!output.hasOwnProperty(key)) {
      output[key] = [];
    }

    // Map the data from newData associated with the current key to a graph-friendly format (x & y values)
    const toAdd = newData[key].map((value, idx) => ({
      x: newData.timestamps[idx],
      y: value,
    }));

    // TODO Would it be worth moving the mapping/processing of the data to GraphContainer.js (and instead just appending
    //      the newest data object to the end of an array of objects) so that it doesn't have to be done on a stateful
    //      object?? I don't know if that would be worth doing
    // Add data to output
    //console.log("output: ", output);
    //console.log("toAdd: ", toAdd);
    output[key] = output[key].concat(toAdd);
    //console.log("output: ", output);
    /*for(const idx in toAdd) {
      output[key].unshift(toAdd[idx]);
    }*/

    if(output[key].length > 18000) {
      output[key].splice(17999, output.length - 18000);
    }
    /*while(output[key].length > 18000) {
      output[key].pop();
    }*/
  }
  //console.log("output: ", output);
  console.log("currentQueue: ", currentQueue);


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

  const [[queue, latestTimestamp], updateQueue] = useReducer(reducer, [
    {},
    null,
  ]);

  // useEffect(() => {
  //   console.log("recieved", latestTimestamp);
  // }, latestTimestamp);

  // TODO The queue, but not part of this component's state
  let output = {};

  const [state, setState] = useState({ data: [] }); // TODO remove and just use queue?
  useEffect(() => {
    callBackendAPI()
      .then((res) => {
        console.time("update react");

        //updateQueue(res.response);
        //setState(state => ({ data: state.data.concat(Array(res.response)) })); // TODO remove and just use queue?
        setState(state => ({ data: [...state.data, res.response] })); // TODO remove and just use queue?
        // console.log("api::", res.response);
        console.log(state.data);


        // TODO The queue, but not as a stateful object
        //let output = {};

        // Add keys to output/queue
        for(const key in state.data[0]) {
          if (key === "timestamps" || key.startsWith("tstamp")) continue;

          //console.log(key);
          // If output/currentQueue does not have a certain key yet (i.e. it is the first time data is being added), create the key
          if(!output.hasOwnProperty(key)) {
            output[key] = [];
          }
          //console.log(key,output[key]);
        }

        // Add data from state.data to output/queue
        for(const dataset in state.data) {
          for(const key in state.data[dataset]) {
            if (key === "timestamps" || key.startsWith("tstamp")) continue;
            //console.log(key,output[key]);
            output[key] = output[key].concat(state.data[dataset][key]);
          }
        }

        console.log(output);

        console.timeEnd("update react");
      })
      .catch((err) => console.log(err));
  }, [state]);

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

  const getRecordedData = async () => {
    const response = await fetch("/get-recorded-data");
    if (response.status === 200) {
      console.log("--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
      const body = response.json();
      return body
    } else {
      console.log("Error getting Rec data")
    }
    return null;
  };

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
      <HStack>
      {/*
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

          }}> Get session data</Button>
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
      {/*<GraphContainer
        queue={queue}
        latestTime={latestTimestamp}
        flex="2 2 0"
        maxW="67vw"
        selectBg={colorPalette.selectBg}
        selectTxt={colorPalette.selectTxt}
        selectTxtFocus={colorPalette.selectTxtFocus}
        optionTxt={colorPalette.optionTxt}
        borderCol={colorPalette.border}
      />*/}
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
    </>
  );
}
