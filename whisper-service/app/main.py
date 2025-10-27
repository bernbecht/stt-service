# ...existing code...
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import asyncio
from app.transcriber import transcribe_file, transcribe_uploadfile

app = FastAPI()

class PathPayload(BaseModel):
    path: str

@app.post("/transcribe")
async def transcribe(payload: PathPayload):
    file_path = os.path.abspath(payload.path)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    # run the blocking work in a thread so the event loop isn't blocked
    text = await asyncio.to_thread(transcribe_file, file_path)
    return {"transcription": text}