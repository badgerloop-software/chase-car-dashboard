# Solar Car 1 Engineering Dashboard

## Libraries

- [React](https://reactjs.org/) - Front-end library
- [Chakra UI](https://chakra-ui.com/) - Component library
- [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://www.npmjs.com/package/react-chartjs-2) - Graph library & React wrapper

## Running the Dashboard

0. Ensure that you have [node.js](https://nodejs.org/en/download/) installed on your computer.
1. Clone the repository to your computer.
2. Run `npm i` to install the latest dependencies to your computer.
3. In a terminal, run `npm start`. The console output may look messy, but that is due to three servers running at the same time. For a more organized console, please look below.

## Contributing to the Dashboard

0. Again, make sure you have [node.js](https://nodejs.org/en/download/) installed on your computer (as well as Prettier if you want clean code :neutral_face:).
1. Clone the repository to your computer.
2. Open the repository in your IDE of choice (Visual Studio Code is recommended).
3. Run `npm i` to install the latest dependencies to your computer. You will also need to do this when you `git pull` to get the most recent changes of the code on your branch.
4. Open up three seperate terminals.
5. In the first, `cd` into `DataGenerator` and run the command `npm start`.
6. With the other two terminals, repeat the process with `Backend` and `Frontend`, in that order, after the previous has initialized and opened their port (4003 and 4001, respectively).
7. Once you have finished making your necessary changes to your code, switch to a new branch that has a good name for the feature or names the Jira issue (e.g. `sw-23/skeleton`).
8. Commit related changes to that branch and push to this repository. (Do this often so it is easy to finely revert to a previous state!)
9. Once you are happy with the state of your code, open a pull request and request someone to conduct a code review. It may be kicked back with some suggestions or edits, but when it is accepted, it will be merged with `main`. Congrats! Now it's just time to rinse and repeat.
