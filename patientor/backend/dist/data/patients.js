const data = [
    {
        "id": "d2773336-f723-11e9-8f0b-362b9e155667",
        "name": "John McClane",
        "dateOfBirth": "1986-07-09",
        "ssn": "090786-122X",
        "gender": "male",
        "occupation": "New york city cop",
        "entries": [
            {
                "id": "entry-1",
                "date": "2019-10-20",
                "type": "HealthCheck",
                "specialist": "Dr. House",
                "description": "Yearly control",
                "healthCheckRating": 0
            },
            {
                "id": "entry-2",
                "date": "2019-10-22",
                "type": "Hospital",
                "specialist": "Dr. Strange",
                "description": "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
                "diagnosisCodes": ["S62.5"],
                "discharge": {
                    "date": "2019-10-25",
                    "criteria": "Thumb has healed."
                }
            },
            {
                "id": "entry-3",
                "date": "2019-11-01",
                "type": "OccupationalHealthcare",
                "specialist": "Dr. Jones",
                "description": "Back pain",
                "employerName": "Acme Corporation",
                "sickLeave": {
                    "startDate": "2019-11-01",
                    "endDate": "2019-11-07"
                }
            }
        ]
    },
    {
        "id": "d2773598-f723-11e9-8f0b-362b9e155667",
        "name": "Martin Riggs",
        "dateOfBirth": "1979-01-30",
        "ssn": "300179-77A",
        "gender": "male",
        "occupation": "Cop",
        "entries": []
    },
    {
        "id": "d27736ec-f723-11e9-8f0b-362b9e155667",
        "name": "Hans Gruber",
        "dateOfBirth": "1970-04-25",
        "ssn": "250470-555L",
        "gender": "other",
        "occupation": "Technician",
        "entries": []
    },
    {
        "id": "d2773822-f723-11e9-8f0b-362b9e155667",
        "name": "Dana Scully",
        "dateOfBirth": "1974-01-05",
        "ssn": "050174-432N",
        "gender": "female",
        "occupation": "Forensic Pathologist",
        "entries": []
    },
    {
        "id": "d2773c6e-f723-11e9-8f0b-362b9e155667",
        "name": "Matti Luukkainen",
        "dateOfBirth": "1971-04-09",
        "ssn": "090471-8890",
        "gender": "male",
        "occupation": "Digital evangelist",
        "entries": []
    }
];
export default data;
