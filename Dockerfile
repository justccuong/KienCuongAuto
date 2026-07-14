# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
# If VITE_API_URL is configured to be environment-specific at build time:
# ARG VITE_API_URL=/api
# ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Install backend dependencies (with build tools for bcrypt compilation)
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

# Install compilation tools needed for native packages like bcrypt
RUN apk add --no-cache python3 make g++

COPY backend/package*.json ./
RUN npm ci --only=production

# Stage 3: Run the application in a lightweight container
FROM node:20-alpine AS runner
WORKDIR /app

# Copy production backend dependencies
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/

# Copy static frontend assets (Express serves this via static middleware)
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose backend port and set runtime env
WORKDIR /app/backend
EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]
