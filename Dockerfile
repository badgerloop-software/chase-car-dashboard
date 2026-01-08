FROM nikolaik/python-nodejs:python3.10-nodejs16
RUN pip install --upgrade pip && pip install poetry
WORKDIR /chase-car-dashboard
COPY . .
RUN npm install
CMD ["npm", "start"]
