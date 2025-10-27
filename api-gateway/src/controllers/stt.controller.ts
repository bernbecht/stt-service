import { Request, Response } from 'express';
import { sendAudioFileToWhisper } from '../services/whisper.client';
// Controller to handle audio transcription requests

export const transcribeAudio = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded.' });
  }

  try {
    const result = await sendAudioFileToWhisper(req.file.path);
    res.json(result);
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ message: 'Error transcribing audio.' });
  }
};
