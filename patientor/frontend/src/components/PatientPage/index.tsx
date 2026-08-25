import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import { useParams } from "react-router-dom";
import axios from "axios";

import patientService from "../../services/patients";
import {
  Diagnosis,
  HealthCheckRating,
  NewEntry,
  Patient,
} from "../../types";
import EntryDetails from "../EntryDetails";

interface Props {
  diagnoses: Diagnosis[];
}

type EntryType = "HealthCheck" | "OccupationalHealthcare" | "Hospital";

interface EntryFormState {
  type: EntryType;
  date: string;
  description: string;
  specialist: string;
  diagnosisCodes: string[];
  healthCheckRating: HealthCheckRating;
  employerName: string;
  sickLeaveStartDate: string;
  sickLeaveEndDate: string;
  dischargeDate: string;
  dischargeCriteria: string;
}

const initialEntryForm: EntryFormState = {
  type: "HealthCheck",
  date: "",
  description: "",
  specialist: "",
  diagnosisCodes: [],
  healthCheckRating: HealthCheckRating.Healthy,
  employerName: "",
  sickLeaveStartDate: "",
  sickLeaveEndDate: "",
  dischargeDate: "",
  dischargeCriteria: "",
};

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [entryFormOpen, setEntryFormOpen] = useState<boolean>(false);
  const [entrySubmitting, setEntrySubmitting] = useState<boolean>(false);
  const [entryForm, setEntryForm] = useState<EntryFormState>(initialEntryForm);

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

  const diagnosisByCode = new Map(diagnoses.map((diagnosis) => [diagnosis.code, diagnosis]));

  const handleEntrySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (entrySubmitting) {
      return;
    }

    setEntrySubmitting(true);

    const commonFields = {
      date: entryForm.date,
      description: entryForm.description,
      specialist: entryForm.specialist,
      diagnosisCodes: entryForm.diagnosisCodes,
    };

    let newEntry: NewEntry;

    switch (entryForm.type) {
      case "HealthCheck":
        newEntry = {
          ...commonFields,
          type: "HealthCheck",
          healthCheckRating: Number(entryForm.healthCheckRating) as HealthCheckRating,
        };
        break;
      case "OccupationalHealthcare":
        newEntry = {
          ...commonFields,
          type: "OccupationalHealthcare",
          employerName: entryForm.employerName,
          sickLeave: {
            startDate: entryForm.sickLeaveStartDate,
            endDate: entryForm.sickLeaveEndDate,
          },
        };
        break;
      case "Hospital":
        newEntry = {
          ...commonFields,
          type: "Hospital",
          discharge: {
            date: entryForm.dischargeDate,
            criteria: entryForm.dischargeCriteria,
          },
        };
        break;
      default:
        throw new Error(`Unsupported entry type: ${entryForm.type}`);
    }

    try {
      const createdEntry = await patientService.createEntry(patient.id, newEntry);
      setPatient((previous) => previous ? {
        ...previous,
        entries: [...previous.entries, createdEntry],
      } : previous);
      setEntryForm(initialEntryForm);
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.data && typeof e.response.data === "object" && "error" in e.response.data) {
        const message = e.response.data.error;
        setError(typeof message === "string" ? message : "Failed to create entry");
      } else {
        setError("Failed to create entry");
      }
    } finally {
      setEntrySubmitting(false);
    }
  };

  return (
    <div>
      <Typography variant="h4">{patient.name}</Typography>
      <Typography>Date of birth: {patient.dateOfBirth}</Typography>
      <Typography>Gender: {patient.gender}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      {!entryFormOpen && (
        <Button variant="contained" onClick={() => setEntryFormOpen(true)}>
          Add New Entry
        </Button>
      )}
      {entryFormOpen && (
      <form onSubmit={handleEntrySubmit}>
        <TextField
          select
          label="Entry type"
          value={entryForm.type}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setEntryForm({ ...entryForm, type: event.target.value as EntryType })}
          SelectProps={{ native: true }}
          fullWidth
          margin="normal"
        >
          <option value="HealthCheck">HealthCheck</option>
          <option value="OccupationalHealthcare">OccupationalHealthcare</option>
          <option value="Hospital">Hospital</option>
        </TextField>
        <TextField label="Date" type="date" value={entryForm.date} onChange={(event) => setEntryForm({ ...entryForm, date: event.target.value })} InputLabelProps={{ shrink: true }} fullWidth margin="normal" />
        <TextField label="Description" value={entryForm.description} onChange={(event) => setEntryForm({ ...entryForm, description: event.target.value })} fullWidth margin="normal" />
        <TextField label="Specialist" value={entryForm.specialist} onChange={(event) => setEntryForm({ ...entryForm, specialist: event.target.value })} fullWidth margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>
          <Select<string[]>
            labelId="diagnosis-codes-label"
            multiple
            value={entryForm.diagnosisCodes}
            onChange={(event: SelectChangeEvent<string[]>) =>
              setEntryForm({
                ...entryForm,
                diagnosisCodes: event.target.value as string[],
              })
            }
            renderValue={(selected) => selected.join(", ")}
            label="Diagnosis codes"
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                <Checkbox checked={entryForm.diagnosisCodes.includes(diagnosis.code)} />
                <ListItemText primary={`${diagnosis.code} - ${diagnosis.name}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {entryForm.type === "HealthCheck" && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="health-check-rating-label">HealthCheck rating</InputLabel>
            <Select
              labelId="health-check-rating-label"
              value={entryForm.healthCheckRating}
              onChange={(event: SelectChangeEvent<number>) =>
                setEntryForm({
                  ...entryForm,
                  healthCheckRating: Number(event.target.value) as HealthCheckRating,
                })
              }
              label="HealthCheck rating"
            >
              <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>Critical Risk</MenuItem>
            </Select>
          </FormControl>
        )}
        {entryForm.type === "OccupationalHealthcare" && (
          <>
            <TextField label="Employer name" value={entryForm.employerName} onChange={(event) => setEntryForm({ ...entryForm, employerName: event.target.value })} fullWidth margin="normal" />
            <TextField label="Sick leave start date" type="date" value={entryForm.sickLeaveStartDate} onChange={(event) => setEntryForm({ ...entryForm, sickLeaveStartDate: event.target.value })} InputLabelProps={{ shrink: true }} fullWidth margin="normal" />
            <TextField label="Sick leave end date" type="date" value={entryForm.sickLeaveEndDate} onChange={(event) => setEntryForm({ ...entryForm, sickLeaveEndDate: event.target.value })} InputLabelProps={{ shrink: true }} fullWidth margin="normal" />
          </>
        )}
        {entryForm.type === "Hospital" && (
          <>
            <TextField label="Discharge date" type="date" value={entryForm.dischargeDate} onChange={(event) => setEntryForm({ ...entryForm, dischargeDate: event.target.value })} InputLabelProps={{ shrink: true }} fullWidth margin="normal" />
            <TextField label="Discharge criteria" value={entryForm.dischargeCriteria} onChange={(event) => setEntryForm({ ...entryForm, dischargeCriteria: event.target.value })} fullWidth margin="normal" />
          </>
        )}
        <Button type="submit" variant="contained" disabled={entrySubmitting}>Add</Button>
      </form>
      )}
      <Typography variant="h5" sx={{ marginTop: 2 }}>Entries</Typography>
      {patient.entries.length > 0 ? (
        patient.entries.map((entry) => (
          <div key={entry.id} data-testid="patient-entry">
            <Typography>Type: {entry.type}</Typography>
            <Typography>Date: {entry.date}</Typography>
            <Typography>Description: {entry.description}</Typography>
            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
              <div>
                {entry.diagnosisCodes.map((code) => {
                  const diagnosis = diagnosisByCode.get(code);
                  return (
                    <Typography key={code}>
                      {code}{diagnosis ? ` — ${diagnosis.name}` : ""}
                    </Typography>
                  );
                })}
              </div>
            )}
            <EntryDetails entry={entry} />
          </div>
        ))
      ) : (
        <Typography>No entries</Typography>
      )}
    </div>
  );
};

export default PatientPage;
