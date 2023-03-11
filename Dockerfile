FROM node:16.14.0
WORKDIR /chase-car-dashboard
COPY . .
RUN npm install
CMD ["npm", "start"]