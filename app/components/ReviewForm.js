'use client';
import { useState } from 'react';

export default function ReviewForm() {
  const [formData, setFormData] = useState({ name: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: '', text: '' });
      } else {
        alert('Failed to submit review.');
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{ background: '#dcfce7', color: '#166534', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', marginTop: '2rem' }}>
        <strong>Thank you!</strong> Your review has been submitted and is pending approval.
      </div>
    );
  }

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginTop: '2rem', border: '1px solid #e2e8f0' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#0f172a' }}>Leave a Review</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>Your Name</label>
          <input 
            type="text" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
            placeholder="John Doe"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>Your Experience</label>
          <textarea 
            required 
            value={formData.text}
            onChange={(e) => setFormData({...formData, text: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '100px', outline: 'none', resize: 'vertical' }} 
            placeholder="How was your consultation?"
          ></textarea>
        </div>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ alignSelf: 'flex-start', opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
