# Agent Instructions for stt-service

## Commands
- **Build**: `cd api-gateway && npm run build` (TypeScript compilation)
- **Lint**: `cd api-gateway && npm run lint` (ESLint with TypeScript)
- **Format**: `cd api-gateway && npm run format` (Prettier)
- **Dev**: `cd api-gateway && npm run dev` (ts-node-dev with hot reload)
- **Test**: No test framework configured - run manual HTTP requests from `api-gateway/requests/`

## Code Style
- **TypeScript**: Strict mode enabled, ES6 target, CommonJS modules
- **Formatting**: Prettier with single quotes, semicolons, trailing commas, 120 char width, 2-space tabs
- **Linting**: TypeScript ESLint recommended rules with type checking, Prettier integration
- **Naming**: camelCase for variables/functions/methods, PascalCase for classes/interfaces/types
- **Imports**: Group imports (Node.js stdlib → third-party → local), use absolute paths within src/
- **Error Handling**: Use `unknown` type in catch blocks, return generic 500 responses to clients, log detailed errors
- **Async**: Use async/await pattern, run blocking operations in threads (asyncio.to_thread in Python)
- **Python**: FastAPI with Pydantic models, snake_case naming, type hints required

## Architecture Patterns
- **Microservices**: api-gateway (Node.js/TS) + whisper-service (Python/FastAPI)
- **Queueing**: BullMQ for async transcription jobs, Redis backend
- **File Handling**: Store uploads in `uploads/`, transcripts in `shared/transcripts/`
- **API Contract**: Gateway expects JSON responses from whisper-service

## Copilot Rules
Follow patterns in `.github/copilot-instructions.md`: queue-based processing, file path references, timestamped transcript naming, generic error responses.


## Documentation Index

Documentation lives in ./docs

### Core Documentation

• DECISIONS.md - Records major architectural decisions (microservice split, transcription
engine, queue pattern, file-based handoff, Docker Compose)
• DEVELOPMENT.md - Developer setup guide with prerequisites, installation instructions for
both services, testing approach
• ROADMAP.md - Project roadmap showing completed features 

### Architecture Documentation

• architecture/ARCHITECTURE_OVERVIEW.md - High-level system architecture describing
microservice components, data flow, queueing, storage, integration patterns, and
technologies
• architecture/PROJECT_STRUCTURE.md - Detailed project structure with file locations, naming
conventions, important symbols, environment variables, worker behavior, observability points,
and best practices

### Architecture Decision Records (ADRs)

• architecture/decisions/README.md - ADR process documentation explaining naming conventions,
folder structure, tags, workflow, and references
• architecture/decisions/TEMPLATE.md - Standard template for creating new ADRs with sections
for context, decision, rationale, consequences, and future evolution
• architecture/decisions/0001-database-location.md - Decision to place database within
api-gateway service, keeping whisper-service stateless
• architecture/decisions/0002-decoupling-database-access.md - Decision to implement
repository pattern within API Gateway to decouple business logic from persistence


## Documentation Conventions

### File Structure & Naming

• Main docs: Use UPPERCASE.md for core documentation
(DECISIONS.md, DEVELOPMENT.md, etc.)
• Architecture docs: Use PascalCase.md (ARCHITECTURE_OVERVIEW.
md, PROJECT_STRUCTURE.md)
• ADRs: Use ####-descriptive-title.md sequential numbering
(0001-database-location.md)
• Subdirectories: Group related docs
(architecture/decisions/)

### Content Structure

• Headers: Use # for main title, ## for major sections, ###
for subsections
• Tables: Use markdown tables for structured data (see
ROADMAP.md)
• Code blocks: Use triple backticks with language hints
• Lists: Use - for bullet points, numbered lists for steps
• Emojis: Use sparingly for visual hierarchy (✅ Done, 🟡
Current, 🟠 Later, 🔵 Future)

### ADR Specific Conventions

• Status: Include Status, Date, Tags at top
• Sections: Context → Decision → Rationale → Consequences →
Future Evolution
• Cross-references: Link related ADRs with [ADR 0001](.
/0001-database-location.md)
• Tags: Use #adr #architecture #tag1 #tag2 format

### Writing Style

• Concise: Keep descriptions brief and to the point
• Action-oriented: Focus on what developers need to know/do
• Examples: Include concrete examples and code snippets
• File paths: Use relative paths with backticks for file
references
• Environment variables: Use UPPER_CASE with backticks

### Formatting Patterns

• Separator lines: Use --- for major section breaks
• Quick overviews: Start with brief summary before deep
details
• Directory trees: Use ASCII art for structure visualization
• Metadata: Include dates, status, and versioning where
relevant