# ---------------------------
# Stage 1 - Build
# ---------------------------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /src

# Copy dependency files
COPY package*.json ./

# Install ALL dependencies (including dev, needed for build)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript -> JavaScript
RUN npm run build

