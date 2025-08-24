# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Build stage
FROM base AS build

# Install all dependencies including dev dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Production stage
FROM base AS production

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Expose port (if needed)
EXPOSE 3000

# Set the default command
CMD ["node", "dist/index.js"]
