# Solar Car 1 Engineering Dashboard

## Libraries

- [node.js and npm](https://nodejs.org/en/) - Package manager and server workhorse (node version **>16**)
- [React](https://reactjs.org/) - Front-end library
- [Chakra UI](https://chakra-ui.com/) - Component library
- [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://www.npmjs.com/package/react-chartjs-2) - Graph library & React wrapper

## Cloning the Data Format Repository and Initializing the Submodule

0. If you don't already have an SSH key, [generate a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) (only the steps under "Generating a new SSH key" are required) and [add it to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
1. Once you have an SSH key, clone the [sc1-data-format repository](https://github.com/badgerloop-software/sc1-data-format) to your computer. Make sure to clone it using SSH (when you go to copy the clone link, there will be an SSH option above the link).
2. Next, `cd` into the `chase-car-dashboard` repository and run `git submodule update --init`.

## Updating Data

0. This step assumes that the repository has been initialized as above. Also, this assumes that the terminal that you are using to run the command natively allows `git` commands.
1. Run the command `npm run update-data`. This should take care of updating the submodule and JSON files in the frontend. (If the command fails to run, make sure you have the most recent dependencies and version of `npm` installed onto your computer).

## Running the Dashboard

0. Ensure that you have [node.js](https://nodejs.org/en/download/) installed on your computer.
1. Clone the repository to your computer (see steps 0-1 of "Cloning the Data Format Repository and Initializing the Submodule" for instructions on cloning a repo using SSH).
2. If you have not already, clone the `sc1-data-format` repository and initialize the submodule (see instructions above).
3. Run `npm run update-data` to update the constants (e.g. nominal min/max values for all data) related to each piece of data listed in the submodule (see the "Updating Data" section).
4. Run `npm i` to install the latest dependencies to your computer.
5. In a terminal, run `npm start` or, if you want to run the engineering dashboard without the solar car dashboard, `npm run start-dev`. The console output may look messy, but that is due to three servers running at the same time. For a more organized console, please look below.

## Running the Dashboard With Docker

0. Install [Docker Desktop](https://docs.docker.com/get-docker/) or [Docker](https://docs.docker.com/engine/install/). 
1. If you are not familiar with Docker, it is recommended to install Docker Desktop.
2. Once it is installed, start Docker Desktop. If Docker is not started, you will see a message saying Docker Daemon is Starting. Wait for this to complete.
3. Look for a script in this GitHub repo that matches your OS. If you're on Windows, that script is called `windows-pull-run.bat`, and for Linux and Mac it is called `linux-pull-run.sh`.
4. To download the script, open the script in GitHub and then click "Raw". The file will open in a tab. Then do `Ctrl + S` or `Command + S`, depending on your OS, and save it to your Downloads folder. If operating on Windows make sure to remove the ".txt" when downloading. To run, look at the bullet points below:
   - (Windows) Navigate to the Downloads folder and double click on the script. 
   - (MacOS/Linux) Run these commands in your terminal `cd Downloads`, `chmod +x linux-pull-run.sh`, and `./linux-pull-run.sh`.

## Contributing to the Dashboard

0. Again, make sure you have [node.js](https://nodejs.org/en/download/) installed on your computer (as well as Prettier if you want clean code :neutral_face:).
1. Clone the repository to your computer (see steps 0-1 of "Cloning the Data Format Repository and Initializing the Submodule" for instructions on cloning a repo using SSH).
2. If you have not already, clone the `sc1-data-format` repository and initialize the submodule with `git submodule update --init`.
3. Open the repository in your IDE of choice (Visual Studio Code is recommended).
4. Run `npm run update-data` to update the `sc1-data-format` submodule and any associated JSON files (see the "Updating Data" section). You should also do this any time the submodule might have changed (i.e. whenever the [data format](https://github.com/badgerloop-software/sc1-data-format/blob/main/format.json) has been modified).
   1. To avoid pushing changes that use obsolete data, update the submodule and data constants before you `git push` your changes. If there are changes to the data format, run the dashboard to make sure your code still works.
5. Run `npm i` to install the latest dependencies to your computer. You will also need to do this when you `git pull` to get the most recent changes of the code on your branch.
6. If you want to test the engineering dashboard with the solar car dashboard, do the following:
   1. Open up two separate terminals.
   2. In the first, `cd` into `Backend` and run the command `npm start dev`.
   3. With the other terminal, cd into `Frontend` and run the command `npm start`.
7. If you want to test the engineering dashboard without the solar car dashboard, do the following:
   1. Open up three separate terminals.
   2. In the first, `cd` into `DataGenerator` and run the command `npm start`.
   3. With the other two terminals, repeat the process with `Backend` and `Frontend`, in that order, after the previous has initialized and opened their port (4003 and 4001, respectively).
8. Once you have finished making your necessary changes to your code, switch to a new branch that has a good name for the feature or names the Jira issue (e.g. `SW-23/skeleton`).
9. Commit related changes to that branch and push to this repository. (Do this often so that it is easy to finely revert to a previous state!)
10. Once you are happy with the state of your code, open a pull request and request someone to conduct a code review. It may be kicked back with some suggestions or edits, but when it is accepted, it will be merged with `main`. Congrats! Now it's just time to rinse and repeat.
