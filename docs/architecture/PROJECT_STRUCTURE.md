# Project Structure & Conventions — stt-service

This document describes the repository layout, where code lives, naming conventions, and important integration points for the Speech-to-Text microservice.

---

## Quick overview
- Two main services:
  - `api-gateway/` (Node.js + TypeScript) — public REST API, upload handling, job queueing.
  - `whisper-service/` (Python / FastAPI + faster-whisper) — internal transcription engine.
- Shared files: `shared/` holds uploads and transcripts used for file handoff.
- Queue used: BullMQ (Redis-backed). Worker processes queued transcription jobs.

---

## Top-level layout
- [api-gateway/](api-gateway) — Node/TS gateway and worker
  - [api-gateway/src/app.ts](api-gateway/src/app.ts) — main Express app, routes mounting, admin dashboard
  - [api-gateway/src/routes/stt.routes.ts](api-gateway/src/routes/stt.routes.ts) — API routes (upload endpoint)
  - [api-gateway/src/controllers/stt.controller.ts](api-gateway/src/controllers/stt.controller.ts) — upload handler, enqueues jobs (`transcribeAudio`)
  - [api-gateway/src/middleware/upload.ts](api-gateway/src/middleware/upload.ts) — multer storage for uploads
  - [api-gateway/src/services/queue.ts](api-gateway/src/services/queue.ts) — BullMQ queue instance (`transcriptions`)
  - [api-gateway/src/services/whisper.client.ts](api-gateway/src/services/whisper.client.ts) — HTTP client to whisper-service (or mock)
  - [api-gateway/workers/transcription.worker.ts](api-gateway/workers/transcription.worker.ts) — background worker consuming queue and calling whisper-client
  - [api-gateway/package.json](api-gateway/package.json), tsconfig, lint/format configs
- [whisper-service/](whisper-service) — Python transcription service
  - [whisper-service/app/main.py](whisper-service/app/main.py) — FastAPI entrypoint; `/transcribe` endpoint and `save_transcription` helper
  - [whisper-service/app/transcriber.py](whisper-service/app/transcriber.py) — wrapper around `faster_whisper` model and helpers (`transcribe_file`, `transcribe_bytes`, `transcribe_uploadfile`, `get_model`)
  - [whisper-service/cli.py](whisper-service/cli.py) — simple CLI calling `transcribe_file`
  - [whisper-service/requirements.txt](whisper-service/requirements.txt), `start.sh`
- [shared/](shared) — intended for cross-service files:
  - `shared/uploads/` — (convention) shared audio storage
  - `shared/transcripts/` — saved transcripts (see naming below)
- [docs/](docs) — architecture, examples, integration guides
  - [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/INTEGRATION.md](docs/INTEGRATION.md), etc.
- Root files: `README.md`, `.github/` instruction files, `.gitignore`

---

## Important files & symbols (quick links)
- [`transcribeAudio`](api-gateway/src/controllers/stt.controller.ts) — enqueue logic for uploads.
- [`transcriptionQueue`](api-gateway/src/services/queue.ts) — BullMQ queue instance (`"transcriptions"`).
- [`sendAudioFileToWhisper`](api-gateway/src/services/whisper.client.ts) — sends { path } JSON to whisper API or returns mock.
- [api-gateway/workers/transcription.worker.ts](api-gateway/workers/transcription.worker.ts) — worker that calls whisper client and updates transcription status.
- [`transcribe_file`](whisper-service/app/transcriber.py) — transcribe a local file and return structured result.
- [whisper-service/app/main.py](whisper-service/app/main.py) — `/transcribe` endpoint that accepts JSON body `{ "path": "<abs path>" }` and saves transcripts via `save_transcription`.

---

## Naming & file conventions

- Queue:
  - Queue name: `"transcriptions"` (defined in [api-gateway/src/services/queue.ts](api-gateway/src/services/queue.ts) and worker).
- Uploads:
  - Upload middleware writes to `UPLOAD_DIR` (env var `SHARED_UPLOADS_DIR` or `api-gateway/uploads/` by default).
  - Filenames created by multer: `<timestamp>-<original_name_with_spaces_replaced>`. See [api-gateway/src/middleware/upload.ts](api-gateway/src/middleware/upload.ts).
