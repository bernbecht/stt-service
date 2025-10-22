import { Request, Response } from "express";

export const transcribeAudio = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No audio file uploaded." });
  }
  // todo: Forward the file to the Python service
  res.status(501).json({ message: "Not Implemented" });
};