FROM node:16.14.0
WORKDIR /chase-car-dashboard
COPY . .
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
CMD ["npm", "start"]