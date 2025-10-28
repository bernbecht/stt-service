# Integration Guide

## Gateway ↔ Whisper Service
- Communication: HTTP (internal API)
- Audio handoff: File path or multipart upload
- Transcript output: Written to `shared/transcripts/`

## File Conventions
- Audio: `uploads/` (gateway), `shared/uploads/`
- Transcript: `shared/transcripts/{audio-filename}-{timestamp}.txt`

## Expected Formats
- Audio: .wav, .m4a, etc.
- Transcript: Plain text

## Error Handling
- Gateway retries on failure
- Whisper-service returns error JSON on failure

---
Update as integration points change.
