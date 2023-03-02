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
echo     -h, --help               Displays this help message
echo     -o, --no-open            Disables automatic opening of the dashboard in your browser
echo     -t ^<TAG^>, --tag=^<TAG^>    Specifies the tag of the dashboard image you want to pull/run.
echo                              By default, the "latest" tag is used

exit /b %exitcode%


@REM badargerror: Block for erroring out due to a bad argument being provided
:badargerror
echo.
powershell write-host -fore Red [ERROR] Bad argument: %1
SET exitcode=1
GOTO printusage


@REM multipletagserror: Block for erroring out due to multiple tags being specified
:multipletagserror
echo.
powershell write-host -fore Red [ERROR] Provided more than one tag
SET exitcode=1
GOTO printusage


@REM emptytagerror: Block for erroring out due to an empty tag being specified
:emptytagerror
echo.
powershell write-host -fore Red [ERROR] No tag provided for %1
SET exitcode=1
GOTO printusage


@REM setnoopen: Block to set the flag to prevent opening of the dashboard in a browser
:setnoopen
SHIFT
SET no_open=true
GOTO loop


@REM settag: Block to set the image tag as specified by the CLAs
:settag
SET tag=%2

echo %tag%|findstr /r /c:"^-.*"
IF errorlevel 1 (
	IF "%tag%"=="" GOTO emptytagerror
) ELSE (
	GOTO emptytagerror
)

SHIFT
SHIFT
GOTO loop


:loop
IF NOT "%1"=="" (
	@REM Reset tagaction so that this does not run in the next iteration of the loop
	SET tagaction=
	
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
	
	@REM Handle help options
	IF "%1"=="-h" SET help=true
	IF "%1"=="--help" SET help=true
	IF "!help!"=="true" (
		GOTO printusage
	)
	
	@REM If the argument was none of the above, it's invalid
	GOTO badargerror
)

@REM If a tag was not specified, use "latest" as the tag
IF "%tag%"=="" SET tag=latest

@REM Pull the dashboard image
docker pull ghcr.io/badgerloop-software/chase-car-dashboard-image:%tag%

@REM Open the dashboard if no open wasn't specified
IF NOT "%no_open%"=="true" start http://localhost:3000

@REM Run the dashboard image
docker run -p 3000:3000 ghcr.io/badgerloop-software/chase-car-dashboard-image:%tag%

@REM #The server will be run at http://localhost:3000, it will take one to two minutes to start up
@REM #if this window does not automatically pop up then please enter the URL manually
