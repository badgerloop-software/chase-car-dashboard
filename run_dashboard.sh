#!/bin/bash

# TODO Update this (e.g. updating main/current branch isn't mentioned here)
usage="
$0 - Runs the engineering dashboard. This command will optionally install all necessary dependencies for the dashboard and, unless otherwise sepcified, will update all data constants. Installing all necessary dependencies (with the s/setup flag) only needs to be done once. However, it is not recommended that you skip the update process unless you have recently run the dashboard.

Usage: $0 [OPTIONS]

Where available options are the following:
\t-s, --setup\tInstall necessary dependencies
\t-n, --no-update\tSkip updating the sc1-data-format submodule and all constants that depend on its contents

"
# Process arguments
while [[ "$1" =~ ^- && ! "$1" == "--" ]]; do
	case $1 in
		-s | --setup )
			setup=true
			;;
		-n | --no-update )
			update=false
			;;
		-h | --help )
			echo -e "${usage}"
			exit
			;;
	esac
	shift
done
if [[ "$1" == "--" ]]; then shift; fi

# Set setup to false if it was not set to true with the s/setup flag
setup=${setup-false}
# Set update to true if it was not set to false with the n/no-update flag
update=${update-true}



# Setup/Installations
if [[ ${setup} = true ]]; then
	# TODO Remove
	echo "Setup"
	
	node -v &>nodevar
	# TODO echo "v16.14.1" &>nodevar
	
	if [[ $(cat nodevar) =~ v[0-9]+\.[0-9]+\.[0-9]+ ]]; then
		echo "You've got node $(cat nodevar)"
		
		# Get individual version numbers
		IFS='.' read -r -a versions <<< "$(cat nodevar)"
		# Remove the 'v' preceding the first version number
		versions[0]="${versions[0]#v}"
		
		
		# TODO
		echo "${versions[@]}"
		
		# TODO Add a -d/--downgrade flag to downgrade node if they have a version of node installed that's higher than 16 (i.e. a version that won't run the dashboard, such as 18.12.1)
		# TODO Could possibly fix the backwards compatibility issue in package.json (adding an option in the start script)
		# TODO Could check what the earliest incompatible (newer) version of node is, and check if the existing version is that new or newer
		
		# Check if the existing version is older than a known working version of node
		if [[ versions[0] -lt 16 || (versions[0] -eq 16 && (versions[1] -lt 14 || (versions[1] -eq 14 && versions[2] -lt 2))) ]]; then
			# Installed node version is old
			echo -e "You need to update node\n\n"
			echo -e "Buckle up buckaroo, 'cause this is gonna take a minute\n\n"
		
			sleep 3

			# Remove current version of node
			sudo rm -rf /usr/{bin,include,lib,share}/{node,npm}
			
			# Install newer working version node
			wget https://nodejs.org/download/release/v16.14.2/node-v16.14.2-linux-x64.tar.xz
			sudo tar -xvf node-v16.14.2-linux-x64.tar.xz
			sudo cp -r ./node-v16.14.2-linux-x64/{bin,include,lib,share} /usr/
			export PATH=/usr/node-v16.14.2-linux-x64/bin:$PATH
			
			# Remove node files in current directory
			rm -rf ./node-v16.14.2-linux-x64*
		fi
	else
		# Node is not installed
		echo -e "You don't got node\n\n" #TODO
		echo -e "Buckle up buckaroo, 'cause this is gonna take a minute\n\n"
		
		sleep 3
		
		# Install node
		wget https://nodejs.org/download/release/v16.14.2/node-v16.14.2-linux-x64.tar.xz
		sudo tar -xvf node-v16.14.2-linux-x64.tar.xz
		sudo cp -r ./node-v16.14.2-linux-x64/{bin,include,lib,share} /usr/
		export PATH=/usr/node-v16.14.2-linux-x64/bin:$PATH
		
		# Remove node files in current directory
		rm -rf ./node-v16.14.2-linux-x64*
	fi
	
	rm nodevar
	
	
	# Check if Python 3.X.X is installed and set as the default for Python.
	# If not, install Python 3 and pip, and set Python 3 as the default
	python --version &>pyvar
	
	if [[ ! $(cat pyvar) =~ Python\ 3\.[0-9]+\.[0-9]+ ]]; then
		# Install Python 3 and pip
		sudo apt-get install software-properties-common
		sudo add-apt-repository ppa:deadsnakes/ppa
		sudo apt-get update
		sudo apt-get install python3 python3-pip
		
		# Set Python 3 as the default when running python
		# so that the command being spawned in api.js (for processing recorded binary data)
		# can be "python" instead of "python3"
		sudo update-alternatives --install /usr/bin/python python /usr/bin/python3 1
	fi
	
	rm pyvar
	
	# Install necessary Python modules
	pip install xlsxwriter
	pip install numpy
fi


# TODO	Add a check for node/npm before continuing
#	If either is not installed, prompt the user to use the -s/--setup flag

# TODO
#if ! command -v node &>/dev/null
#then
#	echo "I"
#else
#	echo "I don't need node"
#fi


# TODO Also add a check to make sure sc1-data-format has been cloned and included as a submodule


# Update the dashboard:
#	Pull remote changes
#	Update data format/constants
#	Install/Update dependencies
if [[ ${setup} = true || ${update} = true ]]; then
	#TODO Remove
	echo "Update"
	
	# TODO git restore Backend/Data/sc1-data-format Frontend/src/data-constants.json Frontend/src/Components/Graph/graph-data.json
	
	#TODO Instead of the above restore command: git reset --hard
	
	# Pull latest changes from current remote branch
	git pull origin $(git branch --show-current)
	
	# Install/Update dependencies
	npm i
	
	# Update data format and constants generated using it
	npm run update-data
	
	#TODO
	# origin main
	#	Might need to restore sc1-data-format and data constants before pulling in case they were updated in between remote main updates
	# sc1-data-format
	#	data constants
fi


# TODO Implement recorded_data_args in data recording/processing
echo -e "\n------------------------------------------------\n"
echo -e "Make sure to update Backend/src/routes/recorded_data_args with the directory in which you want to save recorded data (CSVs, not binary files)."

while [[ TRUE ]]; do
	echo "Currently, recorded data will be saved in $(cat Backend/src/routes/recorded_data_args)"
	echo -n "Would you like to change the recorded data directory (y/n)? "
	read recDirOkay
	
	if [[ ${recDirOkay^^} == @(Y|YES) ]]; then
		nano Backend/src/routes/recorded_data_args
		echo -en "\033[1A\033[2K\033[1A\033[2K"
	elif [[ ${recDirOkay^^} == @(N|NO) ]]; then
		#TODO echo -e "\033[2K\n-------------------------------------------------------------------------------------\n"
		break
	else
		echo "Please enter a valid option"
		echo -en "\033[1A\033[1A\033[2K\033[1A\033[2K"
	fi
done



# TODO Run the production build, not debug

# Run the dashboard
npm start



#TODO
:'
NOTE - Run dashboard with production build instead of debug

List of dependencies/installs/tasks to do before running the dashboard:
      *	1. npm
      *	2. nodejs
	3. git
     **	4. python (3.X.X I believe)
     **	6. pip
     **	7. xlsxwriter
     **	8. numpy
	9. sc1-data-format submodule and data constants
		a. Automatically update the submodule/data constants at the end of the installations/before running the dashboard
		b. init submodule during setup
	10. Pull origin/main before running

*  Check README for version/details
** Check Backend/src/routes for version/details
'

