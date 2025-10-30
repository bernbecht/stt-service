import { createQueueDashExpressMiddleware } from "@queuedash/api";
import cors from 'cors';
import express from 'express';
import './load-env';
import sttRoutes from './routes/stt.routes';
import { transcriptionQueue } from './services/queue';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', sttRoutes);

console.log(`Using mock Whisper service: ${process.env.USE_MOCK_WHISPER === 'true'}`);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/api/tasks/:jobId', async (req, res) => {
console.log(`Fetching status for job Id: ${req.params.jobId}`);
const job = await transcriptionQueue.getJob(req.params.jobId);
if (!job) {
  return res.status(404).json({ message: 'Job not found' });
}
const state = await job.getState();
const result = job.returnvalue;
res.json({ jobId: job.id, state, result });
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/admin/queues/transcriptions/list', async (req, res) => {

  const allJobs = await transcriptionQueue.getJobs(['waiting', 'active', 'completed', 'failed', 'delayed'], 0, 100);
  const jobSummaries = allJobs.map(job => ({
    id: job.id,
    name: job.name,
    data: job.data,
    opts: job.opts,
    returnvalue: job.returnvalue,
    failedReason: job.failedReason,
    timestamp: job.timestamp,
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
  }));
  res.json(jobSummaries);
});


app.use(
  "/admin/queues/transcriptions/dashboard",
  createQueueDashExpressMiddleware({
    ctx: {
      queues: [
        {
          queue: transcriptionQueue,
          displayName: "Transcription",
          type: "bull" as const,
        },
      ],
    },
  })
);

app.get('/', (req, res) => {
res.send('API Gateway is running!');
});

app.listen(port, () => {
console.log(`API Gateway listening at http://localhost:${port}`);
});
