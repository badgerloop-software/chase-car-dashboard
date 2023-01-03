import { Router } from "express";
import INITIAL_FRONTEND_DATA from "../../Data/cache_data.json";
import INITIAL_SOLAR_CAR_DATA from "../../Data/dynamic_data.json";
import DATA_FORMAT from "../../Data/sc1-data-format/format.json";
import net from "net";
import fetch from 'node-fetch';
// TODO const { Client } = require("cassandra-driver"); // TODO For Cassandra

const ROUTER = Router();
let solarCarData = INITIAL_SOLAR_CAR_DATA,
  frontendData = INITIAL_FRONTEND_DATA;

// Send data to front-end
ROUTER.get("/api", (req, res) => {
  console.time("send http");
  const temp = res.send({ response: frontendData }).status(200);
  temp.addListener("finish", () => console.timeEnd("send http"));
});


//----------------------------------------------------- LTE ----------------------------------------------------------
let interval;
let tableName;
let latestTimestamp;
// Counts for the total number of fetches and successes
let fetchCount = 0;
let successCount = 0;

// TODO Wouldn't be a bad idea to add a simple/small frontend control for refreshing the latest table
//      This would re-fetch newest-timestamp-table and update. This could be useful for avoiding having to restart the
//      backend every time the driver dashboard is restarted. It would also allow the engineering dashboard to be started
//      before the driver dashboard because, if the driver dashboard hasn't started/created a new table yet, the backend
//      will fetch the wrong table using newest-timestamp-table.

async function setupVPSInterface() {
  // Get most recently created table that has a timestamp for a name
  await fetch(`http://host:port/newest-timestamp-table`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      tableName = data.response;
      console.log(`Got table name: ${tableName}`);
    });

  // Get the first timestamp from the table and subtract 1 so that it is included
  // in the first group of retrieved entries
  await fetch(`http://host:port/get-first-timestamp/${tableName}`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // TODO Get first timestamp in table or timestamp 10 minutes before now, whichever is later, for latestTimestamp
      latestTimestamp = data.response - 1;
      console.log(`Got latest timestamp: ${latestTimestamp}`);
    });

  // Fetch the newest rows TODO at regular intervals
  interval = setInterval(() => {
    console.log(`Fetching http://host:port/get-new-rows/${tableName}/${latestTimestamp}`);

    // TODO Maybe put this in a while loop and use `await` instead of having this repeat at constant intervals.
    //      I believe the constant 250ms intervals is what's causing the duplicate datasets: The backend fetches the
    //      same url a second time before the first response is sent back
    //      If a while loop with await fetch() repeats too quickly/blocks the rest of the backend (shouldn't block),
    //      try to set up a *MINIMUM* interval of 250ms

    // Increment the total number of fetches
    fetchCount ++;

    console.log("Fetch:",fetchCount,"\tSuccess:",successCount);

    if(fetchCount === (successCount + 1)) {
      fetch(`http://host:port/get-new-rows/${tableName}/${latestTimestamp}`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json"
        }
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log("Getting new rows", data);

          // Get the rows of timestamps and data from the response
          let rows = data.response;

          // Make sure there was at least 1 row returned
          if(data.response.length > 0) {
            // Iterate through the rows and print the timestamps and payloads
            //                          and unpack the payloads
            let i;
            for(i in rows) {
              console.log('\ttimestamp:', rows[i].timestamp, '\nBytes:', Buffer.from(rows[i].payload.data));
              unpackData(Buffer.from(rows[i].payload.data)); // TODO
            }

            // Update the latest timestamp
            latestTimestamp = rows[i].timestamp;
          }

          // Increment total number of successes
          successCount ++;
          // Reset fetchCount to match successCount so that on the next iteration, the get-new-rows will be fetched
          fetchCount = successCount;

          // TODO Gets the first item of the response
          // console.log('Request succeeded with JSON response', data);
          // TODO console.log('Count:', data.count, '\ttimestamp:', data.tStamp, '\nBytes:', Buffer.from(data.bytes.data));
        })
        .catch(function(error) {
          console.log('Request failed', error);
          // TODO Set fetchCount equal to successCount so that get-new-rows can still be fetched
        });
    }
  }, 250);
}

setupVPSInterface();

/* TODO Remove
let int2 = setInterval(() => {
  console.log("INTERVAL GOOD");
}, 10);*/




