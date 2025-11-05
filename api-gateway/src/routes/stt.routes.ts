import { Router } from 'express';
import { transcribeAudio, getTranscriptionStatus } from '../controllers/stt.controller';
import upload from '../middleware/upload';

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/transcribe', upload.single('audio'), transcribeAudio);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/tasks/:id', getTranscriptionStatus);

export default router;
