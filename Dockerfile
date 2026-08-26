# Stage 1: Build React/Vite application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Build the Vite application
RUN npm run build


# Stage 2: Serve application with Nginx
FROM nginx:alpine

# Remove default Nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]