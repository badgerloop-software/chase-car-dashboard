@echo off
docker pull ghcr.io/badgerloop-software/chase-car-dashboard-image:latest
start http://localhost:4000
docker run -p 4000:3000 ghcr.io/badgerloop-software/chase-car-dashboard-image:latest