# Chase Car Dashboard - Local Development Docker Image
# Supports Redis TimeSeries for full functionality

FROM nikolaik/python-nodejs:python3.11-nodejs20

# Install poetry
RUN pip install --upgrade pip && pip install poetry

WORKDIR /chase-car-dashboard

# Copy package files for caching
COPY package.json ./
COPY Frontend/package.json ./Frontend/
COPY DataGenerator/package.json ./DataGenerator/
COPY DataReplayer/package.json ./DataReplayer/

# Install root dependencies only (skip postinstall)
RUN npm install --legacy-peer-deps --ignore-scripts

# Copy the rest of the application
COPY . .

# Now install all dependencies with full context
RUN npm run install-data-generator && \
    npm run install-data-replayer && \
    npm run install-frontend && \
    cd Backend && poetry install

# Set environment variables for local mode
ENV DEPLOYMENT_MODE=local
ENV USE_TIMESERIES=true
ENV ENABLE_SERIAL=false
ENV ENABLE_UDP=true
ENV ENABLE_SUPABASE=false

# Expose ports
# 4001 - Backend API/WebSocket
# 3000 - Frontend (if running in dev mode)
EXPOSE 4001 3000

# Default command starts both backend and frontend
CMD ["npm", "start"]
