import express from 'express';
import cors from 'cors';
import diagnoses from './data/diagnoses.js';
import patients from './data/patients.js';
import type { Diagnosis, PublicPatient } from './types.js';

const app = express();
app.use(cors());

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  const diagnosisList: Diagnosis[] = diagnoses;
  res.json(diagnosisList);
});

app.get('/api/patients', (_req, res) => {
  const patientList: PublicPatient[] = patients.map((patient) => ({
    id: patient.id,
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    occupation: patient.occupation,
  }));
  res.json(patientList);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});