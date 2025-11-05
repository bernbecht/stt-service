// src/db/init.ts
import { db } from './index';

db.exec(`
  CREATE TABLE IF NOT EXISTS transcriptions (
    id TEXT PRIMARY KEY,
    file_path TEXT NOT NULL,
    transcript_path TEXT,
    transcription_text TEXT,
    language TEXT,
    language_confidence REAL,
     transcription_duration_seconds REAL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_mock INTEGER DEFAULT 0
  );
`);
