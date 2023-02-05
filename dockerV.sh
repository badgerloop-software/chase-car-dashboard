#!/bin/bash
docker build -t chase-car-dashboard .
docker run -p 4000:3000 chase-car-dashboard