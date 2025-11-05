import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import '../src/load-env';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

const QUEUE_NAME = 'documents';

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const { filePath, taskName } = job.data;
    if (!filePath || !taskName) {
      throw new Error('Invalid job data: missing filePath or taskName');
    }

    try {
      console.log(`Processing document OCR job ${taskName} for file ${filePath}`);

      // TODO: Add actual OCR processing in later milestones
      // For now, return placeholder response
      return {
        message: 'Document worker skeleton implemented',
        filePath,
        taskName,
        status: 'completed',
      };
    } catch (error) {
      console.error(`Error processing document OCR job ${taskName}:`, error);
      throw error;
    }
  },
  { connection },
);

worker.on('completed', (job) => {
  console.log(`Document job ${job.id} has completed! Result:`, job.returnvalue);
});

worker.on('failed', (job, err) => {
  console.error(`Document job ${job?.id} has failed with error:`, err);
});

console.log(`Document OCR worker started, listening to queue: ${QUEUE_NAME}`);

const shutdown = async () => {
  console.log('Shutting down document worker...');
  await worker.close();
  await connection.quit();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
