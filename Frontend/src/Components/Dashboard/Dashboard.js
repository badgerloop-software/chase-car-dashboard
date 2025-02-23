import {
  Box,
  Grid,
  GridItem,
  HStack,
  Select,
  useColorMode
} from "@chakra-ui/react";
import { useEffect, useState, Suspense, lazy, memo, useRef } from "react";
import GraphContainer from "./GraphContainer";
import DataRecordingControl from "./DataRecordingControl";
import dvOptions from "./dataViewOptions";
import getColor from "../Shared/colors";
import { ROUTES } from "../Shared/misc-constants";
import FaultsView from "../Faults/FaultsView";
import fauxQueue from "../Graph/faux-queue.json";
const Temperature = lazy(() => import("../Temperature/Temperature"));
const Communication = lazy(() => import("../Communication/Communication"));
const BatteryCells = lazy(() => import("../BatteryCells/BatteryCells"));
const BatteryPack = lazy(() => import("../BatteryPack/BatteryPack"));
const PPC_MPPT = lazy(() => import("../PPC_MPPT/PPC_MPPT"));
const SystemPower = lazy(() => import("../SystemPower/SystemPower"));
const Motor_Motion = lazy(() => import("../Motor_Motion/Motor_Motion"));

// prevent accidental reloading/closing
window.onbeforeunload = () => true;

/**
 * The Dashboard component
 * @param {any} props the props to pass this dashboard component (none are used)
 * @returns the dashboard component
 */
