import React, { useState } from 'react';

interface ImportResponse {
  error: boolean;
  message: string;
  counts?: {
    posts: number;
    comments: number;
    events: number;
  };
}

const ProjectImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [importCounts, setImportCounts] = useState<{ posts: number; comments: number; events: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMessage(null);
    setImportCounts(null);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleImport = async () => {
    setError(null);
    setSuccessMessage(null);
    setImportCounts(null);

    if (!file) {
      setError('Please select a JSON file to import.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await fetch('/posts/v1/import', {
        method: 'POST',
        body: formData,
        headers: {
          // Authorization header can be added here if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data: ImportResponse = await response.json();
        if (!data.error) {
          setSuccessMessage(data.message);
          if (data.counts) {
            setImportCounts(data.counts);
          }
        } else {
          setError(data.message || 'Import failed with unknown error.');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Import failed with server error.');
      }
    } catch (e) {
      setError('Network or server error during import.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20, border: '1px solid #ccc', borderRadius: 4 }}>
      <h2>Import Project Data</h2>
      <input
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        disabled={loading}
        aria-label="Select project JSON file to import"
      />
      <br />
      <button
        onClick={handleImport}
        disabled={loading || !file}
        style={{ marginTop: 10, padding: '6px 12px', cursor: loading || !file ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Importing...' : 'Import'}
      </button>

      {error && <p style={{ color: 'red', marginTop: 10 }} role="alert">Error: {error}</p>}
      {successMessage && <p style={{ color: 'green', marginTop: 10 }}>{successMessage}</p>}
      {importCounts && (
        <div style={{ marginTop: 10 }}>
          <strong>Imported Counts:</strong>
          <ul>
            <li>Posts: {importCounts.posts}</li>
            <li>Comments: {importCounts.comments}</li>
            <li>Events: {importCounts.events}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectImport;
