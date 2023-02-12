FROM node:16.14.0
WORKDIR /chase-car-dashboard
EXPOSE 4000/tcp
EXPOSE 4000/udp
COPY . .
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
CMD ["npm", "start"]