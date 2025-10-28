# Reference & Examples

## Example HTTP Request

```bash
http --form POST :8000/stt/upload audio@/path/to/audio.m4a
```

## Example Transcript Filename

```
shared/transcripts/1761667210260-audio.m4a-2025-10-28-13-03-30.txt
```

## Example Directory Structure

- `api-gateway/` — REST API, file upload
- `whisper-service/` — Transcription backend
- `shared/` — Shared files (uploads, transcripts)

## More Examples
- See `api-gateway/requests/` for HTTPie scripts
- See `shared/transcripts/` for sample outputs

---
Update as new examples are added.
