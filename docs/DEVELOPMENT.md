# Developer Guide

## Setup


### Prerequisites
- Node.js, npm
- Python 3.10+



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

*Docker Compose integration is planned but not yet implemented. Instructions will be updated when available.*

## Testing
- Use scripts in `api-gateway/requests/`
- Inspect logs for debugging

## Directory Structure
- See `docs/ARCHITECTURE.md` for key folders

---
Update as workflows change.
