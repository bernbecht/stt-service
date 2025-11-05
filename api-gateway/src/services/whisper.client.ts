import axios from 'axios';

const WHISPER_API_URL = process.env.WHISPER_API_URL || 'http://localhost:8000/transcribe';
const USE_MOCK_WHISPER = process.env.USE_MOCK_WHISPER === 'false';

type WhisperResponse = {
  transcription: string;
  language?: string;
  language_confidence?: number;
  transcription_duration_seconds?: number;
  transcript_path?: string;
  mock?: boolean;
};

// Send audio file location to Whisper API and get transcription
export const sendAudioFileToWhisper = async (filePath: string) => {
  console.log('Sending audio file to Whisper API...', filePath);

  if (USE_MOCK_WHISPER) {
    console.log('[MOCK] Using mock Whisper service');
    // add latency to simulate real API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: {
      transcription: 'This is a mock transcription.',
      language: 'pt-BR',
      language_confidence: 0.95,
      transcription_duration_seconds: 1.23,
      transcript_path: '/mock/path/transcript.txt',
      mock: true,
     } as WhisperResponse };
  }

  const response = await axios.post(WHISPER_API_URL, { path: filePath }, {
    headers: { 'Content-Type': 'application/json' },
  });

  const responseData: WhisperResponse = response.data as WhisperResponse;
  return { data: responseData };
};