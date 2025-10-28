# API Gateway: REST API Documentation

## Endpoints

### POST /stt/upload
- **Description:** Upload an audio file for transcription.
- **Request:** multipart/form-data (audio file)
- **Response:** JSON with job ID or transcript (sync/async)

### GET /stt/status/:jobId
- **Description:** Get status of a transcription job.
- **Response:** JSON (status, result path, errors)

### GET /stt/transcript/:jobId
- **Description:** Retrieve transcript for a completed job.
- **Response:** Plain text or JSON

## Error Handling
- Standard HTTP status codes
- JSON error messages

## Example Requests
See `requests/` for HTTPie scripts.

---
Update as endpoints evolve.
