import { useEffect, useState } from 'react';

type Weather = 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'windy';
type Visibility = 'great' | 'good' | 'ok' | 'poor';

type DiaryEntry = {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
};

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/diaries');

        if (!response.ok) {
          throw new Error('Failed to load diary entries');
        }

        const data: DiaryEntry[] = await response.json();
        setEntries(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchEntries();
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Flight Diaries</h1>

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
              {entry.comment && (
                <p>
                  <strong>Comment:</strong> {entry.comment}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