/* TODO
interval = setInterval(() => {
  // TODO Is not using a database for this project

  fetch(`http://host:port/get-new-rows/${latestTimestamp}`, {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log("Getting new rows", data);

      // Get the rows of timestamps and data from the response
      let rows = data.response;

      // Make sure there was at least 1 row returned
      if(data.response.length > 0) {
        // Iterate through the rows and print the timestamps and payloads
        //                          and unpack the payloads
        let i;
        for(i in rows) {
          console.log('\ttimestamp:', rows[i].timestamp, '\nBytes:', Buffer.from(rows[i].payload.data));
          unpackData(Buffer.from(rows[i].payload.data)); // TODO
        }

        // Update the latest timestamp
        latestTimestamp = rows[i].timestamp;
      }

      // TODO Gets the first item of the response
      // console.log('Request succeeded with JSON response', data);
      // TODO console.log('Count:', data.count, '\ttimestamp:', data.tStamp, '\nBytes:', Buffer.from(data.bytes.data));
    })
    .catch(function(error) {
      console.log('Request failed', error);
    });

  /*fetch('cloud DB REST API', {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    }
  })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // TODO Gets the first item of the response
        console.log('Request succeeded with JSON response', data.items[0]);
      })
      .catch(function(error) {
        console.log('Request failed', error);
      });*/
// TODO }, 250);


/*
const client = new Client({
  cloud: {
    secureConnectBundle: "./secure-connect-testingforbloop.zip",
  },
  credentials: {
    username: "<<CLIENT ID>>",
    password: "<<CLIENT SECRET>>",
  },
});

async function run() {


  await client.connect();

  // Execute a query
  //const rs = await client.execute("select counter from blooptests.table1 where session='sess5' order by tstamp desc, bytes desc, counter desc limit 1;");
  //console.log('Your cluster returned', rs.rows[0].get("counter"));

  //await client.shutdown();
}

async function execute() {
  // Execute a query
  const rs = await client.execute("select counter from blooptests.table1 where session='sess5' and tstamp='t' and bytes = '010101' and counter > 5000 order by counter desc limit 1;");
  console.log('Your cluster returned', rs.rows[0].get("counter"));
}

// Run the async function
run();*/



//----------------------------------------------------- TCP ----------------------------------------------------------
const CAR_PORT = 4003; // Port for TCP connection
const CAR_SERVER = "localhost"; // TCP server's IP address (Replace with pi's IP address to connect to pi)

// The max number of data points to have in each array at one time
// equivalent to 10 minutes' worth of data being sent 30 Hz
const X_AXIS_CAP = 18_000;

/**
 * Creates a connection with the TCP server at port CAR_PORT and address CAR_SERVER. Then, sets listeners for connect,
 * data, close, and error events. In the event of an error, the client will attempt to re-open the socket at
 * regular intervals.
 */
function openSocket() { /* TODO Uncomment
  // Establish connection with server
  var client = net.connect(CAR_PORT, CAR_SERVER); // TODO Add third parameter (timeout in ms) if we want to timeout due to inactivity
  client.setKeepAlive(true);

  // Connection established listener
  client.on("connect", () => {
    console.log(`Connected to car server: ${client.remoteAddress}:${CAR_PORT}`);
  });

  // Data received listener
  client.on("data", (data) => {
    // console.log(data);
    // TODO In the way: console.time("update data");
    unpackData(data);
    // TODO In the way: console.timeEnd("update data");

    //execute(); // TODO
  });

  // Socket closed listener
  client.on("close", function () {
    // Pull the most recent solar_car_connection values to false if connection was previously established
    if (solarCarData.solar_car_connection.length > 0) {
      solarCarData.solar_car_connection[0] = false;
      frontendData.solar_car_connection[0] = false;
    }

    console.log(`Connection to car server (${CAR_PORT}) is closed`);
  });

  // Socket error listener
  client.on("error", (err) => {
    // Log error
    // TODO Getting in the way of logging response from server
    // TODO console.log("Client errored out:", err);

    // Kill socket
    client.destroy();
    client.unref();

    // Pull the most recent solar_car_connection values to false if connection was previously established
    if (solarCarData.solar_car_connection.length > 0) {
      solarCarData.solar_car_connection[0] = false;
      frontendData.solar_car_connection[0] = false;
    }

    // Attempt to re-open socket
    setTimeout(openSocket, 1000);
  });*/
}

