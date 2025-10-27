from fastapi import FastAPI, File, UploadFile
from app.transcriber import transcribe_uploadfile

app = FastAPI()

@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    text = await transcribe_uploadfile(audio)
    return {"transcription": text}