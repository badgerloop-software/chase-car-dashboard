#!/bin/bash
docker pull ghcr.io/badgerloop-software/chase-car-dashboard-image:latest
docker run -p 4000:3000 ghcr.io/badgerloop-software/chase-car-dashboard-image:latest
open https://localhost:3000
