# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and compile TypeScript
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy compiled output and package metadata
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Run as non-root user for security
USER node

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/index.js"]
