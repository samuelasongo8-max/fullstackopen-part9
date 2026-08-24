import type { NewPatientEntry } from './types.js';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isValidDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
};

export const parseNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!isRecord(object)) {
    throw new Error('Patient must be an object');
  }

  if (typeof object.name !== 'string' || object.name.trim() === '') {
    throw new Error('Name must be a non-empty string');
  }
  if (typeof object.occupation !== 'string' || object.occupation.trim() === '') {
    throw new Error('Occupation must be a non-empty string');
  }
  if (typeof object.ssn !== 'string' || object.ssn.trim() === '') {
    throw new Error('SSN must be a non-empty string');
  }
  if (!isValidDate(object.dateOfBirth)) {
    throw new Error('Date of birth must be a valid date string in YYYY-MM-DD format');
  }
  if (typeof object.gender !== 'string' || object.gender.trim() === '') {
    throw new Error('Gender must be a non-empty string');
  }

  return {
    name: object.name,
    occupation: object.occupation,
    ssn: object.ssn,
    dateOfBirth: object.dateOfBirth,
    gender: object.gender,
  };
};