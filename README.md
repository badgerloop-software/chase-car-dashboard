# Solar Car 1 Engineering Dashboard

## Libraries
- [React](https://reactjs.org/) - Front-end library
- [Chakra UI](https://chakra-ui.com/) - Component library
- [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://www.npmjs.com/package/react-chartjs-2) - Graph library & React wrapper

## Running the Dashboard
1. To install dependencies, run ```npm i``` in your terminal.
   1. If you just checked out a branch or updated your local
      branch, this may be necessary to run the project.
2. Open three terminal sessions.
3. In the first session, start the data generator and TCP server
   ```
   cd DataGenerator
   node server.js
4. In the second session, start the server and TCP client
   ```
   cd Backend
   node server.js
5. In the third session, run the React app
   ```
   cd Frontend
   npm start
