import {
  Box,
  Grid,
  GridItem,
  HStack,
  Select,
  useColorMode
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FaultsView from "../Faults/FaultsView";
import Communication from "../Communication/Communication";
import BatteryCells from "../BatteryCells/BatteryCells";
import BatteryPack from "../BatteryPack/BatteryPack";
import PPC_MPPT from "../PPC_MPPT/PPC_MPPT";
import SystemPower from "../SystemPower/SystemPower"
import Motor_Motion from "../Motor_Motion/Motor_Motion";
import GraphContainer from "./GraphContainer";
import DataRecordingControl from "./DataRecordingControl";
import Temperature from "../Temperature/Temperature";
import dvOptions from "./dataViewOptions";
import getColor from "../Shared/colors";
import { ROUTES } from "../Shared/misc-constants";
import fauxQueue from "../Graph/faux-queue.json";

// prevent accidental reloading/closing
window.onbeforeunload = () => true;


/**
 * Requests the single values API endpoint and returns the response
 * @returns the JSON response from the single values API
 */
async function callBackendSingleValuesAPI() {
  // console.time("single values http call");

  const response = await fetch(ROUTES.GET_SINGLE_VALUES);
  // console.timeLog("single values http call", "fetch finished");
  const body = await response.json();
  // console.timeLog("single values http call", "json extracted");

  if (response.status !== 200) {
    console.error("single values api: error");
    throw Error(body.message);
  }

  // console.timeEnd("single values http call");
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
  const [fetchDep, setFetchDep] = useState(false);
  const [state, setState] = useState({ data: null });
  useEffect(() => {
    callBackendSingleValuesAPI()
        .then((res) => {
          //console.time("update react");

          // when the car/data generator is offline, res.response is going to be null
          setState({ data: res.response });

          //console.timeEnd("update react");
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setFetchDep((oldFetchDep) => !oldFetchDep);
        });
  }, [fetchDep]);

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
        return <BatteryPack data={state.data} />;
      case dvOptions.cell_groups:
        return <BatteryCells data={state.data} />;
      case dvOptions.ppc_mppt:
        return <PPC_MPPT data={state.data}/>;
      case dvOptions.communication:
        return <Communication data={state.data}/>;
      case dvOptions.system_power:
        return <SystemPower data={state.data}/>;
      case dvOptions.motor_motion:
        return <Motor_Motion data={state.data}/>
      case dvOptions.temperature:
        return <Temperature data={state.data}/>
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

function DataViewOptions(props) {
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
}
