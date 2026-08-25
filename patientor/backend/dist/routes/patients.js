import express from 'express';
import { z } from 'zod';
import { NewPatientSchema } from '../types.js';
import patientService from '../services/patientService.js';
import { parseNewEntry } from '../utils.js';
const router = express.Router();
router.get('/', (_req, res) => {
    res.json(patientService.getPatients());
});
router.post('/:id/entries', (req, res) => {
    const patient = patientService.findById(req.params.id);
    if (!patient) {
        res.status(404).json({ error: 'Patient not found' });
        return;
    }
    try {
        const newEntry = parseNewEntry(req.body);
        const addedEntry = patientService.addEntry(patient.id, newEntry);
        if (!addedEntry) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        res.status(201).json(addedEntry);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const message = error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join('; ');
            res.status(400).json({ error: message });
            return;
        }
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(400).json({ error: 'Invalid entry' });
    }
});
router.get('/:id', (req, res) => {
    const patient = patientService.findById(req.params.id);
    if (!patient) {
        res.status(404).json({ error: 'Patient not found' });
        return;
    }
    res.json(patient);
});
router.post('/', (req, res) => {
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
