import sys
from app.transcriber import transcribe_file

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python cli.py <file_path>")
        sys.exit(1)

    file_path = sys.argv[1]
    try:
        text = transcribe_file(file_path, return_metadata=False)
        print(text)
    except Exception as e:
        print(f"Error: {e}")