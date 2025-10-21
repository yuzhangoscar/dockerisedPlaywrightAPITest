# Docker Configuration for Playwright API Testing

## Playwright Docker Image

**Current Image**: `mcr.microsoft.com/playwright:v1.40.0-jammy`
**Last Updated**: October 2025
**Base OS**: Ubuntu 22.04 LTS (Jammy)

### Image Details

- **Official Microsoft Container Registry**: Ensures stability and security
- **Pre-installed Browsers**: Chromium, Firefox, WebKit with dependencies
- **Node.js Version**: 18.x LTS included
- **TypeScript Support**: Ready for TypeScript compilation
- **API Testing Ready**: Includes all required dependencies for Playwright API testing

### Version Strategy

- Use specific version tags (not `latest`) for reproducible builds
- Update quarterly or when critical security patches are available
- Test image updates in development before deploying to CI/CD
- Document version changes in git commit messages with `[DOC]` prefix

### Performance Optimizations

- Multi-stage builds to minimize final image size
- Layer caching for faster subsequent builds
- Only install required dependencies for API testing (no browser UI dependencies)
- Use `.dockerignore` to exclude unnecessary files

### Security Considerations

- Official Microsoft images receive regular security updates
- Base image vulnerability scanning recommended
- No additional package installations unless absolutely necessary
- Run containers with non-root user when possible

## Fake API Server Configuration

**Base Image**: `node:18-alpine`
**Purpose**: Lightweight Express.js server for mock API endpoints
**Optimization**: Alpine Linux for minimal footprint and faster startup

### Container Communication

- **Network**: Docker Compose internal network
- **API Server Port**: 3000 (internal), configurable external mapping
- **Test Runner**: Communicates via service name resolution
- **Health Checks**: Implemented for service dependency management