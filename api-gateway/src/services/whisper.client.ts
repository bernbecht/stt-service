import axios from 'axios';
import FormData from 'form-data';

const WHISPER_API_URL = process.env.WHISPER_API_URL || 'http://localhost:8000/transcribe';

export const sendAudioToWhisper = async (audioBuffer: Buffer, filename: string) => {
  const form = new FormData();
  form.append('audio', audioBuffer, {
    filename,
  });

  console.log('Sending audio to Whisper API...');

  const response = await axios.post(WHISPER_API_URL, form, {
    headers: form.getHeaders(),
  });


  return { transcription: response.data.transcription };
};
