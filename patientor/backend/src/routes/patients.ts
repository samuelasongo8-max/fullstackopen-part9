import express, { type Request, type Response } from 'express';
import { NewPatientSchema } from '../types.js';
import patientService from '../services/patientService.js';
import type { Patient, NonSensitivePatient } from '../types.js';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.json(patientService.getPatients());
});

router.get('/:id', (req: Request<{ id: string }>, res: Response<Patient | { error: string }>) => {
  const patient = patientService.findById(req.params.id);

  if (!patient) {
    res.status(404).json({ error: 'Patient not found' });
    return;
  }

  res.json(patient);
});

router.post('/', (req: Request, res: Response<Patient | { error: string }>) => {
  const result = NewPatientSchema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    res.status(400).json({ error: message });
    return;
  }

  const addedPatient = patientService.addPatient(result.data);
  res.json(addedPatient);
});

export default router;