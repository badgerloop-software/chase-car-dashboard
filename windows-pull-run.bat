@echo off
docker pull ghcr.io/badgerloop-software/chase-car-dashboard-image:latest
start http://localhost:4000
docker run -p 4000:3000 ghcr.io/badgerloop-software/chase-car-dashboard-image:latest

@REM #The server will be run at http://localhost:4000, it will take one to two minutes to start up
@REM #if this window does not automatically pop up then please enter the URL manually