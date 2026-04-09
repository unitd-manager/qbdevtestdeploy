'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordProtection from './PasswordProtection';

export default function PasswordProtectedPage({ slug }) {
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePasswordSubmit = async (password) => {
    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the page to show content
        router.refresh();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return <PasswordProtection onSubmit={handlePasswordSubmit} error={error} />;
}