- Transcript files:
  - Saved to `SHARED_TRANSCRIPTS_DIR` (env var; default: `/home/bbp/projects/stt-service/shared/transcripts`) by [whisper-service/app/main.py](whisper-service/app/main.py).
  - Naming pattern: `<upload-base-name>-<YYYY-MM-DD-HH-MM-SS>.txt`
    - Example: `1761667210260-audio.m4a-2025-10-28-13-03-30.txt` (see [docs/EXAMPLES.md](docs/EXAMPLES.md)).
  - Content: plaintext transcription (the Python service also returns a structured JSON with metadata).
- API contract:
  - Whisper service expects { "path": "<absolute_path_to_audio>" } POST JSON to `/transcribe` (see [whisper-service/app/main.py](whisper-service/app/main.py)).
  - Gateway sends `{ path: filePath }` in [api-gateway/src/services/whisper.client.ts](api-gateway/src/services/whisper.client.ts).
- Environment variables (common)
  - `WHISPER_API_URL` — endpoint for whisper service (defaults to `http://localhost:8000/transcribe`)
  - `USE_MOCK_WHISPER` — when truthy, gateway/worker uses mock response
  - `SHARED_UPLOADS_DIR` — directory for persisted uploads
  - `SHARED_TRANSCRIPTS_DIR` — directory to write transcripts (used by `whisper-service`)
  - `REDIS_URL` — Redis connection for BullMQ (default `redis://localhost:6379`)
  - `PORT` — gateway port (default 3000)
- Worker behavior:
  - Worker processes transcription jobs and updates status in database (see [api-gateway/workers/transcription.worker.ts](api-gateway/workers/transcription.worker.ts)).
  - Note: Audio files are NOT automatically deleted after processing - cleanup strategy needs to be implemented.
  - Job attempts/backoff configured when job is added in [`transcribeAudio`](api-gateway/src/controllers/stt.controller.ts) (attempts: 3, backoff: 1000 ms).

---

## Directory & file tree (concise)
```
/home/bbp/projects/stt-service
├─ api-gateway/
│  ├─ src/
│  │  ├─ app.ts
│  │  ├─ load-env.js
│  │  ├─ routes/stt.routes.ts
│  │  ├─ controllers/stt.controller.ts
│  │  ├─ middleware/upload.ts
│  │  └─ services/
│  │     ├─ queue.ts
│  │     └─ whisper.client.ts
│  └─ workers/
│     └─ transcription.worker.ts
├─ whisper-service/
│  ├─ app/
│  │  ├─ main.py
│  │  └─ transcriber.py
│  ├─ cli.py
│  └─ requirements.txt
├─ shared/
│  ├─ uploads/          (convention)
│  └─ transcripts/
└─ docs/
   ├─ ARCHITECTURE.md
   ├─ INTEGRATION.md
   └─ PROJECT_STRUCTURE.md  (this file)
```

---


## Observability & debug points
- Logs:
  - Gateway and worker use console logging. Inspect stdout from `npm run dev` and `npm run worker`.
  - Whisper service prints model/language detection, duration in [whisper-service/app/transcriber.py](whisper-service/app/transcriber.py).
- Job status:
  - GET `/api/tasks/:jobId` in [api-gateway/src/app.ts](api-gateway/src/app.ts) reads job state from `transcriptionQueue`.
  - Admin dashboard available under `/admin/queues/transcriptions/dashboard` (queuedash middleware).

---

## Best-practice recommendations (short)
- Ensure `SHARED_UPLOADS_DIR` and `SHARED_TRANSCRIPTS_DIR` are accessible by both services (bind mounts or shared volume in Docker).
- Persist Redis for reliable queueing in non-dev environments.
- Consider safer filename handling (UUIDs) and metadata file alongside transcript (for provenance).
- Add unit/integration tests for:
  - enqueue flow ([`transcribeAudio`](api-gateway/src/controllers/stt.controller.ts))
  - worker processing ([api-gateway/workers/transcription.worker.ts])
  - whisper API contract ([whisper-service/app/main.py] and [api-gateway/src/services/whisper.client.ts]).
