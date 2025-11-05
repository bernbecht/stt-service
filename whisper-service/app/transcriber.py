from time import time
from faster_whisper import WhisperModel
import os
import tempfile
from fastapi import UploadFile  # optional import for typing
from pathlib import Path
from typing import Union, Dict, Any

_model = None

def get_model(name='medium'):
    global _model
    if _model is None:
        _model = WhisperModel(name)
    return _model

def transcribe_bytes(data: bytes, filename: str | None = None) -> str:
    """
    Transcribe audio provided as bytes. Writes to a temp file then reuses transcribe_file.
    Returns transcription text.
    """
    suffix = os.path.splitext(filename)[1] if filename else ".wav"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=True) as tmp:
        tmp.write(data)
        tmp.flush()
        return transcribe_file(tmp.name, return_metadata=False)

async def transcribe_uploadfile(upload_file: UploadFile) -> str:
    """
    Async helper for FastAPI UploadFile. Reads contents and forwards to transcribe_bytes.
    """
    content = await upload_file.read()
    return transcribe_bytes(content, filename=upload_file.filename)

def transcribe_file(file_path: str, return_metadata: bool = True) -> Union[str, Dict[str, Any]]:
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    start_time = time()

    model = get_model("medium")  # "small" or "large" if you want
    segments, info = model.transcribe(file_path)
    print(f"Detected language: {info.language} with probability {info.language_probability}%")
    
    segment_lines = []
    for segment in segments:
        segment_lines.append("[{:.2f}s -> {:.2f}s] {}".format(segment.start, segment.end, segment.text))
    text = "\n".join(segment_lines) if segment_lines else ""

    end_time = time()
    print(f"Transcription completed in {end_time - start_time:.2f} seconds")

    if return_metadata:
        return {
            "transcription": text,
            "language": info.language,
            "language_probability": info.language_probability,
            "transcription_duration_seconds": end_time - start_time
        }
    else:
        return text