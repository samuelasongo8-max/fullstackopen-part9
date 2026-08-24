import express from 'express';
import cors from 'cors';
import diagnoses from './data/diagnoses.js';
import patientRouter from './routes/patients.js';
import type { Diagnosis } from './types.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  const diagnosisList: Diagnosis[] = diagnoses;
  res.json(diagnosisList);
});

app.use('/api/patients', patientRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});