#!/bin/bash


usage="\033[1mSYNOPSIS
\t./linux-pull-run.sh\033[0m [\033[4mOPTIONS\033[0m]\n
\033[1mOPTIONS\033[0m
\t\033[1m-o\033[0m, \033[1m--no-open\033[0m
\t    Disables automatic opening of the dashboard.\n
\t\033[1m-t\033[0m <\033[4mTAG\033[0m>, \033[1m--tag\033[0m=<\033[4mTAG\033[0m>
\t    Specifies the tag of the image to pull and run. If no tag is specified, the image tagged \"latest\" will be used."


# validatearg: Checks if an argument was provided for a cerain field
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

# If a tag was specified as a CLA, use that. Otherwise, default to "latest" as the tag
tag=${tag:=latest}

# Pull the Docker image with the specified tag
docker pull ghcr.io/badgerloop-software/chase-car-dashboard-image:$tag

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

# Run the Docker image
docker run -p 3000:3000 ghcr.io/badgerloop-software/chase-car-dashboard-image:$tag

#The server will be run at http://localhost:3000, it will take one to two minutes to start up
#if this window does not automatically pop up then please enter the URL manually
