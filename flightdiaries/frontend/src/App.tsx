import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import axios, { type AxiosError } from 'axios';

type Weather = 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'windy';
type Visibility = 'great' | 'good' | 'ok' | 'poor';

type DiaryEntry = {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
};

type NewDiaryEntry = {
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
};

type FormState = NewDiaryEntry;

const weatherOptions: Weather[] = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'];
const visibilityOptions: Visibility[] = ['great', 'good', 'ok', 'poor'];

const initialFormState: FormState = {
  date: '',
  weather: 'sunny',
  visibility: 'great',
  comment: '',
};

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get<DiaryEntry[]>('/api/diaries');
        setEntries(response.data);
      } catch (err) {
        const axiosError = err as AxiosError<{ error?: string }>;
        const message = axiosError.response?.data?.error ?? 'Failed to load diary entries';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchEntries();
  }, []);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post<DiaryEntry>('/api/diaries', form);
      setEntries((previous) => [...previous, response.data]);
      setForm(initialFormState);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      const message = axiosError.response?.data?.error ?? 'Failed to create diary entry';
      setError(message);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Flight Diaries</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'grid', gap: '0.75rem' }}>
        <div>
          <label htmlFor="date">Date</label>
          <br />
          <input id="date" name="date" type="date" value={form.date} onChange={handleInputChange} />
        </div>

        <div>
          <label htmlFor="weather">Weather</label>
          <br />
          <select id="weather" name="weather" value={form.weather} onChange={handleInputChange}>
            {weatherOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="visibility">Visibility</label>
          <br />
          <select id="visibility" name="visibility" value={form.visibility} onChange={handleInputChange}>
            {visibilityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="comment">Comment</label>
          <br />
          <textarea
            id="comment"
            name="comment"
            value={form.comment}
            onChange={handleInputChange}
            rows={4}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit">Add entry</button>
      </form>

      {loading && <p>Loading diary entries...</p>}
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}

      {!loading && !error && entries.length === 0 && <p>No diary entries found.</p>}

      {!loading && !error && entries.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {entries.map((entry) => (
            <li
              key={entry.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h2>{entry.date}</h2>
              <p>
                <strong>Weather:</strong> {entry.weather}
              </p>
              <p>
                <strong>Visibility:</strong> {entry.visibility}
              </p>
              <p>
                <strong>Comment:</strong> {entry.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
