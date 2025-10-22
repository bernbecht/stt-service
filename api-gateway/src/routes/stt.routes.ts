import { Router } from 'express';
import { transcribeAudio } from '../controllers/stt.controller';
import upload from '../middleware/upload';

const router = Router();

router.post('/transcribe', upload.single('audio'), transcribeAudio);

export default router;
