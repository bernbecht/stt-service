from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    return {"transcription": "hello world"}