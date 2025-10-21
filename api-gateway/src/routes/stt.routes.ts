import { Router } from 'express';
import { transcribeAudio } from '../controllers/stt.controller';

const router = Router();

router.post('/transcribe', transcribeAudio);

export default router;