@ECHO OFF

setlocal enabledelayedexpansion

@REM Default to normal exit code
SET exitcode=0

GOTO loop


@REM printusage: Block to print the script's usage and exit with a specified exit code
:printusage
echo.
echo SYNOPSIS:
echo     windows-pull-run.bat [OPTIONS]
echo.
echo OPTIONS:
echo     -h, --help                        Displays this help message
echo     -o, --no-open                     Disables automatic opening of the dashboard in your browser
echo     -t ^<TAG^>, --tag=^<TAG^>             Specifies the tag of the dashboard image you want to pull/run.
echo                                       By default, the "latest" tag is used
echo     -d ^<TAG^>, --dist-tag=^<TAG^>        Specifies the tag of the engineering-data-distributor-image to pull and run.
echo                                       If no tag is specified, the image tagged "latest" will be used.
echo                                           - NOTE: The sc1-data-format submodule in the engineering-data-distributor-image
echo                                                   will automatically be synced with that of the chase-car-dashboard-image being run.
echo     -c ^<CONFIG^>, --config=^<CONFIG^>    Specifies the configuration in which to run the dasboard and data distribution server.
echo                                       The following are the available configurations:
echo                                       - "individual" (default^) (^>=v3.8.0^): Run both the chase-car-dashboard-image and the
echo                                           engineering-data-distributor-image on this computer. The engineering-data-distributor-image
echo                                           will receive data from the solar car and pass it to the local instance of the dashboard.
echo                                           - NOTE: In order to run this configuration, you must have connection to the Internet and/or
echo                                                   a radio connection to the solar car. If you have both, ensure that your routing table is
echo                                                   set up such that you do not have a default route to the solar car via the radio interface.
echo                                                   You can test the connections by pinging google.com and 192.168.1.15 or 192.168.1.17.
echo                                                   Additionally, ensure that you have inbound and outbound firewall rules allowing remote
echo                                                   IP addresses 192.168.1.200, 192.168.1.20, and 192.168.1.17 to communicate with the
echo                                                   local IP address 192.168.1.16 via TCP through port 4003.
echo                                       - "competition": Run only the chase-car-dashboard-image on this computer. This computer will be
echo                                           connected to another device running the engineering-data-distributor-image via a LAN.
echo                                           The device running the distribution server will receive data from the solar car and pipe it to
echo                                           the computers connected to it.
echo                                           - NOTE: In order to run this configuration, the ethernet port connected to the device running
echo                                                   the distribution server has to be on the 192.168.1.0/24 subnet, and it cannot have an
echo                                                   IP address in the following range: 192.168.1.15-17. Additionally, ensure that you have
echo                                                   inbound and outbound firewall rules allowing the remote IP address 192.168.1.15 to
echo                                                   communicate with local IP addresses on the 192.168.1.0/24 subnet via TCP through port 4003.
echo                                       - "dev": Run only the chase-car-dashboard-image on this computer. This configuration will run the data
echo                                           generator within the dashboard to create random mock datasets to display.

exit /b %exitcode%


@REM badargerror: Block for erroring out due to a bad argument being provided
:badargerror
echo.
powershell write-host -fore Red [ERROR] Bad argument: %1
SET exitcode=1
GOTO printusage


@REM multipledisttagserror: Block for erroring out due to multiple engineering-data-distributor-image tags being specified
:multipledisttagserror
echo.
powershell write-host -fore Red [ERROR] Provided more than one engineering-data-distributor-image tag
SET exitcode=1
GOTO printusage


@REM multipletagserror: Block for erroring out due to multiple chase-car-dashboard-image tags being specified
:multipletagserror
echo.
powershell write-host -fore Red [ERROR] Provided more than one chase-car-dashboard-image tag
SET exitcode=1
GOTO printusage


@REM multipleconfigserror: Block for erroring out due to multiple run configurations being specified
:multipleconfigserror
echo.
powershell write-host -fore Red [ERROR] Provided more than one run configuration
SET exitcode=1
GOTO printusage


@REM emptytagerror: Block for erroring out due to an empty tag being specified
:emptytagerror
echo.
powershell write-host -fore Red '[ERROR] No tag provided for %1'
SET exitcode=1
GOTO printusage


@REM emptyconfigerror: Block for erroring out due to an empty configuration being specified
:emptyconfigerror
echo.
powershell write-host -fore Red [ERROR] No configuration provided for %1
SET exitcode=1
GOTO printusage


@REM invalidconfigerror: Block for erroring out due to an invalid configuration being specified
:invalidconfigerror
echo.
powershell write-host -fore Red [ERROR] Bad run configuration: %config%
SET exitcode=1
GOTO printusage


