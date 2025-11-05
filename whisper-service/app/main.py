# ...existing code...
from datetime import datetime
from pathlib import Path
from time import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import asyncio
from app.transcriber import transcribe_file, transcribe_uploadfile
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

RESULTS_DIR = Path(os.getenv("SHARED_TRANSCRIPTS_DIR", "/home/bbp/projects/stt-service/shared/transcripts"))

print("Using transcripts dir:", RESULTS_DIR)

class PathPayload(BaseModel):
    path: str

@app.post("/transcribe")
async def transcribe(payload: PathPayload):
    file_path = os.path.abspath(payload.path)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    # run the blocking work in a thread so the event loop isn't blocked
    result = await asyncio.to_thread(transcribe_file, file_path)
    # save the transcription to a file
    transcript_path = save_transcription(result["transcription"], file_path)
    result["transcript_path"] = transcript_path
    return result


def save_transcription(text: str, source_file: str, results_dir: Path = RESULTS_DIR) -> str:
    """
    Save transcription text to results_dir using a timestamped filename derived from source_file.
    Returns the absolute path to the saved .txt file as a string.
    """
    results_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.fromtimestamp(time()).strftime("%Y-%m-%d-%H-%M-%S")
    base_name = os.path.basename(source_file)
    safe_name = base_name.replace(os.path.sep, "_")
    txt_path = results_dir / f"{safe_name}-{timestamp}.txt"
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
    return str(txt_path)