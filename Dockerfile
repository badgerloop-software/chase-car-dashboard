FROM node:latest
WORKDIR /chase-car-dashboard
EXPOSE 4000/tcp
EXPOSE 4000/udp
#COPY package.json /chase-car-dashboard
#COPY package-lock.json /chase-car-dashboard
COPY . .
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
CMD ["npm", "start"]

