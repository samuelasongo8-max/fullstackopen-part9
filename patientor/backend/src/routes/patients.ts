import express, { type Request, type Response } from 'express';
import { ZodError } from 'zod';
import patientService from '../services/patientService.js';
import { parseNewPatientEntry } from '../utils.js';
import type { Patient, PublicPatient } from '../types.js';

const router = express.Router();

router.get('/', (_req, res: Response<PublicPatient[]>) => {
  res.json(patientService.getPatients());
});

router.post('/', (req: Request, res: Response<Patient | { error: string }>) => {
  try {
    const newPatient = parseNewPatientEntry(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    const message = error instanceof ZodError
      ? error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
      : error instanceof Error ? error.message : 'Invalid patient data';
    res.status(400).json({ error: message });
  }
});

export default router;