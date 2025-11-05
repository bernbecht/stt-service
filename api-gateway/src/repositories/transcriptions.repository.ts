import { db } from '../db/index';

export type TranscriptionStatus = 'queued' | 'processing' | 'done' | 'failed' | 'pending';

export interface TranscriptionRecord {
  id: string;
  file_path: string;
  transcript_path: string;
  transcription_text: string;
  language?: string;
  language_confidence?: number;
  transcription_duration_seconds?: number;
  status: TranscriptionStatus;
  created_at: Date;
  updated_at: Date;
  is_mock?: boolean;
}

export type CreateTranscriptionData = Omit<TranscriptionRecord, 'created_at' | 'updated_at'>;

interface DatabaseRow {
  id: string;
  file_path: string;
  transcript_path: string;
  transcription_text: string;
  language: string | null;
  language_confidence: number | null;
  transcription_duration_seconds: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  is_mock: number;
}

export class TranscriptionRepository {
  private mapRow(row: DatabaseRow): TranscriptionRecord {
    return {
      id: row.id,
      file_path: row.file_path,
      transcript_path: row.transcript_path,
      transcription_text: row.transcription_text,
      language: row.language ?? undefined,
      language_confidence: row.language_confidence ?? undefined,
      transcription_duration_seconds: row.transcription_duration_seconds ?? undefined,
      status: row.status as TranscriptionStatus,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      is_mock: Boolean(row.is_mock),
    };
  }

  create(data: CreateTranscriptionData): TranscriptionRecord {
    try {
      const now = new Date().toISOString();

      const stmt = db.prepare(`
        INSERT INTO transcriptions (
          id, file_path, transcript_path, transcription_text,
          language, language_confidence, transcription_duration_seconds, status,
          created_at, updated_at, is_mock
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        data.id,
        data.file_path,
        data.transcript_path,
        data.transcription_text,
        data.language ?? null,
        data.language_confidence ?? null,
        data.transcription_duration_seconds ?? null,
        data.status,
        now,
        now,
        data.is_mock ? 1 : 0,
      );

      return this.findById(data.id)!;
    } catch (error) {
      console.error('Repository error in create:', error);
      throw new Error(`Failed to create transcription: ${(error as Error).message}`);
    }
  }

  update(id: string, data: Partial<TranscriptionRecord>): TranscriptionRecord {
    try {
      const mutableFields = Object.entries(data).filter(([key]) => !['id', 'created_at', 'updated_at'].includes(key));

      if (mutableFields.length === 0) return this.findById(id)!;

      const setClause = mutableFields.map(([key]) => `${key} = ?`).join(', ');
      const values = mutableFields.map(([key, value]) => (key === 'is_mock' ? (value ? 1 : 0) : value));

      const stmt = db.prepare(`
        UPDATE transcriptions
        SET ${setClause}, updated_at = ?
        WHERE id = ?
      `);

      stmt.run(...values, new Date().toISOString(), id);
      return this.findById(id)!;
    } catch (error) {
      console.error('Repository error in update:', error);
      throw new Error(`Failed to update transcription: ${(error as Error).message}`);
    }
  }

  findById(id: string): TranscriptionRecord | null {
    try {
      const stmt = db.prepare('SELECT * FROM transcriptions WHERE id = ?');
      const row = stmt.get(id) as DatabaseRow | undefined;
      return row ? this.mapRow(row) : null;
    } catch (error) {
      console.error('Repository error in findById:', error);
      throw new Error(`Failed to find transcription: ${(error as Error).message}`);
    }
  }

  updateStatus(id: string, status: TranscriptionStatus): void {
    try {
      const stmt = db.prepare(`
        UPDATE transcriptions
        SET status = ?, updated_at = ?
        WHERE id = ?
      `);

      stmt.run(status, new Date().toISOString(), id);
    } catch (error) {
      console.error('Repository error in updateStatus:', error);
      throw new Error(`Failed to update transcription status: ${(error as Error).message}`);
    }
  }

  findByStatus(status: TranscriptionStatus): TranscriptionRecord[] {
    try {
      const stmt = db.prepare('SELECT * FROM transcriptions WHERE status = ? ORDER BY created_at DESC');
      const rows = stmt.all(status) as DatabaseRow[];

      return rows.map((row) => this.mapRow(row));
    } catch (error) {
      console.error('Repository error in findByStatus:', error);
      throw new Error(`Failed to find transcriptions by status: ${(error as Error).message}`);
    }
  }
}
