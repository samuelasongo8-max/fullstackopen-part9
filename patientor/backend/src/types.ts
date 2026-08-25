import { z } from 'zod';

export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {
}

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
};

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const NewPatientSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.iso.date(),
  ssn: z.string().min(1),
  gender: z.enum(Gender),
  occupation: z.string().min(1),
});

export type NewPatientEntry = z.infer<typeof NewPatientSchema>;

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
