from faster_whisper import WhisperModel
import os

# Load model once globally
model = WhisperModel("medium")  # "small" or "large" if you want

def transcribe_file(file_path: str) -> str:
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    segments, _ = model.transcribe(file_path)
    text = " ".join([segment.text for segment in segments])
    return text