@REM setnoopen: Block to set the flag to prevent opening of the dashboard in a browser
:setnoopen
SHIFT
SET no_open=true
GOTO loop


@REM settag: Block to set the chase-car-dashboard-image tag as specified by the CLAs
:settag
SET tag=%2

@REM Remove quotes around/in the tag value
@REM Need to check if config is truly empty to avoid errors with findstr below
IF "%tag%"=="" GOTO emptytagerror
IF %tag%=="" GOTO emptytagerror
IF %tag%=='' GOTO emptytagerror
SET tag=%tag:"=%
SET tag=%tag:'=%

echo %tag%|findstr /r /c:"^-.*"
IF errorlevel 1 (
	IF "%tag%"=="" GOTO emptytagerror
) ELSE (
	GOTO emptytagerror
)

SHIFT
SHIFT
GOTO loop


@REM setdisttag: Block to set the engineering-data-distributor-image tag as specified by the CLAs
:setdisttag
SET disttag=%2

@REM Remove quotes around/in the disttag value
@REM Need to check if config is truly empty to avoid errors with findstr below
IF "%disttag%"=="" GOTO emptytagerror
IF %disttag%=="" GOTO emptytagerror
IF %disttag%=='' GOTO emptytagerror
SET disttag=%disttag:"=%
SET disttag=%disttag:'=%

echo %disttag%|findstr /r /c:"^-.*"
IF errorlevel 1 (
	IF "%disttag%"=="" GOTO emptytagerror
) ELSE (
	GOTO emptytagerror
)

SHIFT
SHIFT
GOTO loop


@REM setconfig: Block to set the run configuration as specified by the CLAs
:setconfig
SET config=%2

@REM Remove quotes around/in the configuration value
@REM Need to check if config is truly empty to avoid errors with findstr below
IF "%config%"=="" GOTO emptyconfigerror
IF %config%=="" GOTO emptyconfigerror
IF %config%=='' GOTO emptyconfigerror
SET config=%config:"=%
SET config=%config:'=%

echo %config%|findstr /r /c:"^-.*"
IF errorlevel 1 (
	IF "%config%"=="" GOTO emptyconfigerror
) ELSE (
	GOTO emptyconfigerror
)

SET validconfig=no

IF "%config%"=="competition" SET validconfig=yes
IF "%config%"=="individual" SET validconfig=yes
IF "%config%"=="dev" SET validconfig=yes

IF "%validconfig%"=="no" GOTO invalidconfigerror

SHIFT
SHIFT
GOTO loop


:loop
IF NOT "%1"=="" (
	@REM Reset tagaction, disttagaction, and configaction so that they do not run in the next iteration of the loop
	SET tagaction=
	SET disttagaction=
	SET configaction=

	@REM Handle no open options
	IF "%1"=="-o" GOTO setnoopen
	IF "%1"=="--no-open" GOTO setnoopen
	
	@REM Handle tag options
	IF "%1"=="-t" SET tagaction=set
	IF "%1"=="--tag" SET tagaction=set
	IF "%1"=="--tag=*" (
		SET tagaction=set
	)
	
	@REM Set tag if parsing a tag option
	IF "!tagaction!"=="set" (
		@REM Check if a tag has already been set. If so, throw an error
		IF NOT "%tag%"=="" (
			GOTO multipletagserror
		)
		
		GOTO settag
	)

	@REM Handle dist tag options
	IF "%1"=="-d" SET disttagaction=set
	IF "%1"=="--dist-tag" SET disttagaction=set
	IF "%1"=="--dist-tag=*" (
		SET disttagaction=set
	)
	
	@REM Set disttag if parsing a dist tag option
	IF "!disttagaction!"=="set" (
		@REM Check if a disttag has already been set. If so, throw an error
		IF NOT "%disttag%"=="" (
			GOTO multipledisttagserror
		)
		
		GOTO setdisttag
	)
	
	@REM Handle configuration options
	IF "%1"=="-c" SET configaction=set
	IF "%1"=="--config" SET configaction=set
	IF "%1"=="--config=*" (
		SET configaction=set
	)

	@REM Set config if parsing a configuration option
	IF "!configaction!"=="set" (
		@REM Check if a configuration has already been set. If so, throw an error
		IF NOT "%config%"=="" (
			GOTO multipleconfigserror
		)
		
		GOTO setconfig
	)
	
	@REM Handle help options
	IF "%1"=="-h" SET help=true
	IF "%1"=="--help" SET help=true
	IF "!help!"=="true" (
		GOTO printusage
	)
	
	@REM If the argument was none of the above, it's invalid
	GOTO badargerror
)

