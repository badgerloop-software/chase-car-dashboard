# Solar Car 1 Engineering Dashboard

## Libraries

- [node.js and npm](https://nodejs.org/en/) - Package manager and server workhorse (node version **20** -- use `nvm` to manage Node versions)
- [React](https://reactjs.org/) - Front-end library
- [Chakra UI](https://chakra-ui.com/) - Component library
- [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://www.npmjs.com/package/react-chartjs-2) - Graph library & React wrapper
- [XlsxWriter](https://pypi.org/project/XlsxWriter/) - Python module for writing Excel files
- [NumPy](https://numpy.org/) - Python library for working with numerical data
- [FastAPI](https://fastapi.tiangolo.com) - Python library for creating REST API endpoints
- [Uvicorn](https://www.uvicorn.org) - Python library for hosting web services
- [Redis](https://redis.io/docs/clients/python/) - High performance in memory database for storing our data

## Cloning the Data Format Repository and Initializing the Submodule

0. If you don't already have an SSH key, [generate a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) (only the steps under "Generating a new SSH key" are required) and [add it to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
1. Once you have an SSH key, clone this repository to your computer. Make sure to clone it using SSH (when you go to copy the clone link, there will be an SSH option above the link).
2. Next, `cd` into the `chase-car-dashboard` repository and run `git submodule update --init`.

## Updating Data

0. This step assumes that the repository has been initialized as above. Also, this assumes that the terminal that you are using to run the command natively allows `git` commands.
1. Run the command `npm run update-data`. This should take care of updating the submodule and JSON files in the frontend. (If the command fails to run, make sure you have the most recent dependencies and version of `npm` installed onto your computer).

## Running the Dashboard

0. Install `redis-stack-server`. This is the database that we use to store telemetry data, and it's essential for runninng the dashboard. Run the docker version with `docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest` (see [here](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/docker/) for more info) or follow [this guide](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/) to install redis stack as a system service
1. Ensure that you have all the required package installed on your system. and check your python version by running `python3 --version` on the terminal, for this build Python 3.9 or higher is required
2. Clone the repository to your computer (see steps 0-1 of "Cloning the Data Format Repository and Initializing the Submodule" for instructions on cloning a repo using SSH).
3. If you have not already, clone the `sc1-data-format` repository and initialize the submodule (see instructions above).
4. Run `npm run update-data` to update the constants (e.g. nominal min/max values for all data) related to each piece of data listed in the submodule (see the "Updating Data" section).
5. Run `npm i` to install the latest dependencies to your computer.
6. In a terminal, cd into frontend and run `npm start` to start the React frontend, then move the process to background or open a new terminal. In the new terminal, cd into backend and run `python3 main.py` to start the backend server

## Running the Dashboard With Docker

[Note to software contributors: You do not need to follow this guide, docker is for deployment only.]

1. Install [Docker Desktop](https://docs.docker.com/get-docker/) or [Docker](https://docs.docker.com/engine/install/).
2. If you are not familiar with Docker, it is recommended to install Docker Desktop.
3. Once it is installed, start Docker Desktop. If Docker is not started, you will see a message saying Docker Daemon is Starting. Wait for this to complete.
4. Look for a script in this GitHub repo that matches your OS. If you're on Windows, that script is called `windows-pull-run.bat`, and for Linux and Mac it is called `linux-pull-run.sh`.
5. To download the script, open the script in GitHub and then click "Raw". The file will open in a tab. Then do `Ctrl + S` or `Command + S`, depending on your OS, and save it. This script will create a folder called recordedData in the same spot as your script, so keep that in mind when choosing where to download it. If operating on Windows make sure to remove the ".txt" when downloading and also download the powershell script in same folder. To run, look at the bullet points below:
   - (Windows) Navigate to the folder storing the script and double click on it.
   - (MacOS/Linux) `cd` into the directory storing the script, and then run these commands: `chmod +x linux-pull-run.sh` and `./linux-pull-run.sh`.
   - NOTE: Certain run configurations require specific network interface setups. Run `windows-pull-run.bat -h` or `./linux-pull-run.sh -h`, depending on your terminal environment, and see the desciption of the "config" option for more information about these setups.

## Contributing to the Dashboard

0. Again, make sure you have [node.js](https://nodejs.org/en/download/) and [Python 3](https://www.python.org/downloads/release/python-3104/), and Re
   1. Additionally, check that running `python --version` on the terminal returns Python 3.X.X (ideally Python 3.10.X).
1. Clone the repository to your computer (see steps 0-1 of "Cloning the Data Format Repository and Initializing the Submodule" for instructions on cloning a repo using SSH).
2. If you have not already, clone the `sc1-data-format` repository and initialize the submodule with `git submodule update --init`.
3. Open the repository in your IDE of choice (Visual Studio Code is recommended).
4. Run `npm run update-data` to update the `sc1-data-format` submodule and any associated JSON files (see the "Updating Data" section). You should also do this any time the submodule might have changed (i.e. whenever the [data format](https://github.com/badgerloop-software/sc1-data-format/blob/main/format.json) has been modified).
   1. To avoid pushing changes that use obsolete data, update the submodule and data constants before you `git push` your changes. If there are changes to the data format, run the dashboard to make sure your code still works.
5. Run `npm i` to install the latest dependencies to your computer. You will also need to do this when you `git pull` to get the most recent changes of the code on your branch.
6. If you want to test the engineering dashboard with the solar car dashboard, do the following:
   1. Open up two separate terminals.
   2. In the first, `cd` into `Backend` and run the command `python3 main.py`.
   3. With the other terminal, cd into `Frontend` and run the command `npm start`.
7. If you want to test the engineering dashboard without the solar car dashboard, do the following:
   1. Open up a third terminal.
   2. `cd` into `DataGenerator` and run the command `npm start`.
8. Once you have finished making your necessary changes to your code, switch to a new branch that has a good name for the feature or names the Jira issue (e.g. `SC2-123/skeleton`).
9. Commit related changes to that branch and push to this repository. (Do this often so that it is easy to finely revert to a previous state!)
10. Once you are happy with the state of your code, open a pull request and request someone to conduct a code review. It may be kicked back with some suggestions or edits, but when it is accepted, it will be merged with `main`. Congrats! Now it's just time to rinse and repeat.

## Data Recording

Raw recorded data is saved in redis database, you can access the data manually with `redis-cli` or using [redis-insight](https://redis.com/redis-enterprise/redis-insight/). However, the dashboard can be used to convert this raw database data to Excel format. You can do this by simply go press on the red record button on the dashboard and select the desired start and end time for your data, and click save, the dashboard should automatically save the data to your broswer download.
