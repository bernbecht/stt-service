import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { transcriptionQueue } from '../services/queue';

// Controller to handle audio transcription requests
export const transcribeAudio = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded.' });
  }

  try {
    const taskId = uuidv4();
    // Enqueue the transcription task
    await transcriptionQueue.add(taskId, {
      filePath: req.file.path,
      taskId,
    });
    // return accepted with a status URL (api prefix kept)
    return res.status(202).json({ taskId, statusUrl: `/api/tasks/${taskId}` });
  } catch (err: unknown) {
    // Log rich error info for debugging, but return a generic response to clients
    // if (axios.isAxiosError(err)) {
    //   const axiosErr = err as AxiosError;
    //   console.error('Whisper service axios error:', {
    //     message: axiosErr.message,
    //     status: axiosErr.response?.status,
    //     responseData: axiosErr.response?.data,
    //     requestUrl: axiosErr.config?.url,
    //     method: axiosErr.config?.method,
    //     headers: axiosErr.config?.headers,
    //   });
    // } else if (err instanceof Error) {
    //   console.error('Internal error in transcribeAudio:', err);
    // } else {
    //   console.error('Unknown error in transcribeAudio:', err);
    // }
      console.error('enqueue error', err)
    // Always return a generic error to the client
    return res.status(500).json({ message: 'Internal server error' });
  }
};
