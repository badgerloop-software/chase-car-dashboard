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
	
	# Install xdg to open web pages
	# TODO sudo apt install xdg-utils
	
	#TODO
	# TODO xdg-open "https://INSERT_NODEJS_DOWNLOAD_PAGE_WITH_CORRECT_VERSION_HERE"
	
	# TODO Instead, just curl/wget the nodejs install and tar -xzf it
	
	# Install nvm for downloading nodejs and npm
	# TODO See github.com/nvm-sh/nvm
	# TODO wget -q0- https://raw.githubusercontent. TODO
	
	# TODO wget/curl python and pip too
	
	#TODO
	# nodejs
	# npm
	# python (3.X.X I believe)
	# pip
	#	xlsxwriter
	#	numpy
	# init submodule
fi


# Update data format/constants and main
if [[ ${setup} = true || ${update} = true ]]; then
	#TODO Remove
	echo "Update"
	
	# TODO git restore Backend/Data/sc1-data-format Frontend/src/data-constants.json Frontend/src/Components/Graph/graph-data.json
	
	#TODO Instead of the above restore command: git reset --hard
	
	# TODO git pull origin main
	
	# TODO (probably) Just for testing
	echo "git pull origin $(git branch --show-current)"
	
	# TODO Not needed since `npm run update-data` takes care of this: git submodule update --recursive
	# TODO npm run update-data
	
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
#TODO npm start



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
