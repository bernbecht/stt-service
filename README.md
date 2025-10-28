# Speech-to-Text Microservice


This project provides a speech-to-text transcription service through a REST API. It is built using a microservice architecture, combining a Node.js API gateway with a Python-based machine learning service for transcription.

## Architecture Overview


The system is composed of two main services:

1.  **`api-gateway` (Node.js)**: Public-facing service that handles incoming API requests from client applications. Responsible for request validation, routing, and communicating with the transcription backend.
2.  **`whisper-service` (Python)**: Internal service that performs the actual speech-to-text transcription using the `faster-whisper` library. Exposes an internal API called by the `api-gateway`.

### Data Flow

1.  A client sends an audio file via a `POST` request to the `api-gateway`.
2.  The `api-gateway` forwards the request containing the audio data to the `stt-service`.
3.  The `stt-service` processes the audio file, transcribes it to text, and returns the text to the `api-gateway`.
4.  The `api-gateway` sends the transcription back to the client as the API response.

## Directory Structure

```
speech-to-text-microservice/

├── api-gateway/            # Node.js service
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── whisper-service/        # Python service
│   ├── app/
│   └── requirements.txt
├── shared/                 # Shared files (uploads, transcripts)
├── docs/                   # Project documentation (architecture, decisions, etc.)
└── README.md               # This file
```

## Getting Started
## Documentation

See `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, and other docs in the `docs/` folder for architecture, decisions, API, and development guides. For code conventions, see `.github/copilot-instructions.md`.


### Prerequisites

*   Node.js and npm
*   Python 3.10+


### Running the Services (Local Development)

#### API Gateway
```bash
cd api-gateway
npm install
npm run dev
```


#### Transcription Worker (Required)
In a separate terminal, start the worker to process queued transcription jobs (from the project root or api-gateway directory):
```bash
cd api-gateway
npm install  # if not already done
npx ts-node ../workers/transcription.worker.ts
```

#### Whisper Service
```bash
cd whisper-service
pip install -r requirements.txt
python app/main.py
```

---

*Docker Compose integration is planned but not yet implemented. Instructions will be updated when available.*