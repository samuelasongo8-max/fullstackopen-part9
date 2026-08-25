import patients from '../data/patients.js';
import { v1 as uuid } from 'uuid';
import type { NewPatientEntry, Patient, NonSensitivePatient } from '../types.js';

const getPatients = (): NonSensitivePatient[] => patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
  id,
  name,
  dateOfBirth,
  gender,
  occupation,
}));

const findById = (id: string): Patient | undefined => patients.find((patient) => patient.id === id);

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
  addPatient,
};