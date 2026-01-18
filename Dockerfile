# Chase Car Dashboard - Local Development Docker Image
# Supports Redis TimeSeries for full functionality

FROM nikolaik/python-nodejs:python3.11-nodejs20

# Install poetry
RUN pip install --upgrade pip && pip install poetry

WORKDIR /chase-car-dashboard

# Copy dependency files first for better caching
COPY package.json ./
COPY Backend/pyproject.toml Backend/poetry.lock* ./Backend/
COPY Frontend/package.json ./Frontend/
COPY DataGenerator/package.json ./DataGenerator/
COPY DataReplayer/package.json ./DataReplayer/

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables for local mode
ENV DEPLOYMENT_MODE=local
ENV USE_TIMESERIES=true
ENV ENABLE_SERIAL=false
ENV ENABLE_UDP=true
ENV ENABLE_CONVEX=false

# Expose ports
# 4001 - Backend API/WebSocket
# 3000 - Frontend (if running in dev mode)
EXPOSE 4001 3000

# Default command starts both backend and frontend
CMD ["npm", "start"]
