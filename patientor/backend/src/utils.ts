import { NewPatientSchema, type NewPatientEntry } from './types.js';

export const parseNewPatientEntry = (object: unknown): NewPatientEntry => {
  return NewPatientSchema.parse(object);
};