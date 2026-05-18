# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies (including devDependencies for TypeScript compiler)
RUN npm ci

# Copy configuration and source files
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript to JavaScript
RUN npm run build

# Production Runtime Stage
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy compiled files from build stage
COPY --from=build /app/dist ./dist

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Start production server
CMD ["node", "dist/server.js"]
