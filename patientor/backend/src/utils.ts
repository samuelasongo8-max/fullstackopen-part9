import { z } from 'zod';
import { HealthCheckRating, NewPatientSchema, type NewEntry, type NewPatientEntry } from './types.js';

export const parseNewPatientEntry = (object: unknown): NewPatientEntry => {
  return NewPatientSchema.parse(object);
};

const baseEntrySchema = {
  date: z.iso.date(),
  description: z.string().min(1),
  specialist: z.string().min(1),
  diagnosisCodes: z.array(z.string()).optional(),
};

const newEntrySchema = z.discriminatedUnion('type', [
  z.object({
    ...baseEntrySchema,
    type: z.literal('Hospital'),
    discharge: z.object({
      date: z.iso.date(),
      criteria: z.string().min(1),
    }),
  }),
  z.object({
    ...baseEntrySchema,
    type: z.literal('OccupationalHealthcare'),
    employerName: z.string().min(1),
    sickLeave: z.object({
      startDate: z.iso.date(),
      endDate: z.iso.date(),
    }).optional(),
  }),
  z.object({
    ...baseEntrySchema,
    type: z.literal('HealthCheck'),
    healthCheckRating: z.union([
      z.literal(HealthCheckRating.Healthy),
      z.literal(HealthCheckRating.LowRisk),
      z.literal(HealthCheckRating.HighRisk),
      z.literal(HealthCheckRating.CriticalRisk),
    ]),
  }),
]);

export const parseNewEntry = (object: unknown): NewEntry => {
  return newEntrySchema.parse(object);
};