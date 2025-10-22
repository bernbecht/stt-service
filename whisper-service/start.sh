#!/bin/bash
# Start FastAPI app with Uvicorn on port 8000
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000