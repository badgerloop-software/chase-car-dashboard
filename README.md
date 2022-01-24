# Solar Car 1 Engineering Dashboard

## Libraries

- [React](https://reactjs.org/) - Front-end library
- [Chakra UI](https://chakra-ui.com/) - Component library
- [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://www.npmjs.com/package/react-chartjs-2) - Graph library & React wrapper

## Cloning the Data Format Repository and Initializing the Submodule

0. If you don't already have an SSH key, [generate a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) (only the steps under "Generating a new SSH key" are required) and [add it to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
1. Once you have an SSH key, clone the [sc1-data-format repository](https://github.com/badgerloop-software/sc1-data-format) to your computer. Make sure to clone it using SSH (when you go to copy the clone link, there will be an SSH option above the link).
2. Next, `cd` into the `chase-car-dashboard` repository and run the following commands:
   1. `git submodule init`
   2. `git submodule update --remote`

## Running the Dashboard

0. Ensure that you have [node.js](https://nodejs.org/en/download/) installed on your computer.
1. Clone the repository to your computer (see steps 0-1 of "Cloning the Data Format Repository and Initializing the Submodule" for instructions on cloning a repo using SSH).
2. If you have not already, clone the `sc1-data-format` repository and initialize the submodule (see instructions above).
3. Run `git submodule update --remote` to update the `sc1-data-format` submodule.
4. Run `npm i` to install the latest dependencies to your computer.
5. In a terminal, run `npm start`. The console output may look messy, but that is due to three servers running at the same time. For a more organized console, please look below.

## Contributing to the Dashboard

0. Again, make sure you have [node.js](https://nodejs.org/en/download/) installed on your computer (as well as Prettier if you want clean code :neutral_face:).
1. Clone the repository to your computer (see steps 0-1 of "Cloning the Data Format Repository and Initializing the Submodule" for instructions on cloning a repo using SSH).
2. If you have not already, clone the `sc1-data-format` repository and initialize the submodule (see instructions above).
3. Open the repository in your IDE of choice (Visual Studio Code is recommended).
4. Run `git submodule update --remote` to update the `sc1-data-format` submodule. You should also do this any time the submodule might have changed (i.e. whenever the [data format](https://github.com/badgerloop-software/sc1-data-format/blob/main/format.json) has been modified).
   1. To avoid pushing changes that use obsolete data, update the submodule before you `git push` your changes. If there are changes to the data format, run the dashboard to make sure your code still works.
5. Run `npm i` to install the latest dependencies to your computer. You will also need to do this when you `git pull` to get the most recent changes of the code on your branch.
6. If you want to test the engineering dashboard with the solar car dashboard, do the following:
   1. Change the value of `car_server` in `Backend/src/routes/api.js` to the TCP server's address (either the Raspberry Pi's IP address or "localhost").
   2. Open up two separate terminals.
   3. In the first, `cd` into `Backend` and, while the solar car dashboard is running, run the command `npm start`.
   4. With the other terminal, repeat the process with `Frontend`.
7. If you want to test the engineering dashboard without the solar car dashboard, do the following:
   1. Open up three separate terminals.
   2. In the first, `cd` into `DataGenerator` and run the command `npm start`.
   3. With the other two terminals, repeat the process with `Backend` and `Frontend`, in that order, after the previous has initialized and opened their port (4003 and 4001, respectively).
8. Once you have finished making your necessary changes to your code, switch to a new branch that has a good name for the feature or names the Jira issue (e.g. `SW-23/skeleton`).
9. Commit related changes to that branch and push to this repository. (Do this often so that it is easy to finely revert to a previous state!)
10. Once you are happy with the state of your code, open a pull request and request someone to conduct a code review. It may be kicked back with some suggestions or edits, but when it is accepted, it will be merged with `main`. Congrats! Now it's just time to rinse and repeat.
