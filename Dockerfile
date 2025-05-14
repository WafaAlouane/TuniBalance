# syntax=docker/dockerfile:1

# Build stage for client
FROM node:18-alpine AS client-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Build stage for server
FROM node:18-alpine AS server-build

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built client as static assets
COPY --from=client-build /app/client/dist /app/client-dist

# Copy server build artifacts
COPY --from=server-build /app/server/dist /app/dist
COPY --from=server-build /app/server/node_modules /app/node_modules
COPY --from=server-build /app/server/package*.json /app/

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "start:prod"]
