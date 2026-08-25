import express from 'express';
import { NewPatientSchema } from '../types.js';
import patientService from '../services/patientService.js';
const router = express.Router();
router.get('/', (_req, res) => {
    res.json(patientService.getPatients());
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
