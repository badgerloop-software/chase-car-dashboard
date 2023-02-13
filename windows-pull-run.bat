@echo off

if not "%1"=="" (
    if not "%1"=="-o" (
        echo script usage: windows-pull-run.bat [-o]
        echo     -o: disables automatic opening of the browser
        exit /b 1
    )
)
docker pull ghcr.io/badgerloop-software/chase-car-dashboard-image:latest
if not "%1"=="-o" start http://localhost:4000

docker run -p 3000:3000 ghcr.io/badgerloop-software/chase-car-dashboard-image:latest

@REM #The server will be run at http://localhost:3000, it will take one to two minutes to start up
@REM #if this window does not automatically pop up then please enter the URL manually