import { Typography } from '@mui/material';

import { Entry } from "../types";

interface Props {
  entry: Entry;
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry }: Props) => {
  switch (entry.type) {
    case "Hospital":
      return entry.discharge ? (
        <>
          <Typography>Discharge date: {entry.discharge.date}</Typography>
          <Typography>Discharge criteria: {entry.discharge.criteria}</Typography>
        </>
      ) : null;
    case "OccupationalHealthcare":
      return (
        <>
          <Typography>Employer: {entry.employerName}</Typography>
          {entry.sickLeave && (
            <>
              <Typography>Sick leave start: {entry.sickLeave.startDate}</Typography>
              <Typography>Sick leave end: {entry.sickLeave.endDate}</Typography>
            </>
          )}
        </>
      );
    case "HealthCheck":
      return <Typography>Health check rating: {entry.healthCheckRating}</Typography>;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
