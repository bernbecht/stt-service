import axios, { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { sendAudioFileToWhisper } from '../services/whisper.client';
// Controller to handle audio transcription requests

export const transcribeAudio = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded.' });
  }

  try {
    const result = await sendAudioFileToWhisper(req.file.path);
    return res.json(result);
  } catch (err: unknown) {
    // Log rich error info for debugging, but return a generic response to clients
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError;
      console.error('Whisper service axios error:', {
        message: axiosErr.message,
        status: axiosErr.response?.status,
        responseData: axiosErr.response?.data,
        requestUrl: axiosErr.config?.url,
        method: axiosErr.config?.method,
        headers: axiosErr.config?.headers,
      });
    } else if (err instanceof Error) {
      console.error('Internal error in transcribeAudio:', err);
    } else {
      console.error('Unknown error in transcribeAudio:', err);
    }

    // Always return a generic error to the client
    return res.status(500).json({ message: 'Internal server error' });
  }
};
