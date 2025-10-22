//import axios from 'axios';
import FormData from 'form-data';

export const sendAudioToWhisper = async (audioBuffer: Buffer, filename: string) => {
  const form = new FormData();
  form.append('audio', audioBuffer, {
    filename,
  });

  console.log('Sending audio to Whisper API...');

  return { transcription: 'Mock transcription from Whisper API' };
};
