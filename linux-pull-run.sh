#!/bin/bash


usage="\033[1mSYNOPSIS
\t./linux-pull-run.sh\033[0m [\033[4mOPTIONS\033[0m]\n
\033[1mOPTIONS\033[0m
\t\033[1m-o\033[0m, \033[1m--no-open\033[0m
\t    Disables automatic opening of the dashboard.\n
\t\033[1m-t\033[0m <\033[4mTAG\033[0m>, \033[1m--tag\033[0m=<\033[4mTAG\033[0m>
\t    Specifies the tag of the chase-car-dashboard-image to pull and run.
\t    If no tag is specified, the image tagged \"latest\" will be used.\n
\t\033[1m-d\033[0m <\033[4mTAG\033[0m>, \033[1m--dist-tag\033[0m=<\033[4mTAG\033[0m>
\t    Specifies the tag of the engineering-data-distributor-image to pull and run.
\t    If no tag is specified, the image tagged \"latest\" will be used.
\t    - NOTE: The sc1-data-format submodule in the engineering-data-distributor-image will automatically be synced with that of the chase-car-dashboard-image being run.\n
\t\033[1m-c\033[0m <\033[4mCONFIG\033[0m>, \033[1m--config\033[0m=<\033[4mCONFIG\033[0m>
\t    Specifies the configuration in which to run the dashboard and data distribution server. The following are the available configurations:
\t        - \033[1m\"individual\" (default) (>=v3.8.0)\033[0m: Run both the chase-car-dashboard-image and the engineering-data-distributor-image on this computer. The engineering-data-distributor-image
\t            will receive data from the solar car and pass it to the local instance of the dashboard.
\t            - \033[4mNOTE\033[0m: In order to run this configuration, you must have connection to the Internet and/or a radio connection to the solar car. If you have both, ensure that your
\t                    routing table is set up such that you do not have a default route to the solar car via the radio interface. You can test the connections by pinging 192.168.1.17 and
\t                    google.com and running \`curl http://150.136.104.125:3000/newest-timestamp-table\` to ensure that you get a response from the VPS.
\t        - \033[1m\"competition\"\033[0m: Run only the chase-car-dashboard-image on this computer. This computer will be connected to another device running the engineering-data-distributor application
\t            via a LAN. The device running the distribution server will receive data from the solar car and broadcast it to the computers connected to it.
\t            - \033[4mNOTE\033[0m: In order to run this configuration, the Ethernet port connected to the device running the distribution server has to be on the 192.168.1.0/24 subnet, and it cannot
\t                    have an IP address in the following range: 192.168.1.15-17. You can test the connection by pinging 192.168.1.15.
\t        - \033[1m\"dev\"\033[0m: Run only the chase-car-dashboard-image on this computer. This configuration will run the data generator within the dashboard to create random mock datasets to display.\n
\t\033[1m-h\033[0m, \033[1m--help\033[0m
\t    Displays this help message.\n"


# _validate_arg: Checks if an argument was provided for a certain field
# - Parameters: 1) The field which requires an argument
#               2) The argument passed for that field
_validate_arg() {
	# Check if an argument was provided
	if [[ -z $2 ]]; then
		# An argument wasn't provided. Print error message/usage and exit
		echo -e "\n\033[1;31m[ERROR] $1 requires a value to be provided.\033[0m\n\n$usage\n" >&2
		exit 1
	fi
}


# _enforce_one_tag: Checks if a tag was already specified. Called when the -t or --tag option is specified.
_enforce_one_tag() {
	# If a tag was already specified, print error message/usage and exit
	if [[ -n $tag ]]; then
		echo -e "\n\033[1;31m[ERROR] More than one tag specified.\033[0m\n\n$usage\n" >&2
		exit 1
	fi
}


# _enforce_one_distributor_tag: Checks if a tag was already specified. Called when the -d or --dist-tag option is
#                               specified.
_enforce_one_distributor_tag() {
	# If an engineering-data-distributor tag was already specified, print error message/usage and exit
	if [[ -n $dist_tag ]]; then
		echo -e "\n\033[1;31m[ERROR] More than one engineering-data-distributor tag specified.\033[0m\n\n$usage\n" >&2
		exit 1
	fi
}


# _enforce_one_configuration: Checks if a configuration was already specified. Called when the -c or --config option is
#                             specified.
_enforce_one_configuration() {
	# If a configuration was already specified, print error message/usage and exit
	if [[ -n $config ]]; then
		echo -e "\n\033[1;31m[ERROR] More than one configuration specified.\033[0m\n\n$usage\n" >&2
		exit 1
	fi
}


# Parse command line arguments
while [[ "$1" =~ ^- && ! "$1" == "--" ]]; do case $1 in
	-o | --no-open )
		no_open=true
		;;
	-t | --tag )
		# Make sure a tag was not already specified
		_enforce_one_tag

		# Get the tag specified after the -t or --tag flag
		tag=$2

		# Check that a tag was provided
		# Keep only characters before a hyphen from the CLA after -t | --tag, effectively ignoring that CLA if it is a flag
		_validate_arg $1 "${tag%%-*}"
		shift
		;;
	--tag=* )
		# Make sure a tag was not already specified
		_enforce_one_tag

		# Get the characters immediately after the equals sign in the CLA
		tag="${1##--tag=}"

		# Check that a tag was provided
		# Strip the equals sign and anything after it from the CLA to make the field "--tag"
		_validate_arg "${1%%=*}" $tag
		;;
	-d | --dist-tag )
		# Make sure an engineering-data-distributor tag was not already specified
		_enforce_one_distributor_tag

		# Get the engineering-data-distributor tag specified after the -d or --dist-tag flag
		dist_tag=$2

		# Check that a tag was provided
		# Keep only characters before a hyphen from the CLA after -d | --dist-tag, effectively ignoring that CLA if it is a
		# flag
		_validate_arg $1 "${dist_tag%%-*}"
		shift
		;;
	--dist-tag=* )
		# Make sure an engineering-data-distributor tag was not already specified
		_enforce_one_distributor_tag

		# Get the characters immediately after the equals sign in the CLA
		dist_tag="${1##--dist-tag=}"

		# Check that a tag was provided
		# Strip the equals sign and anything after it from the CLA to make the field "--dist-tag"
		_validate_arg "${1%%=*}" $dist_tag
		;;
	-c | --config )
		# Make sure a configuration was not already specified
		_enforce_one_configuration

		# Get the configuration specified after the -c or --config flag
		config=$2

		# Check that a configuration was provided
		# Keep only characters before a hyphen from the CLA after -c | --config, effectively ignoring that CLA if it is a
		# flag
		_validate_arg $1 "${config%%-*}"

		# Check that the configuration provided is valid
		if [[ ! "$config" =~ ^(competition|dev|individual)$ ]]; then
			echo -e "\n\033[1;31m[ERROR] Invalid configuration specified: $config\033[0m\n\n$usage\n" >&2
			exit 1
		fi
		shift
		;;
	--config=* )
		# Make sure a configuration was not already specified
		_enforce_one_configuration

		# Get the characters immediately after the equals sign in the CLA
		config="${1##--config=}"

		# Check that a configuration was provided
		# Strip the equals sign and anything after it from the CLA to make the field "--config"
		_validate_arg "${1%%=*}" $config

		# Check that the configuration provided is valid
		if [[ ! "$config" =~ ^(competition|dev|individual)$ ]]; then
			echo -e "\n\033[1;31m[ERROR] Invalid configuration specified: $config\033[0m\n\n$usage\n" >&2
			exit 1
		fi
		;;
	-h | --help )
		echo -e "\n$usage\n"
		exit 0
		;;
	* )
		echo -e "\n\033[1;31m[ERROR] Invalid option: $1\033[0m\n\n$usage\n" >&2
		exit 1
		;;
esac; shift; done
if [[ "$1" == '--' ]]; then shift; fi

# If a tag, engineering-data-distributor tag, or configuration was specified as a CLA, use that. Otherwise, default to
# "latest" for the tags and "individual" for the configuration
tag=${tag:=latest}
dist_tag=${dist_tag:=latest}
config=${config:=individual}

# Pull the Docker image with the specified tag
docker pull ghcr.io/badgerloop-software/chase-car-dashboard-image:$tag

# Validate the version of the image if the "individual" configuration was specified
if [[ "$config" == "individual" ]]; then
	# Create a temporary container to parse package.json for the image's version. If it is lower than 3.8.0, making it
	# incompatible with the "individual" configuration, store it in low_ver so that the script can exit below
	low_ver=$(docker run --rm ghcr.io/badgerloop-software/chase-car-dashboard-image:$tag bash -c 'grep -oP "(?<=\"version\": \")(\d)+\.(\d)+\.(\d)+" package.json > v; if [[ $(cut -d "." -f 1 v) -lt 3 || ($(cut -d "." -f 1 v) -eq 3 && $(cut -d "." -f 2 v) -lt 8) ]]; then cat v; fi')

	if [[ -n "$low_ver" ]]; then
		echo -e "\n\033[1;31m[ERROR] The specified chase-car-dashboard-image (v$low_ver) does not support the \"$config\" configuration. The image must be v3.8.0 or newer.\033[0m\n"
		exit 1
	fi

	# Pull the engineering-data-distributor image with the specified tag
	docker pull ghcr.io/badgerloop-software/engineering-data-distributor-image:$dist_tag
fi

# Unless -o or --no-open was specified, open the dashboard
if [[ ! $no_open ]]; then
	[[ $OSTYPE != 'darwin'* ]] && cmd=xdg-open
	[[ $OSTYPE == 'darwin'* ]] && cmd=open
	if [[ -n $(command -v $cmd) ]]; then
		$cmd http://localhost:3000
	else
		echo -e "\nCould not run \`$cmd\`, please open 'http://localhost:3000' on your browser\n"
	fi
fi

# Create the Docker volume
path=`pwd`
mkdir -p recordedData
docker volume create --name chasecar --opt type=none --opt device=${path}/recordedData --opt o=bind

# Setting the time zone of host machine
[[ $OSTYPE == 'darwin'* ]] && timezone=`readlink /etc/localtime | sed 's#/var/db/timezone/zoneinfo/##g'`
[[ $OSTYPE != 'darwin'* ]] && timezone=`cat /etc/timezone`

# Arguments that remain constant for all instances of running the Docker images
const_chase_car_args="-e TZ=$timezone -p 3000:3000 -p 4001:4001 -v chasecar:/chase-car-dashboard/Backend/recordedData/processedData ghcr.io/badgerloop-software/chase-car-dashboard-image:$tag"
const_data_dist_args="-i -a stdin -a stdout -a stderr ghcr.io/badgerloop-software/engineering-data-distributor-image:$dist_tag"

# Run the image(s) according to the configuration specified
case $config in
	competition )
		# Run the chase-car-dashboard image
		docker run $const_chase_car_args
		;;
	dev )
		# Run the chase-car-dashboard image using `npm run start-dev`
		docker run $const_chase_car_args npm run start-dev
		;;
	individual )
		# Run the chase-car-dashboard image in the background using `npm run start-individual` and get the container's ID
		cid=$(docker run -d $const_chase_car_args npm run start-individual)

		# Get the commit hash of the sc1-data-format submodule in the running chase-car-dashboard container
		sha=$(docker exec $cid git submodule status | grep -oP "\S*(?= Backend/Data/sc1-data-format)")

		# Run the engineering-data-distributor image using the -i (individual) and -s (submodule SHA-1) options
		docker run --net=container:$cid $const_data_dist_args -- -i -s $sha
		;;
esac


#The server will be run at http://localhost:3000, it will take one to two minutes to start up
#if this window does not automatically pop up then please enter the URL manually
