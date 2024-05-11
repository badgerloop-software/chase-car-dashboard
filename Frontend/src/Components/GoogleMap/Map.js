import { Map, Marker, Polyline, GoogleApiWrapper } from "google-maps-react";
import { useCallback } from "react";
import { useEffect, useMemo, useState } from "react";
import {useInterval, Box, Menu, MenuItem, Button, MenuButton, MenuList } from "@chakra-ui/react";
import CONSTANTS from "../../data-constants.json";
import { BsChevronDown } from "react-icons/bs";

function CarMap() {
  const [mapPath, setMapPath] = useState([]);
  const [pathColor, setPathColor] = useState([]);
  const [selectedData, setSelectedData] = useState("speed");
  const [selectedDuration, setSelectedDuration] = useState("60");

  const mapStyles = {
  };

  const allowedDuration = {
    60: "1min",
    180: "3min",
    300: "5min",
    600: "10min",
    1200: "20min",
    1800: "30min"
  }

  const refreshMap = () => {
    console.log("refreshmap")
    fetch(`/components/maps?data=${selectedData}&duration=${selectedDuration}`)
    .then(response => {
      if (response.ok) {
          return response.json();
      } else {
          throw new Error(`Error fetching map with response ${response.status}`);
      }
    })
    .then((body) => {
        setPathColor(body["color"])
        setMapPath(body["coords"])
    }).catch(error => console.error('Fetch error:', error));
  }

  // fetch and update the map every second
  useInterval(refreshMap, 1000)

  //generate the map polyline
  const getLines = () => {
    let lines = [];
    for(let i = 0 ; i < mapPath.length - 1; i++) {
      lines.push(<Polyline
        path={[mapPath[i], mapPath[i + 1]]}
        strokeColor={pathColor[i]}
        strokeOpacity={1}
        strokeWeight={5}
      />)
    }
    return lines
  }

  // selector overlay on the map
  const overlay = () => {
    return (
      <div>
        <Box
          zIndex='overlay'
          position='absolute'
          top='10px'
          right='180px'
          height='40px'
          display="flex"
          alignItems="center"
        >
          <Menu>
            <MenuButton 
              as={Button} 
              rightIcon={<BsChevronDown/>}
              defaultValue = {"select"}
            >
              {selectedData}
            </MenuButton>
            <MenuList maxHeight="15rem" overflowY="scroll">
              {Object.keys(CONSTANTS).map((item, i) => {
                return <MenuItem
                  key={item}
                  onClick={()=>setSelectedData(item)}
                  >{item}
                  </MenuItem>
              })}
            </MenuList>
          </Menu>
        </Box>
        <Box
          zIndex='overlay'
          position='absolute'
          top='10px'
          right='70px'
          height='40px'
          display="flex"
          alignItems="center" // Align vertically
        >
          <Menu>
            <MenuButton 
              as={Button} 
              rightIcon={<BsChevronDown/>}
              defaultValue = {"60"}
            >
              {allowedDuration[selectedDuration]}
            </MenuButton>
            <MenuList maxHeight="15rem" overflowY="scroll">
              {Object.keys(allowedDuration).map((item, i) => {
                return <MenuItem
                  key={item}
                  onClick={()=>setSelectedDuration(item)}
                  >{allowedDuration[item]}
                  </MenuItem>
              })}
            </MenuList>
          </Menu>
        </Box>
      </div>
    )
  }
  

  const getMap = (mapPath)=>{
    return (
      <div style={{position: "absolute", height: '31%', width: '66.6%'}}>
        {overlay()}
        <Map
          google={window.google}
          zoom={13}
          style={mapStyles}
          center={mapPath[mapPath.length-1]}
          streetViewControl={false}
          mapType='terrain'
        >
          {getLines()}
        </Map>
      </div>
    );
  }

  return useCallback(getMap(mapPath, pathColor), [mapPath, pathColor])
}

export default GoogleApiWrapper({
  apiKey: "YOUR_API_KEY",
})(CarMap);