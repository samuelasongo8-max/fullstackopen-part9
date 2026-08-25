import patients from '../data/patients.js';
import { v1 as uuid } from 'uuid';
import type { Entry, NewEntry, NewPatientEntry, Patient, NonSensitivePatient } from '../types.js';

const getPatients = (): NonSensitivePatient[] => patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
  id,
  name,
  dateOfBirth,
  gender,
  occupation,
}));

const findById = (id: string): Patient | undefined => patients.find((patient) => patient.id === id);

const addEntry = (patientId: string, entry: NewEntry): Entry | undefined => {
  const patient = findById(patientId);

  if (!patient) {
    return undefined;
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };
  patient.entries.push(newEntry);
  return newEntry;
};

const addPatient = (patient: NewPatientEntry): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...patient,
    entries: [],
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  findById,
  addEntry,
  addPatient,
};