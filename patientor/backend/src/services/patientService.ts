import patients from '../data/patients.js';
import { v1 as uuid } from 'uuid';
import type { NewPatientEntry, Patient, PublicPatient } from '../types.js';

const getPatients = (): PublicPatient[] => patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
  id,
  name,
  dateOfBirth,
  gender,
  occupation,
}));

const addPatient = (patient: NewPatientEntry): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...patient,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  addPatient,
};