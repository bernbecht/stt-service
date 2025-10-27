import { Request, Response } from 'express';

export const transcribeAudio = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded.' });
  }

  // try {
  //   const result = await sendAudioFileToWhisper(req.file.path);
  //   res.json(result);
  // } catch (error) {
  //   console.error('Error transcribing audio:', error);
  //   res.status(500).json({ message: 'Error transcribing audio.' });
  // }

  res.json({ message: 'Transcription feature is currently disabled.' });
};
