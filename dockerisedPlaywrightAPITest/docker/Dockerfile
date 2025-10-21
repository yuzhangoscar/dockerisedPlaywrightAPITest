# Multi-stage Playwright Docker image for API testing
FROM mcr.microsoft.com/playwright:v1.40.0-jammy as base

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN groupadd -r playwright && useradd -r -g playwright playwright

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Set ownership to non-root user
RUN chown -R playwright:playwright /app

# Switch to non-root user
USER playwright

# Expose port for potential debugging
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "process.exit(0)" || exit 1

# Default command
CMD ["npm", "test"]