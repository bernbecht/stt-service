# Developer Guide

## Setup

### Prerequisites
- Node.js, npm
- Python 3.10+
- Redis server

## Quick Start (Recommended)

Use the startup script to launch all services automatically:

```bash
# Make script executable (first time only)
chmod +x start-dev.sh

# Start all services (Redis, API Gateway, Worker, Whisper)
./start-dev.sh

# Start with mock Whisper service (no Whisper service needed)
./start-dev.sh --mock
```

The script handles:
- Redis server (background process)
- API Gateway (port 3000)
- Transcription Worker (background process)
- Whisper Service (port 8000, skipped with --mock)

## Manual Setup

### Install & Run (Gateway)
```bash
cd api-gateway
npm install
npm run dev
```

### Run the Transcription Worker (Required)
In a separate terminal, start the worker to process queued jobs (from the project root or api-gateway directory):
```bash
cd api-gateway
npm install  # if not already done
npx ts-node ../workers/transcription.worker.ts
```

### Install & Run (Whisper Service)
```bash
cd whisper-service
pip install -r requirements.txt
python app/main.py
```

---

*The startup script provides a simple orchestration solution without Docker. Docker Compose integration is planned for future releases.*

## Testing
- Use scripts in `api-gateway/requests/`
- Inspect logs for debugging

## Directory Structure
- See `docs/ARCHITECTURE.md` for key folders

---
Update as workflows change.
