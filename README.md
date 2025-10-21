# Speech-to-Text Microservice

This project provides a speech-to-text transcription service through a REST API. It is built using a microservice architecture, combining a Node.js API gateway with a Python-based machine learning service for transcription.

## Architecture Overview

The system is composed of two main services that run in separate Docker containers:

1.  **`api-gateway` (Node.js)**: This is the public-facing service that handles incoming API requests from client applications. It's responsible for request validation, routing, and communicating with the `stt-service`.

2.  **`stt-service` (Python)**: This is an internal service that performs the actual speech-to-text transcription using the `faster-whisper` library. It exposes an internal API that is called by the `api-gateway`.

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
├── stt-service/            # Python service
│   ├── app/
│   └── requirements.txt
├── docker-compose.yml      # Defines and runs the multi-container application
└── README.md               # This file
```

## Getting Started (Placeholder)

### Prerequisites

*   Docker and Docker Compose

### Running the Services

```bash
# Build and run the services
docker-compose up --build
```