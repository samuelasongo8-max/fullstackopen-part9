import { z } from 'zod';
export const Gender = {
    Male: 'male',
    Female: 'female',
    Other: 'other',
};
export const NewPatientSchema = z.object({
    name: z.string().min(1),
    dateOfBirth: z.iso.date(),
    ssn: z.string().min(1),
    gender: z.enum(Gender),
    occupation: z.string().min(1),
});
