'use client';
import { useState } from 'react';
import { ArrowRight } from './Icons';

export default function CommentForm({ postId }) {
  const [form, setForm] = useState({
    author: '',
    email: '',
    website: '',
    comment: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/comments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            post: postId, 
            author_name: form.author,
            author_email: form.email,
            author_url: form.website,
            content: form.comment
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setStatus('✅ Comment submitted successfully!');
        setForm({ author: '', email: '', website: '', comment: '' });
      } else {
        setStatus(data.message || '❌ Failed to submit comment.');
      }
    } catch (error) {
      console.error(error);
      setStatus('❌ Error submitting comment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
    
      <input type="text" name="author" placeholder="Full Name*" value={form.author} onChange={handleChange} required />

      <input type="email" name="email" placeholder="Email*" value={form.email} onChange={handleChange} required />

      <input type="url" name="website" placeholder="Website" value={form.website} onChange={handleChange} />

      <textarea name="comment" placeholder="Comment*" value={form.comment} onChange={handleChange} required />

      <button type="submit" className="btn primary-btn">
        Submit <ArrowRight />
      </button>

      {status && <p className="status">{status}</p>}
    </form>
  );
}
