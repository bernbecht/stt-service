import axios from 'axios';

const WHISPER_API_URL = process.env.WHISPER_API_URL || 'http://localhost:8000/transcribe';
const USE_MOCK_WHISPER = process.env.USE_MOCK_WHISPER === 'false';

type WhisperResponse = {
  transcription: string;
  language?: string;
  language_confidence?: number;
  time_taken_seconds?: number;
  mock?: boolean;
};

// Send audio file location to Whisper API and get transcription
export const sendAudioFileToWhisper = async (filePath: string) => {
  console.log('Sending audio file to Whisper API...', filePath);

  if (USE_MOCK_WHISPER) {
    console.log('[MOCK] Using mock Whisper service');
    return { data: { 
      transcription: 'This is a mock transcription.',
      language: 'pt-BR',
      language_confidence: 0.95,
      time_taken_seconds: 1.23,
      mock: true,
     } as WhisperResponse };
  }

  const response = await axios.post(WHISPER_API_URL, { path: filePath }, {
    headers: { 'Content-Type': 'application/json' },
  });

  const responseData: WhisperResponse = response.data as WhisperResponse;
  return { data: responseData };
};