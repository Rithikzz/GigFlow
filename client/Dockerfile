# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies including devDependencies for build
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the React application with environment variable placeholder support
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL:-http://localhost:5000/api/v1}

RUN npm run build

# Production Stage using Nginx to serve static files
FROM nginx:1.25-alpine

# Copy built React files to default Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for single-page routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
