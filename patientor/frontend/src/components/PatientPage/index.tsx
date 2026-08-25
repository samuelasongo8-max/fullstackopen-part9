import { useEffect, useState } from "react";
import { Alert, CircularProgress, Typography } from '@mui/material';
import { useParams } from "react-router-dom";
import axios from "axios";

import patientService from "../../services/patients";
import { Patient } from "../../types";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        setError("Patient ID is missing");
        setLoading(false);
        return;
      }

      try {
        const fetchedPatient = await patientService.getById(id);
        setPatient(fetchedPatient);
      } catch (e: unknown) {
        if (axios.isAxiosError(e) && e.response?.status === 404) {
          setError("Patient not found");
        } else {
          setError("Failed to load patient");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchPatient();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!patient) {
    return <Alert severity="error">Patient not found</Alert>;
  }

  return (
    <div>
      <Typography variant="h4">{patient.name}</Typography>
      <Typography>Date of birth: {patient.dateOfBirth}</Typography>
      <Typography>Gender: {patient.gender}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      <Typography variant="h5" sx={{ marginTop: 2 }}>Entries</Typography>
      {patient.entries && patient.entries.length > 0 ? (
        patient.entries.map((_entry, index) => (
          <Typography key={index}>Entry {index + 1}</Typography>
        ))
      ) : (
        <Typography>No entries</Typography>
      )}
    </div>
  );
};

export default PatientPage;
