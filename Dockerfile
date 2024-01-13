FROM nikolaik/python-nodejs:python3.10-nodejs16
WORKDIR /chase-car-dashboard
COPY . .
RUN npm install
CMD ["npm", "start"]
