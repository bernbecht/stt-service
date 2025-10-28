# Copilot Instructions for stt-service

## Project Architecture
- **Microservice structure:**
  - `api-gateway/` (Node.js/TypeScript): Handles REST API requests, file uploads, and routes requests to the transcription backend.
  - `whisper-service/` (Python): Runs the transcription logic using `faster-whisper` and exposes an internal API for the gateway.
- **Data flow:**
  1. Client uploads audio to `api-gateway` (`POST /stt/upload`)
  2. Gateway validates, stores, and forwards audio to `whisper-service`
  3. `whisper-service` transcribes and returns text
  4. Gateway responds to client
- **Queueing:**
  - `api-gateway/src/services/queue.ts` and `workers/transcription.worker.ts` handle async processing and job management.

## Key Conventions & Patterns
- **API endpoints:** Defined in `api-gateway/src/routes/` and implemented in `controllers/`
- **Middleware:** File upload logic in `api-gateway/src/middleware/upload.ts`
- **Transcription jobs:** Use a queue pattern; see `queue.ts` and `transcription.worker.ts`
- **Transcripts:** Saved in `shared/transcripts/` with filenames encoding audio and timestamp
- **Uploads:** Audio files stored in `uploads/` (gateway) and `shared/uploads/`
- **Python service:** Entrypoint is `whisper-service/app/main.py`; CLI in `cli.py`

## Developer Workflows
- **Run all services:** Use Docker Compose (see `README.md`)
- **Local dev (gateway):**
  - Install deps: `cd api-gateway && npm install`
  - Start: `npm run dev` (if script exists)
- **Local dev (whisper-service):**
  - Install deps: `cd whisper-service && pip install -r requirements.txt`
  - Start: `python app/main.py` or `bash start.sh`
- **Testing:**
  - HTTP requests: See `api-gateway/requests/` for `.httpie` scripts
- **Debugging:**
  - Inspect logs from both gateway and whisper-service containers

## Integration Points
- **API contract:** Gateway expects JSON/text from whisper-service
- **Audio file handoff:** Files are passed via path references or multipart/form-data
- **Transcription output:** Written to `shared/transcripts/` for later retrieval

## Examples
- To add a new API endpoint, update `routes/stt.routes.ts` and implement logic in `controllers/stt.controller.ts`
- To change transcription logic, edit `whisper-service/app/transcriber.py`

## References
- See `README.md` for architecture and setup
- See `.github/instructions/GENERAL_INSTRUCTIONS.instructions.md` for pair programming guidelines

---
**Keep instructions concise and focused on this codebase's actual patterns. Update as architecture evolves.**
