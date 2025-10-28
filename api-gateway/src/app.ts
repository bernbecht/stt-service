import cors from 'cors';
import express from 'express';
import './load-env';
import sttRoutes from './routes/stt.routes';

const app = express();
const port = process.env.PORT || 3000;
  
app.use(cors());
app.use(express.json());

app.use('/api', sttRoutes);

app.get('/', (req, res) => {
  res.send('API Gateway is running!');
});

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
