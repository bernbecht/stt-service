import { Request, Response } from 'express';
import { sendAudioToWhisper } from '../services/whisper.client';

export const transcribeAudio = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded.' });
  }
  // todo: Forward the file to the Python service
  // res.status(501).json({ message: "Not Implemented" });

  try {
    const result = await sendAudioToWhisper(req.file.buffer, req.file.originalname);
    res.json(result);
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ message: 'Error transcribing audio.' });
  }
};
