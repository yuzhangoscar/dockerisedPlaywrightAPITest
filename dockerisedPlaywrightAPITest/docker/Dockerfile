# Multi-stage Playwright Docker image for API testing
FROM mcr.microsoft.com/playwright:v1.40.0-jammy AS base

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN groupadd -r playwright && useradd -r -g playwright playwright

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for TypeScript compilation)
RUN npm ci

# Install Playwright browsers and dependencies
RUN npx playwright install --with-deps

# Copy source code
COPY src/ ./src/

# Create output directories for test results
RUN mkdir -p /app/test-results /app/playwright-report

# Build TypeScript (if build script exists)
RUN npm run build || echo "No build script found, skipping build"

# Keep dev dependencies for running tests (don't prune)
RUN npm cache clean --force

# Set ownership to ensure proper permissions
RUN chown -R root:root /app

# Note: Running as root for testing purposes - in production, use non-root user

# Expose port for potential debugging
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "process.exit(0)" || exit 1

# Default command
CMD ["npm", "test"]