/**
 * Unpacks a Buffer and updates the data to be passed to the front-end
 *
 * @param data the data to be unpacked
 */
function unpackData(data) {
  let buffOffset = 0; // Byte offset for the buffer array
  let timestamps = solarCarData["timestamps"]; // The array of timestamps for each set of data added to solarCarData
  // Array values indicate the status of the connection to the solar car. These will always be true when unpacking data
  let solar_car_connection = solarCarData["solar_car_connection"];

  // Add the current timestamp to timestamps, limit its length, and update the array in solarCarData
  // timestamps.unshift(DateTime.now().toString());

  // Add separators for timestamp to timestamps and limit array's length
  timestamps.unshift("::.");
  if (timestamps.length > X_AXIS_CAP) {
    timestamps.pop();
  }

  // Repeat with solar_car_connection
  solar_car_connection.unshift(true);
  if (solar_car_connection.length > X_AXIS_CAP) solar_car_connection.pop();
  solarCarData["solar_car_connection"] = solar_car_connection;

  for (const property in DATA_FORMAT) {
    let dataArray = []; // Holds the array of data specified by property that will be put in solarCarData
    let dataType = ""; // Data type specified in the data format

    if (solarCarData.hasOwnProperty(property)) {
      dataArray = solarCarData[property];
    }
    dataType = DATA_FORMAT[property][1];

    // Add the data from the buffer to solarCarData
    switch (dataType) {
      case "float":
        // Add the data to the front of dataArray
        dataArray.unshift(data.readFloatLE(buffOffset));
        break;
      case "char":
        // Add char to the front of dataArray
        dataArray.unshift(String.fromCharCode(data.readUInt8(buffOffset)));
        break;
      case "bool":
        // Add bool to the front of dataArray
        dataArray.unshift(Boolean(data.readUInt8(buffOffset)));
        break;
      case "uint8":
        switch (property) {
          case "tstamp_hr":
            const hours = data.readUInt8(buffOffset);
            if (hours < 10) timestamps[0] = "0" + hours + timestamps[0];
            else timestamps[0] = hours + timestamps[0];
            break;
          case "tstamp_mn":
            const mins = data.readUInt8(buffOffset);
            timestamps[0] = timestamps[0].replace(
              "::",
              ":" + (mins < 10 ? "0" + mins : mins) + ":"
            );
            break;
          case "tstamp_sc":
            const secs = data.readUInt8(buffOffset);
            timestamps[0] = timestamps[0].replace(
              ":.",
              ":" + (secs < 10 ? "0" + secs : secs) + "."
            );
            break;
          default:
            // Add the data to the front of dataArray
            dataArray.unshift(data.readUInt8(buffOffset));
            break;
        }
        break;
      case "uint16":
        if (property === "tstamp_ms") {
          const millis = data.readUInt16BE(buffOffset);
          let millisStr;
          if (millis >= 100) {
            millisStr = millis;
          } else if (millis >= 10) {
            millisStr = "0" + millis;
          } else {
            millisStr = "00" + millis;
          }
          if (typeof millisStr === "undefined") {
            console.warn(
              `Millis value of ${millis} caused undefined millis value`
            );
          }

          timestamps[0] += millisStr;
          break;
        }
        // Add the data to the front of dataArray
        dataArray.unshift(data.readUInt16BE(buffOffset));
        break;
      default:
        // Log if an unexpected type is specified in the data format
        console.log(
          `No case for unpacking type ${dataType} (type specified for ${property} in format.json)`
        );
        break;
    }

    if (!property.startsWith("tstamp")) {
      // If property is not used for timestamps
      // Limit dataArray to a length specified by X_AXIS_CAP
      if (dataArray.length > X_AXIS_CAP) {
        dataArray.pop();
      }
      // Write dataArray to solarCarData at the correct key
      solarCarData[property] = dataArray;
    }

    // Increment offset by amount specified in data format
    buffOffset += DATA_FORMAT[property][0];
  }

  // Update the timestamps array in solarCarData
  solarCarData["timestamps"] = timestamps;

  // Update the data to be passed to the front-end
  frontendData = solarCarData;
}

// Create new socket
openSocket();

export default ROUTER;