export default function Dashboard(props) {
  //-------------- Fetching data from backend and updating state/data --------------
  const [fetchDep, setFetchDep] = useState(false);
  const [state, setState] = useState({ data: null });
  const ws = useRef(null);
  const [refreshRate, setRefreshRate] = useState(300);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  
  // // open websocket on mount
  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:4001/single-values`);

    ws.current.onmessage = (event) => {
      try {
        const carData = JSON.parse(event.data);
        setState({ data: carData.response });
      } catch {
        console.log('Error recieving data from websocket');
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // close connection on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  },[])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ action: 'getData' }));
      }
    }, 300);

    return () => clearInterval(intervalId);
  }, []);

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
          // If trying to switch to a data view that is already being displayed in the top right section, switch the
          // data views in this section and the other one
          setDataView2(dataView1);
        } else if (event.target.value === document.getElementById("dataViewSelect3").value) {
          // If trying to switch to a data view that is already being displayed in the bottom left section, switch the
          // data views in this section and the other one
          setDataView3(dataView1);
        } else if (event.target.value === document.getElementById("dataViewSelect4").value) {
          // If trying to switch to a data view that is already being displayed in the bottom right section, switch the
          // data views in this section and the other one
          setDataView4(dataView1);
        }
      }
      setDataView1(event.target.value);
    } else if (event.target.id === "dataViewSelect2") {
      // Avoid duplicate data views, unless they are both empty
      if(event.target.value !== "") {
        if (event.target.value === document.getElementById("dataViewSelect1").value) {
          // If trying to switch to a data view that is already being displayed in the top left section, switch the
          // data views in this section and the other one
          setDataView1(dataView2);
        } else if (event.target.value === document.getElementById("dataViewSelect3").value) {
          // If trying to switch to a data view that is already being displayed in the bottom left section, switch the
          // data views in this section and the other one
          setDataView3(dataView2);
        } else if (event.target.value === document.getElementById("dataViewSelect4").value) {
          // If trying to switch to a data view that is already being displayed in the bottom right section, switch the
          // data views in this section and the other one
          setDataView4(dataView2);
        }
      }
      setDataView2(event.target.value);
    } else if (event.target.id === "dataViewSelect3") {
      // Avoid duplicate data views, unless they are both empty
      if(event.target.value !== "") {
        if (event.target.value === document.getElementById("dataViewSelect1").value) {
          // If trying to switch to a data view that is already being displayed in the top left section, switch the
          // data views in this section and the other one
          setDataView1(dataView3);
        } else if (event.target.value === document.getElementById("dataViewSelect2").value) {
          // If trying to switch to a data view that is already being displayed in the top right section, switch the
          // data views in this section and the other one
          setDataView2(dataView3);
        } else if (event.target.value === document.getElementById("dataViewSelect4").value) {
          // If trying to switch to a data view that is already being displayed in the bottom right section, switch the
          // data views in this section and the other one
          setDataView4(dataView3);
        }
      }
      setDataView3(event.target.value);
    } else if (event.target.id === "dataViewSelect4") {
      // Avoid duplicate data views, unless they are both empty
      if(event.target.value !== "") {
        if (event.target.value === document.getElementById("dataViewSelect1").value) {
          // If trying to switch to a data view that is already being displayed in the top left section, switch the
          // data views in this section and the other one
          setDataView1(dataView4);
        } else if (event.target.value === document.getElementById("dataViewSelect2").value) {
          // If trying to switch to a data view that is already being displayed in the top right section, switch the
          // data views in this section and the other one
          setDataView2(dataView4);
        } else if (event.target.value === document.getElementById("dataViewSelect3").value) {
          // If trying to switch to a data view that is already being displayed in the bottom left section, switch the
          // data views in this section and the other one
          setDataView3(dataView4);
        }
      }
      setDataView4(event.target.value);
    }
  };

  // Choose the data view to return/display based on the given option
  const switchDataView = (optionValue) => {
    switch(optionValue) {
      case dvOptions.battery_pack:
        return <Suspense fallback={<div>Loading...</div>}><BatteryPack data={state.data} /></Suspense>;
      case dvOptions.cell_groups:
        return <Suspense fallback={<div>Loading...</div>}><BatteryCells data={state.data} /></Suspense>;
      case dvOptions.ppc_mppt:
        return <Suspense fallback={<div>Loading...</div>}><PPC_MPPT data={state.data}/></Suspense>;
      case dvOptions.communication:
        return <Suspense fallback={<div>Loading...</div>}><Communication data={state.data}/></Suspense>;
      case dvOptions.system_power:
        return <Suspense fallback={<div>Loading...</div>}><SystemPower data={state.data}/></Suspense>;
      case dvOptions.motor_motion:
        return <Suspense fallback={<div>Loading...</div>}><Motor_Motion data={state.data}/></Suspense>;
      case dvOptions.temperature:
        return <Suspense fallback={<div>Loading...</div>}><Temperature data={state.data}/></Suspense>;
      case dvOptions.select:
        return <Box />;
      default:
        console.warn("Default case in switchDataView was reached");
        // Return a red box to make it clear that whatever option is selected is invalid
        return <Box h="100%" w="100%" bgColor="#ff0000" />;
    }
  };

  // Get system color mode
  const {colorMode} = useColorMode();
  // Get colors depending on color mode
  const borderCol = getColor("border", colorMode);
  const selectTxtCol = getColor("selectTxt", colorMode);
  const selectTxtFocusCol = getColor("selectTxtFocus", colorMode);
  const selectBgCol = getColor("selectBg", colorMode);
  const optionTxtCol = getColor("optionTxt", colorMode);

  // Select colors
  const [selColorStr1, setSelColorStr1] = useState(selectTxtCol);
  const [selColorStr2, setSelColorStr2] = useState(selectTxtCol);
  const [selColorStr3, setSelColorStr3] = useState(selectTxtCol);
  const [selColorStr4, setSelColorStr4] = useState(selectTxtCol);

  // selectFocus indicates which select currently has focus
  const [selectFocus, setSelectFocus] = useState("");

  // Update select color when the select's state changes
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

  // Reset selectFocus and change the color of the select that just lost focus
  const removeSelectFocus = (event) => {
    setSelectFocus("");
    _updateSelColor(event.target.id, selectTxtCol);
  }

  // Change the color of a select to a color appropriate to when it has focus
  const changeSelColor = (event) => {
    if(selectFocus !== event.target.id)
      _updateSelColor(event.target.id, selectTxtFocusCol);
  }

  // Change the color of a select to a color appropriate to when it does not have focus
  const changeSelColorBack = (event) => {
    if (selectFocus !== event.target.id)
      _updateSelColor(event.target.id, selectTxtCol);
  }

  return (
    <HStack h="100vh" w="100vw" align="stretch" spacing={0}>

      <DataRecordingControl/>

      <Grid margin={0.5} gap={1} flex="1 1 0" templateRows="2fr 3fr 3fr" templateColumns="1fr 1fr" >
        <GridItem
          minH="min-content"
          rowStart={1}
          rowSpan={1}
          colStart={1}
          colSpan={2}
          borderColor={borderCol}
          borderWidth={1}
          p={2}
        >
          <FaultsView data={state.data} />
        </GridItem>
        <GridItem
          minH="min-content"
          rowStart={2}
          rowSpan={1}
          colStart={1}
          colSpan={1}
          borderColor={borderCol}
          borderWidth={1}
          display="flex"
          flexDir="column"
        >
          <Select
            id="dataViewSelect1"
            size="xs"
            variant="filled"
            bgColor={selectBgCol}
            color={selColorStr1}
            focusBorderColor={borderCol}
            value={dataView1}
            onFocus={() => {setSelectFocus("dataViewSelect1")}}
            onBlur={removeSelectFocus}
            onMouseEnter={changeSelColor}
            onMouseLeave={changeSelColorBack}
            onChange={selectDataView}
          >
            <DataViewOptions txtColor={optionTxtCol} />
          </Select>
          {switchDataView(dataView1)}
        </GridItem>
        <GridItem
          minH="fit-content"
          rowStart={2}
          rowSpan={1}
          colStart={2}
          colSpan={1}
          borderColor={borderCol}
          borderWidth={1}
          display="flex"
          flexDir="column"
        >
          <Select
            id="dataViewSelect2"
            size="xs"
            variant="filled"
            bgColor={selectBgCol}
            color={selColorStr2}
            focusBorderColor={borderCol}
            value={dataView2}
            onFocus={() => {setSelectFocus("dataViewSelect2")}}
            onBlur={removeSelectFocus}
            onMouseEnter={changeSelColor}
            onMouseLeave={changeSelColorBack}
            onChange={selectDataView}
          >
            <DataViewOptions txtColor={optionTxtCol} />
          </Select>
            {switchDataView(dataView2)}
        </GridItem>
        <GridItem
            minH="min-content"
            rowStart={3}
            rowSpan={1}
            colStart={1}
            colSpan={1}
            borderColor={borderCol}
            borderWidth={1}
            display="flex"
            flexDir="column"
        >
          <Select
              id="dataViewSelect3"
              size="xs"
              variant="filled"
              bgColor={selectBgCol}
              color={selColorStr3}
              focusBorderColor={borderCol}
              value={dataView3}
              onFocus={() => {setSelectFocus("dataViewSelect3")}}
              onBlur={removeSelectFocus}
              onMouseEnter={changeSelColor}
              onMouseLeave={changeSelColorBack}
              onChange={selectDataView}
          >
            <DataViewOptions txtColor={optionTxtCol} />
          </Select>
          {switchDataView(dataView3)}
        </GridItem>
        <GridItem
            minH="min-content"
            rowStart={3}
            rowSpan={1}
            colStart={2}
            colSpan={1}
            borderColor={borderCol}
            borderWidth={1}
            display="flex"
            flexDir="column"
        >
          <Select
              id="dataViewSelect4"
              size="xs"
              variant="filled"
              bgColor={selectBgCol}
              color={selColorStr4}
              focusBorderColor={borderCol}
              value={dataView4}
              onFocus={() => {setSelectFocus("dataViewSelect4")}}
              onBlur={removeSelectFocus}
              onMouseEnter={changeSelColor}
              onMouseLeave={changeSelColorBack}
              onChange={selectDataView}
          >
            <DataViewOptions txtColor={optionTxtCol} />
          </Select>
          {switchDataView(dataView4)}
        </GridItem>
      </Grid>
      <GraphContainer
        flex="2 2 0"
        maxW="67vw"
        selectBg={selectBgCol}
        selectTxt={selectTxtCol}
        selectTxtFocus={selectTxtFocusCol}
        optionTxt={optionTxtCol}
        borderCol={borderCol}
      />
    </HStack>
  );
}

const DataViewOptions = memo(function DataViewOptions(props) {
  return (
    <>
      <option style={{color: props.txtColor}} value={dvOptions.select}>Select option</option>
      <option style={{color: props.txtColor}} value={dvOptions.battery_pack}>BMS - Battery Pack</option>
      <option style={{color: props.txtColor}} value={dvOptions.cell_groups}>BMS - Cell Groups</option>
      <option style={{color: props.txtColor}} value={dvOptions.ppc_mppt}>PPC and MPPT</option>
      <option style={{color: props.txtColor}} value={dvOptions.communication}>Communication</option>
      <option style={{color: props.txtColor}} value={dvOptions.system_power}>System Power</option>
      <option style={{color: props.txtColor}} value={dvOptions.motor_motion}>Motor/Motion</option>
      <option style={{color: props.txtColor}} value={dvOptions.temperature}>Temperature</option>
    </>
  );
});
