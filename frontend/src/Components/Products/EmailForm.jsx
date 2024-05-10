import React, { useState } from 'react';
import axios from 'axios';

function EmailForm() {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/send_email`, {
        recipient,
        subject,
        message,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
    setSending(false);
  };

  return (
    <div>
      <h2>Send Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Recipient Email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <button type="submit" disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
      {error && <p>Error: {error}</p>}
      {success && <p>Email sent successfully!</p>}
    </div>
  );
}

export default EmailForm;
