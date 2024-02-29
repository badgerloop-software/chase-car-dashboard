import { Map, Marker, Polyline, GoogleApiWrapper } from "google-maps-react";

let coords = [];
let values = [];

function getCoordsAndValue() {
  // call api to get new coords and new other value

  coords.push({ lat: 25.774, lng: -80.19 });
  coords.push({ lat: 18.466, lng: -66.118 });
  coords.push({ lat: 32.321, lng: -64.757 });
  coords.push({ lat: 25.774, lng: -80.19 });

  values.push(100);

  // is this return necessary? CarMap() can just get the coords and values since global variables
  return coords, values;
}

function calculateColor(value) {
  // calculate polyline color based on value
  return "#000000";
}

function CarMap() {
  let { coords, values } = getCoordsAndValue();
  let color = calculateColor(values.slice(-1));
  const mapStyles = {};

  return (
    <Map
      google={window.google}
      zoom={8}
      style={mapStyles}
      initialCenter={{ lat: 47.444, lng: -122.176 }}
    >
      <Marker position={{ lat: 48.0, lng: -122.0 }} />
      <Polyline
        path={coords}
        strokeColor={color}
        strokeOpacity={1}
        strokeWeight={10}
      />
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: "API_KEY_HERE",
})(CarMap);

// figure out how to update polyline coordinates and color based on new data, i.e. how does it refresh new data?

// poly line with different color gradient to represent another value along car's path
// add function in here to get data from backend (make new api file similar to graph_api.py)
// then call lat, lon, and some value from format.json
