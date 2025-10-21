import { Request, Response } from "express";

export const transcribeAudio = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not Implemented" });
};