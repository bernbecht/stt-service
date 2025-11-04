import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TranscriptionRepository } from '../repositories/transcriptions.repository';
import { transcriptionQueue } from '../services/queue';

const transcriptionRepository = new TranscriptionRepository();

// Controller to handle audio transcription requests
export const transcribeAudio = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded.' });
  }

  let taskName: string | undefined;

  try {
    // Phase 1: Create database record with 'pending' status
    taskName = uuidv4();
    transcriptionRepository.create({
      id: taskName,
      file_path: req.file.path,
      transcript_path: '',
      transcription_text: '',
      status: 'pending',
      is_mock: Boolean(process.env.USE_MOCK_WHISPER)
    });

    // Phase 2: Enqueue job with database ID
    const job = await transcriptionQueue.add(taskName, {
      filePath: req.file.path,
      taskName: taskName,
    }, {
      attempts: 3,
      backoff: 1000,
    });

    // Phase 3: Update status to 'queued' only after successful enqueue
    transcriptionRepository.updateStatus(taskName, 'queued');

    // Return accepted with a status URL (api prefix kept)
    return res.status(202).json({ taskId: job.id, statusUrl: `/api/tasks/${job.id}` });
  } catch (err: unknown) {
    // Cleanup: Mark database record as 'failed' if it was created
    if (taskName) {
      try {
        transcriptionRepository.updateStatus(taskName, 'failed');
      } catch (cleanupError) {
        console.error('Failed to cleanup orphaned record:', cleanupError);
      }
    }

    console.error('enqueue error', err);
    // Always return a generic error to the client
    return res.status(500).json({ message: 'Internal server error' });
  }
};
