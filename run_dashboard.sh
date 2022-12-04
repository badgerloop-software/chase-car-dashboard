#!/bin/bash

# TODO need to add chmod instructions in README


# TODO Update this (e.g. updating main/current branch isn't mentioned here)
usage="
\033[1;4m$0\033[0m

\033[1mDESCRIPTION\033[0m
	Runs the engineering dashboard. This command will optionally install all necessary dependencies for the dashboard and, unless otherwise sepcified, will update all data constants. Installing all necessary dependencies (with the s/setup flag) only needs to be done once. However, it is not recommended that you skip the update process unless you have recently run the dashboard.

\033[1mUSAGE\033[0m
	$0 [OPTIONS...]

\033[1mOPTIONS\033[0m
	-s, --setup
	    Install necessary dependencies
	
	-n, --no-update
	    Skip updating the sc1-data-format submodule and all constants that depend on its contents

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
			{ echo -e "${usage}"; } | fmt
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
	# Make sure the user knows what they're in for
	echo -e "\n\nJust a heads up, depending on what you already have installed and set, this setup could take a few minutes."
	echo "By specifying the -s (or --setup) flag, this script will do the following:"
	echo -e "\t- If needed, install a version of Node.js (along with a suitable version of npm) that can run the engineering dashboard (namely v16.14.2 of Node.js)\n\t\t\033[0;31m* NOTE - If you have a higher major version of Node.js (i.e. v17.X.X or v18.X.X) installed, this script will downgrade your current version, as it may have issues running the front end of the dashboard\033[0m"
	echo -e "\t- If needed, install Python 3 and pip. Additionally, Python 3 will be set as the default for Python so that the command spawned for processing recorded data can be \"python\" instead of a specified version of Python (e.g. \"python3\")"
	echo -e "\t- If needed, clone the sc1-data-format repository and include it as a submodule in this project"
	echo -e "\t- Pull the latest changes from the remote copy of the current branch ($(git branch --show-current))\n\t\t\033[0;31m* NOTE - Any uncommitted changes you have in your local copy of this project will be reset, so stash any changes you want to save before continuing\033[0m"
	echo -e "\t- Install/Update all dependencies specified in the respective package.json files in the Frontend, Backend, and DataGenerator directories"
	
	while [[ TRUE ]]; do
		echo -en "\nWould you like to continue with the setup described above (y/n)? "
		read continueSetup
		
		if [[ ${continueSetup^^} == @(Y|YES) ]]; then
			echo ""
			break
		elif [[ ${continueSetup^^} == @(N|NO) ]]; then
			echo ""
			exit
		else
			echo "Please enter a valid option"
			echo -en "\033[1A\033[1A\033[2K\033[1A\033[2K"
		fi
	done
	
	# Check the node version (if node is already installed) and install a working version if needed
	node -v &>nodevar
	
	if [[ $(cat nodevar) =~ v16\.[0-9]+\.[0-9]+ ]]; then
		# Get individual version numbers
		IFS='.' read -r -a versions <<< "$(cat nodevar)"
		
		# Check if the existing version is older than a known working version of node
		if [[ versions[1] -lt 14 || (versions[1] -eq 14 && versions[2] -lt 2) ]]; then
			# Installed node version is old
			echo -e "You need to update node\n\n"
			echo -e "Buckle up buckaroo, 'cause this is gonna take a minute\n\n"
		
			sleep 3

			# Remove current version of node
			sudo rm -rf /usr/{bin,include,lib,share}/{node,npm}
			
			# Install newer version of node
			wget https://nodejs.org/download/release/v16.14.2/node-v16.14.2-linux-x64.tar.xz
			sudo tar -xvf node-v16.14.2-linux-x64.tar.xz
			sudo cp -r ./node-v16.14.2-linux-x64/{bin,include,lib,share} /usr/
			export PATH=/usr/node-v16.14.2-linux-x64/bin:$PATH
			
			# Remove node files in current directory
			sudo rm -rf ./node-v16.14.2-linux-x64* # TODO Maybe remove sudo, but it was needed for Noah's copy
		fi
	else
		# Node v16.X.X is not installed
		echo -e "Buckle up buckaroo, 'cause this is gonna take a minute\n\n"
		
		sleep 3
		
		# Install known working version node
		wget https://nodejs.org/download/release/v16.14.2/node-v16.14.2-linux-x64.tar.xz
		sudo tar -xvf node-v16.14.2-linux-x64.tar.xz
		sudo cp -r ./node-v16.14.2-linux-x64/{bin,include,lib,share} /usr/
		export PATH=/usr/node-v16.14.2-linux-x64/bin:$PATH
		
		# Remove node files in current directory
		sudo rm -rf ./node-v16.14.2-linux-x64* # TODO Maybe remove sudo, but it was needed for Noah's copy
	fi
	
	rm nodevar
	
	
	# Check if Python 3.X.X is installed and set as the default for Python.
	# If not, install Python 3 and pip, and set Python 3 as the default
	if [[ ! $(python --version) =~ Python\ 3\.[0-9]+\.[0-9]+ ]]; then
		# Python 3 is not installed or not default
		echo -e "You need Python 3 (as default)\n\n"
		echo -e "Buckle up buckaroo, 'cause this could take a minute\n\n"
		
		sleep 3
		
		# Install Python 3 and pip
		sudo apt-get install software-properties-common
		sudo add-apt-repository ppa:deadsnakes/ppa
		sudo apt-get update
		sudo apt-get install python3 python3-pip
		
		# Set Python 3 as the default when running python
		# so that the command being spawned in api.js (for processing recorded binary data)
		# can be "python" instead of "python3"
		sudo update-alternatives --install /usr/bin/python python /usr/bin/python3 1
		# TODO Try: echo "alias python=/usr/local/bin/python3" >> ~/.bashrc
	elif [[ ! $(pip --version) =~ pip\ [0-9]+\.[0-9]+\.[0-9]+ ]]; then
		# Python 3 is installed and default, but pip is not installed
		sudo apt-get install python3-pip
		# TODO Could improve the pip check to make sure it's for Python 3
	fi
	
	# Install necessary Python modules
	pip install xlsxwriter
	pip install numpy
	
	
	# Make sure the sc1-data-format submodule is set up in the project
	if [[ -z $(ls Backend/Data/sc1-data-format) ]]; then
		# Move to the parent directory
		cd ..
		
		# Make sure the sc1-data-format repo has been cloned by the user
		if [[ ! $(ls) =~ sc1-data-format ]]; then
			git clone git@github.com:badgerloop-software/sc1-data-format.git
		fi
		
		# Move back into the chase-car-dashboard project and set up the submodule
		cd chase-car-dashboard
		git submodule update --init
		
		# Check that the submodule was correctly initialized (bc it has a history of failing for new, unexpected reasons)
		if [[ -z $(ls Backend/Data/sc1-data-format) ]]; then
			echo -e "\033[1;31mSubmodule (Backend/Data/sc1-data-format) initialization failed... Exiting\033[0m"
			exit
		fi
	fi
fi


# Check for missing dependencies before continuing
# If any dependencies are missing, prompt the user to run the script with the -s/--setup flag
if [[ -z $(node -v 2>/dev/null) || -z $(npm -v 2>/dev/null) || ! $(python --version) =~ Python\ 3\.[0-9]+\.[0-9]+ || ! $(pip --version) =~ pip\ [0-9]+\.[0-9]+\.[0-9]+ || -z $(ls Backend/Data/sc1-data-format) ]]; then
	echo -e "\n\033[0;31mYou are missing necessary dependencies:"
	# Node.js (or version check if installed)
	if [[ -z $(node -v 2>/dev/null) ]]; then
		echo -e "\tNode.js"
	elif [[ ! $(node -v) =~ v16\.[0-9]+\.[0-9]+ ]]; then
		echo -e "\tNode.js is installed, but existing version ($(node -v)) is not a known working version (v16.X.X)"
	fi
	# npm
	if [[ -z $(npm -v 2>/dev/null) ]]; then
		echo -e "\tnpm"
	fi
	# Python 3 (as default)
	if [[ ! $(python --version 2>/dev/null) =~ Python\ 3\.[0-9]+\.[0-9]+ ]]; then
		echo -e "\tPython 3 (or Python 3 is not set as default)"
	fi
	# pip
	if [[ ! $(pip --version 2>/dev/null) =~ pip\ [0-9]+\.[0-9]+\.[0-9]+ ]]; then
		echo -e "\tpip"
	fi
	# sc1-data-format
	if [[ -z $(ls Backend/Data/sc1-data-format) ]]; then
		echo -e "\tsc1-data-format (data format submodule)"
	fi
	
	echo -e "\n\033[0mConsider running this script with the -s/--setup flag (\033[1;33m./run_dashboard.sh -s\033[0m) to install any missing dependencies\n"
	
	exit
fi


# Additional check for node version
# Don't take action other than warning the user that their node version could cause issues
if [[ ! $(node -v) =~ v16\.[0-9]+\.[0-9]+ ]]; then
	echo -e "\n\n\033[1;31m WARNING - Node.js version is $(node -v), which may cause issues when running the dashboard.\n\n\033[0mConsider running the script with the -s/--setup flag (\033[1;33m./run_dashboard.sh -s\033[0m) to switch to a known working version (v16.14.2).\n"
	sleep 3
fi


# Update the dashboard:
#	Pull remote changes
#	Update data format/constants
#	Install/Update dependencies
if [[ ${setup} = true || ${update} = true ]]; then
	# TODO git restore Frontend/src/data-constants.json Frontend/src/Components/Graph/graph-data.json
	
	echo -en "\n\n\033[0;31mRESETTING CHANGES. LAST CHANCE TO SAVE ANY CHANGES MADE\n3"
	sleep 1
	echo -en "\t2"
	sleep 1
	echo -e "\t1\033[0m"
	sleep 1
	git reset --hard
	
	# Pull latest changes from current remote branch
	git pull origin $(git branch --show-current)
	
	# Install/Update dependencies
	npm i
	
	# Update data format and constants generated using it
	npm run update-data
fi


# TODO Implement recorded_data_args in data recording/processing
echo -e "\n\n--------------------------------------------------------------------\n\n"
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

