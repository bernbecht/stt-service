import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import sttRoutes from './routes/stt.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/stt', sttRoutes);

app.get('/', (req, res) => {
  res.send('API Gateway is running!');
});

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});