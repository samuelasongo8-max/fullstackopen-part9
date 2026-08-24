import patients from '../data/patients.js';
import { v1 as uuid } from 'uuid';
const getPatients = () => patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
}));
const addPatient = (patient) => {
    const newPatient = {
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
