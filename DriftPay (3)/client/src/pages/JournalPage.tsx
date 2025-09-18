
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface JournalEntry {
  id: number;
  user_id: string;
  text: string;
  timestamp: string;
}

const JournalPage = () => {
  const [uid, setUid] = useState('default');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/journal/${uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch journal entries.');
      }
      const data = await response.json();
      setEntries(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentUid = params.get('uid') || 'default';
    setUid(currentUid);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleDelete = async (entryId: number) => {
    try {
      const response = await fetch(`/api/journal/${entryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete entry.');
      }
      setEntries(entries.filter(entry => entry.id !== entryId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete entry.');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4 text-center">Dream Journal</h1>
      {loading && <p className="text-center">Loading entries...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}
      {!loading && !error && entries.length === 0 && (
        <p className="text-center text-muted-foreground">Your journal is empty. Start a sleep session to record your dreams.</p>
      )}
      <div className="flex flex-col gap-4">
        {entries.map(entry => (
          <div key={entry.id} className="card p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{formatTimestamp(entry.timestamp)}</p>
                <p className="mt-2">{entry.text}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(entry.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
