import React, { useState } from 'react';

function PasswordRecovery() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resetToken, setResetToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setResetToken(null);

    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      const response = await fetch('/auth/password-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setSuccess('Password recovery email sent');
        setResetToken(data.resetToken || null); // For testing or UI display
        setEmail('');
      } else {
        setError(data.error || 'Password recovery failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div>
      <h2>Password Recovery</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Recovery Email</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {resetToken && <p>Your reset token (for testing): {resetToken}</p>}
    </div>
  );
}

export default PasswordRecovery;
