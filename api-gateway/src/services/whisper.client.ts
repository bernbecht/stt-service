import axios from 'axios';
import FormData from 'form-data';

const WHISPER_API_URL = process.env.WHISPER_API_URL || 'http://localhost:8000/transcribe';

// Function to send audio buffer to Whisper API and get transcription
export const sendAudioBufferToWhisper = async (audioBuffer: Buffer, filename: string) => {
  const form = new FormData();
  form.append('audio', audioBuffer, {
    filename,
  });

  console.log('Sending audio to Whisper API...');

  const response = await axios.post(WHISPER_API_URL, form, {
    headers: form.getHeaders(),
  });


  return { data: response.data };
};

// Send audio file location to Whisper API and get transcription
export const sendAudioFileToWhisper = async (filePath: string) => {
  console.log('Sending audio file to Whisper API...', filePath);

  const response = await axios.post(WHISPER_API_URL, { path: filePath }, {
    headers: { 'Content-Type': 'application/json' },
  });

  return { data: response.data };
};