import { Worker } from 'bullmq';
import fs from 'fs';
import IORedis from 'ioredis';
import '../src/load-env';
import { sendAudioFileToWhisper } from '../src/services/whisper.client';
import { TranscriptionRepository } from '../src/repositories/transcriptions.repository';

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

const QUEUE_NAME = 'transcriptions';
const transcriptionRepository = new TranscriptionRepository();

const worker = new Worker(QUEUE_NAME, async job => {
  const { filePath, taskName } = job.data;
  if (!filePath || !taskName) {
    throw new Error('Invalid job data: missing filePath or taskId');
  }

  try {
    console.log(`Processing transcription job ${taskName} for file ${filePath}`);

    // Update status to 'processing'
    transcriptionRepository.updateStatus(taskName, 'processing');

    const response = await sendAudioFileToWhisper(filePath);

    // Save transcription results to database
    transcriptionRepository.update(taskName, {
      transcription_text: response.data.transcription,
      language: response.data.language,
      language_confidence: response.data.language_confidence,
      transcription_duration_seconds: response.data.transcription_duration_seconds,
      transcript_path: response.data.transcript_path,
      status: 'done'
    });

    // remove the file after processing
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      } else {
        console.log(`Successfully deleted file ${filePath}`);
      }
    });

    console.log(`Transcription job ${taskName} completed.`);
    return response.data;
  } catch (error) {
    console.error(`Error processing transcription job ${taskName}:`, error);

    // Update status to 'failed' on error
    try {
      transcriptionRepository.updateStatus(taskName, 'failed');
    } catch (dbError) {
      console.error(`Failed to update job status to failed:`, dbError);
    }

    throw error;
  }
}, { connection });

worker.on('completed', (job) => {
  console.log(`Job ${job.id} has completed! Result:`, job.returnvalue);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} has failed with error:`, err);
});

console.log(`Transcription worker started, listening to queue: ${QUEUE_NAME}`);


const shutdown = async () => {
  console.log('Shutting down worker...');
  await worker.close();
  await connection.quit();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);