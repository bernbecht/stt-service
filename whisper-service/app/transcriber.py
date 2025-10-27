from time import time
from faster_whisper import WhisperModel
import os
from datetime import datetime
import tempfile
from fastapi import UploadFile  # optional import for typing

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
        return transcribe_file(tmp.name)

async def transcribe_uploadfile(upload_file: UploadFile) -> str:
    """
    Async helper for FastAPI UploadFile. Reads contents and forwards to transcribe_bytes.
    """
    content = await upload_file.read()
    return transcribe_bytes(content, filename=upload_file.filename)

def transcribe_file(file_path: str) -> str:
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
    
    # Save transcription to a timestamped file
    # timestamp = int(time())
    timestamp = datetime.fromtimestamp(time()).strftime("%Y-%m-%d-%H-%M-%S")
    base_name = os.path.basename(file_path)
    txt_file_path = os.path.join("results", f"{base_name}-{timestamp}.txt")
    os.makedirs("results", exist_ok=True)
    with open(txt_file_path, "w") as f:
        f.write(text)

    end_time = time()
    print(f"Transcription completed in {end_time - start_time:.2f} seconds")
    print(f"Transcription saved to {txt_file_path}")
    
    return text