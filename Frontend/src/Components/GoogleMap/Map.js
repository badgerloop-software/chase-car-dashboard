import { Map, Marker, Polyline, GoogleApiWrapper } from "google-maps-react";
import { useCallback } from "react";
import { useEffect, useMemo, useState } from "react";
import {useInterval} from "@chakra-ui/react";
import CONSTANTS from "../../data-constants.json";

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

// https://stackoverflow.com/a/17243070
const HSVtoRGB = (hsv) => {
  const [h, s, v] = hsv;
  let r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  let decimal = [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
  return "#" + componentToHex(decimal[0]) + componentToHex(decimal[1]) + componentToHex(decimal[2]);
};

function calculateColor(dataName, value) {
  // calculate the color value for each segment of the polyline using the value range from dataformat
  let min = CONSTANTS[dataName].MIN;
  let max = CONSTANTS[dataName].MAX;
  
  let color = [];
  for(let i = 0 ; i < value.length - 1; i++) {
    let mean = (value[i] + value[i + 1])/2;
    // calculate percentage within the value range
    let percentage = (mean - min) / (max - min);
    percentage = Math.max(Math.min(1, percentage), Math.max(0, percentage));
    // map to hsv from 0 to 120 for transition from green to red
    console.log(percentage)
    color.push(HSVtoRGB([percentage*0.375, 1, 1]))
  }
  return color;
}

function CarMap() {
  const [mapPath, setMapPath] = useState([]);
  const [pathColor, setPathColor] = useState([]);
  const [selectedData, setSelectedData] = useState("speed");
  const mapStyles = {
  };

  const refreshMap = () => {
    console.log("refreshmap")
    fetch(`/components/maps?data=${selectedData}&duration=60`)
    .then(response => {
      if (response.ok) {
          return response.json();
      } else {
          throw new Error(`Error fetching map with response ${response.status}`);
      }
    })
    .then((body) => {
        setMapPath(body["coords"])
        setPathColor(calculateColor("speed", body["data"]))
    }).catch(error => console.error('Fetch error:', error));
  }


  useInterval(refreshMap, 1000)

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

  const getMap = (mapPath)=>{
    return (
      <div style={{position: "absolute", height: '31%', width: '66.6%'}}>
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

// figure out how to update polyline coordinates and color based on new data, i.e. how does it refresh new data?

// poly line with different color gradient to represent another value along car's path
// add function in here to get data from backend (make new api file similar to graph_api.py)
// then call lat, lon, and some value from format.json
