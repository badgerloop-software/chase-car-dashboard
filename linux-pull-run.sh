#!/bin/bash
docker pull ghcr.io/badgerloop-software/chase-car-dashboard-image:latest
[[ $OSTYPE != 'darwin'* ]] && xdg-open http://localhost:4000
[[ $OSTYPE == 'darwin'* ]] && open http://localhost:4000
docker run -p 4000:3000 ghcr.io/badgerloop-software/chase-car-dashboard-image:latest

#The server will be run at http://localhost:4000, it will take one to two minutes to start up
#if this window does not automatically pop up then please enter the URL manually