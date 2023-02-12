#!/bin/bash
docker pull ghcr.io/badgerloop-software/chase-car-dashboard-image:latest
[[ $OSTYPE != 'darwin'* ]] && xdg-open http://localhost:4000
[[ $OSTYPE == 'darwin'* ]] && open http://localhost:4000
docker run -p 4000:3000 ghcr.io/badgerloop-software/chase-car-dashboard-image:latest

