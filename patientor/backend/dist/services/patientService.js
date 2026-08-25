import patients from '../data/patients.js';
import { v1 as uuid } from 'uuid';
const getPatients = () => patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
}));
const findById = (id) => patients.find((patient) => patient.id === id);
const addEntry = (patientId, entry) => {
    const patient = findById(patientId);
    if (!patient) {
        return undefined;
    }
    const newEntry = {
        id: uuid(),
        ...entry,
    };
    patient.entries.push(newEntry);
    return newEntry;
};
const addPatient = (patient) => {
    const newPatient = {
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