@REM Set default values for options that were not provided as command line arguments
IF "%tag%"=="" SET tag=latest
IF "%disttag%"=="" SET disttag=latest
IF "%config%"=="" SET config=individual

@REM Setting timezone correctly
for /f %%i in ('powershell -executionpolicy remotesigned -File .\convertTZstamp.ps1') do set timezone=%%i

@REM Pull the dashboard image
docker pull ghcr.io/badgerloop-software/chase-car-dashboard-image:%tag%

@REM Validate the version of the image if the "individual" configuration was specified
IF "%config%"=="individual" (
	@REM Create a temporary container to parse package.json for the image's version. If it is lower than 3.8.0, making it
	@REM incompatible with the "individual" configuration, store it in low_ver so that the script can exit below
	> tempchasecardashboardversion.txt (
		docker run --rm ghcr.io/badgerloop-software/chase-car-dashboard-image:%tag% bash -c "grep -oP '(?<=\"version\": \"^)\d\.\d\.\d' package.json ^> v; if [[ $^(cut -d '.' -f 1 v^) -lt 3 ^|^| ^($^(cut -d '.' -f 1 v^) -eq 3 ^&^& $^(cut -d '.' -f 2 v^) -lt 8^) ]]; then cat v; fi"
	)
	SET /p low_ver=<tempchasecardashboardversion.txt
	DEL tempchasecardashboardversion.txt

	IF NOT "!low_ver!"=="" (
		echo.
		powershell write-host -fore Red '[ERROR] The specified chase-car-dashboard-image ^(v!low_ver!^) does not support the \"%config%\" configuration. The image must be v3.8.0 or newer.'
		echo.
		exit /b 1
	)

	@REM Pull the engineering-data-distributor image with the specified tag
	docker pull ghcr.io/badgerloop-software/engineering-data-distributor-image:%disttag%
)

@REM Open the dashboard if no open wasn't specified
IF NOT "%no_open%"=="true" start http://localhost:3000

@REM Create the Docker volume
SET recdatapath=%cd%
mkdir recordedData
docker volume create --name chasecar --opt type=none --opt device=%recdatapath%/recordedData --opt o=bind

@REM Arguments that remain constant for all instances of running the Docker images
SET "const_chase_car_args=-e TZ=%timezone% -p 3000:3000 -p 4001:4001 -v chasecar:/chase-car-dashboard/Backend/recordedData/processedData ghcr.io/badgerloop-software/chase-car-dashboard-image:%tag%"
SET "const_data_dist_args=-i -a stdin -a stdout -a stderr ghcr.io/badgerloop-software/engineering-data-distributor-image:%disttag%"

@REM Run the image(s) according to the configuration specified
IF "%config%"=="competition" (
	@REM Run the chase-car-dashboard image
	docker run %const_chase_car_args%
) ELSE IF "%config%"=="dev" (
	@REM Run the chase-car-dashboard image using `npm run start-dev`
	docker run %const_chase_car_args% npm run start-dev
) ELSE IF "%config%"=="individual" (
	@REM Run the chase-car-dashboard image in the background using `npm run start-individual` and get the container's ID
	> tempchasecardashboardcid.txt (docker run -d %const_chase_car_args% npm run start-individual)
	SET /p cid=<tempchasecardashboardcid.txt
	DEL tempchasecardashboardcid.txt

	@REM Get the commit hash of the sc1-data-format submodule in the running chase-car-dashboard container
	> tempchasecardashboardsha.txt (
		docker exec !cid! bash -c "git submodule status ^| grep -oP '\S*(?= Backend/Data/sc1-data-format)'"
	)
	SET /p sha=<tempchasecardashboardsha.txt
	DEL tempchasecardashboardsha.txt
	echo sha is !sha!

	@REM If sha is empty, throw an error and provide a possible explanation
	IF "!sha!"=="" (
		echo.
		powershell write-host -fore Red [ERROR] The sc1-data-format SHA-1 read from the chase-car-dashboard-image container is empty. This may be caused by already running chase-car-dashboard-image containers. Please stop all containers and try again.
		echo.
		exit /b 1
	)

	@REM Run the engineering-data-distributor image using the -i (individual) and -s (submodule SHA-1) options
	docker run --net=container:!cid! %const_data_dist_args% -- -i -s !sha!
)


@REM #The server will be run at http://localhost:3000, it will take one to two minutes to start up
@REM #if this window does not automatically pop up then please enter the URL manually
