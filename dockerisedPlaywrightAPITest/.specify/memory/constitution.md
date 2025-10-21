<!--
Sync Impact Report:
- Version change: initial → 1.0.0
- Added sections: All initial sections with TypeScript/Playwright focus
- Modified principles: All customized for Playwright E2E testing in TypeScript
- Templates requiring updates: ✅ Constitution created with project-specific rules
- Follow-up TODOs: None - all placeholders filled
-->

# dockerisedPlaywrightAPITest Constitution

## Core Principles

### I. TypeScript-First Development (NON-NEGOTIABLE)
All code MUST be written in TypeScript with strict type checking enabled. Double quotes MUST be used for all string literals consistently throughout the codebase. No JavaScript files are permitted except for configuration files where TypeScript is not supported.

**Rationale**: Ensures type safety, maintainability, and consistent code style across the project.

### II. Playwright E2E Testing Excellence
All end-to-end tests MUST be implemented using Playwright framework. Tests MUST be comprehensive, covering positive flows, error scenarios, and edge cases. Each test case MUST complete execution within 4 minutes maximum to maintain efficient CI/CD pipeline performance.

**Rationale**: Playwright provides robust cross-browser testing capabilities while time limits ensure scalable test suites.

### III. Clear Documentation Through Comments
All major steps in test flows MUST be documented with clear, descriptive comments. Complex logic, API interactions, and business rule implementations MUST include explanatory comments describing the purpose and expected behavior.

**Rationale**: Enhances code readability, maintainability, and team collaboration by making test intentions explicit.

### IV. Dockerized Environment Consistency
All tests MUST execute within Docker containers to ensure consistent runtime environments. Docker configurations MUST be version-controlled and reproducible across development, testing, and production environments.

**Rationale**: Eliminates environment-specific issues and ensures reliable test execution across different systems.

### V. Comprehensive Test Coverage
E2E test suites MUST cover all critical user journeys and API endpoints. Tests MUST validate both functional requirements and non-functional aspects like performance, security, and error handling within the 4-minute execution limit per test case.

**Rationale**: Ensures product quality and reliability while maintaining efficient test execution times.

## Code Standards

### TypeScript Requirements
- Strict mode MUST be enabled in tsconfig.json
- All variables, functions, and classes MUST have explicit type annotations
- Double quotes MUST be used for all string literals: `"example string"`
- ESLint rules MUST enforce TypeScript best practices
- No `any` types permitted except in exceptional, documented cases

### Comment Standards
- Every test file MUST begin with a description comment explaining its purpose
- Major test steps MUST be preceded by comments describing the action
- Complex selectors or waits MUST include explanatory comments
- API response validations MUST be commented with expected behavior

## Development Workflow

### Commit Message Standards
All commit messages MUST follow this format:
- `[DOC]` prefix for documentation changes, README updates, comment additions
- `[CODE]` prefix for functional code changes, new tests, bug fixes
- Messages MUST be descriptive: `[CODE] Add login flow E2E test with timeout validation`

### Performance Standards  
- Individual test cases MUST complete within 4 minutes maximum
- Test suites MUST be optimized for parallel execution where possible
- Unnecessary waits and sleeps MUST be avoided in favor of explicit waits
- Resource cleanup MUST be performed after each test to prevent memory leaks

### Docker Integration
- All test environments MUST use Docker Compose for orchestration
- Container health checks MUST be implemented for all services
- Test data and configurations MUST be externalized through environment variables
- Container images MUST be tagged with semantic versioning

## Governance

This constitution supersedes all other development practices and coding standards. All code reviews MUST verify compliance with these principles before approval. Any deviation requires documented justification and team consensus.

All pull requests MUST pass automated checks for TypeScript compilation, linting, and test execution within time limits. Complexity introduced must be justified and documented with appropriate comments.

**Version**: 1.0.0 | **Ratified**: 2025-10-21 | **Last Amended**: 2025-10-21
