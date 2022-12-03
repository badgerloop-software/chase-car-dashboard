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


#TODO Is there a difference between the starting line used above and #!/usr/bin/env bash ???


# Setup/Installations
if [[ ${setup} = true ]]; then
	# TODO Remove
	echo "Setup"
	
	node -v &>nodevar
	#echo "v16.14.2" &>nodevar
	
	#echo "NODE - $(cat nodevar)"
		
	if [[ $(cat nodevar) =~ v[0-9]+\.[0-9]+\.[0-9]+ ]]; then
		echo "You've got node $(cat nodevar)"
		
		# Get individual version numbers
		IFS='.' read -r -a versions <<< "$(cat nodevar)"
		# Remove the 'v' preceding the first version number
		versions[0]="${versions[0]#v}"
		
		
		# TODO
		echo "${versions[@]}"
		
		
		# Check if the versions are less than a working LTS version of node
		if [[ versions[0] -lt 16 || (versions[0] -eq 16 && (versions[1] -lt 14 || (versions[1] -eq 14 && versions[2] -lt 2))) ]]; then
			# Installed node version is old
			echo -e "You need to update node\n\n"
			echo -e "Buckle up buckaroo, 'cause this is gonna take a minute\n\n"
		
			sleep 3

			# Remove current version of node
			sudo rm -rf /usr/{bin,include,lib,share}/{node,npm}
			
			# Install LTS version
			wget https://nodejs.org/dist/v18.12.1/node-v18.12.1-linux-x64.tar.xz
			sudo tar -xvf node-v18.12.1-linux-x64.tar.xz
			sudo cp -r ./node-v18.12.1-linux-x64/{bin,include,lib,share} /usr/
			export PATH=/usr/node-v18.12.1-linux-x64/bin:$PATH
			
			# Remove node files in current directory
			rm -rf ./node-v18.12.1-linux-x64*
		fi
	else
		# Node is not installed
		echo -e "You don't got node\n\n" #TODO
		echo -e "Buckle up buckaroo, 'cause this is gonna take a minute\n\n"
		
		sleep 3
		
		# Install node
		wget https://nodejs.org/dist/v18.12.1/node-v18.12.1-linux-x64.tar.xz
		sudo tar -xvf node-v18.12.1-linux-x64.tar.xz
		sudo cp -r ./node-v18.12.1-linux-x64/{bin,include,lib,share} /usr/
		export PATH=/usr/node-v18.12.1-linux-x64/bin:$PATH
		# TODO wget https://nodejs.org/download/release/v16.14.2/node-v16.14.2-linux-x64.tar.xz
		# TODO sudo tar -xvf node-v16.14.2-linux-x64.tar.xz
		# TODO sudo cp -r ./node-v16.14.2-linux-x64/{bin,include,lib,share} /usr/
		# TODO export PATH=/usr/node-v16.14.2-linux-x64/bin:$PATH
		
		# Remove node files in current directory
		rm -rf ./node-v18.12.1-linux-x64*
		# TODO rm -rf ./node-v16.14.2-linux-x64*
	fi
	
	rm nodevar
	
	# TODO
	#if ! command -v node &>/dev/null
	#then
	#	echo "I"
	#else
	#	echo "I don't need node"
	#fi
	
	
	
	# Install xdg to open web pages
	# TODO sudo apt install xdg-utils
	
	#TODO
	# TODO xdg-open "https://INSERT_NODEJS_DOWNLOAD_PAGE_WITH_CORRECT_VERSION_HERE"
	
	# TODO Instead, just curl/wget the nodejs install and tar -xzf it
	
	# Install nvm for downloading nodejs and npm
	# TODO See github.com/nvm-sh/nvm
	# TODO wget -q0- https://raw.githubusercontent. TODO
	
	# TODO wget/curl python and pip too
	
	
	# Check for pip and install Python 3.8 as well as pip if it isn't found
	# NOTE - Checking version instead of using command -v because it's more reliable
	pip --version &>pyvar
	
	if [[ ! $(cat pyvar) =~ pip\ [0-9]+\.[0-9]+\.[0-9]+ ]]; then
		sudo apt-get install software-properties-common
		sudo add-apt-repository ppa:deadsnakes/ppa
		sudo apt-get update
		sudo apt-get install python3-pip
		#TODO sudo apt-get install python3.8
	fi
	
	rm pyvar

	pip install xlsxwriter
	pip install numpy
	
	
	# TODO
	# nodejs
	# npm
	# python (3.X.X I believe)
	# pip
	# 	xlsxwriter
	# 	numpy
	# TODO init submodule
fi


# Update data format/constants and main
if [[ ${setup} = true || ${update} = true ]]; then
	#TODO Remove
	echo "Update"
	
	# TODO git restore Backend/Data/sc1-data-format Frontend/src/data-constants.json Frontend/src/Components/Graph/graph-data.json
	
	#TODO Instead of the above restore command: git reset --hard
	
	# TODO git pull origin main
	
	# Pull latest changes from current remote branch
	git pull origin $(git branch --show-current)
	
	# Update data format and constants that depend on it
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
echo -e "\n\n----------------------------------------------------------\n\nRun \`npm start\` to run the dashboard project\n\n----------------------------------------------------------\n\n"



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
