# Architecture Overview

This project is a microservice-based speech-to-text (STT) system with two main components:

- **api-gateway/** (Node.js/TypeScript): Handles REST API requests, file uploads, and routes jobs to the backend.
- **whisper-service/** (Python): Runs transcription using `faster-whisper` and exposes an internal API.

## Data Flow
1. Client uploads audio to `api-gateway` (`POST /stt/upload`)
2. Gateway validates, stores, and forwards audio to `whisper-service`
3. `whisper-service` transcribes and returns text
4. Gateway responds to client

## Queueing
- Async job management via `queue.ts` and `transcription.worker.ts`.

## Storage
- Audio files: `uploads/` (gateway), `shared/uploads/`
- Transcripts: `shared/transcripts/` (filename encodes audio and timestamp)

## Integration
- API contract: JSON/text between gateway and whisper-service
- File handoff: Path references or multipart/form-data

## Technologies
- Node.js, TypeScript, Python, Docker Compose

---
See also: `README.md`, `.github/copilot-instructions.md`.
