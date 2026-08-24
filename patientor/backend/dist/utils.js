import { NewPatientSchema } from './types.js';
export const parseNewPatientEntry = (object) => {
    return NewPatientSchema.parse(object);
};
