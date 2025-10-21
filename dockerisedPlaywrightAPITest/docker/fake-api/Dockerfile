# Lightweight Node.js server for fake API endpoints
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S apiuser && \
    adduser -S apiuser -u 1001

# Copy server files
COPY package*.json ./
COPY server.js ./
COPY data/ ./data/

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Set ownership
RUN chown -R apiuser:apiuser /app

# Switch to non-root user
USER apiuser

# Expose API port
EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the API server
CMD ["node", "server.js"]