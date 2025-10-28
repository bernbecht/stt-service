# Decision Log

This document records major architectural and technology decisions for the STT service.

## Microservice Split
- **Decision:** Separate gateway (Node.js) and transcription (Python) services.
- **Rationale:** Leverage best tools for API and ML workloads; easier scaling and maintenance.

## Transcription Engine
- **Decision:** Use `faster-whisper` in Python.
- **Rationale:** State-of-the-art accuracy and performance for speech-to-text.

## Queue Pattern
- **Decision:** Use queue for async transcription jobs.
- **Rationale:** Decouples request handling from heavy processing; improves reliability.

## File-based Handoff
- **Decision:** Pass audio files and transcripts via shared directories.
- **Rationale:** Simple, robust, avoids network file transfer issues.

## Docker Compose
- **Decision:** Use Docker Compose for orchestration.
- **Rationale:** Simplifies local dev and deployment.

## Alternatives Considered
- Direct HTTP streaming (rejected for simplicity)
- Centralized DB for transcripts (rejected for MVP)

---
Update this log as new decisions are made.
