#FROM node:16.14.0
#FROM nikolaik/python-nodejs
FROM nikolaik/python-nodejs:python3.10-nodejs16
#FROM nikolaik/python3.10-nodejs16-alpine
WORKDIR /chase-car-dashboard
RUN pip3 install xlsxwriter
RUN pip3 install numpy
COPY . .
RUN npm install
CMD ["npm", "start"]



