'use client';
import { useState, useEffect } from 'react';

export default function ReviewForm() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({ name: '', text: '', rating: 5, doctorId: '', doctorName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    fetch('/api/doctors').then(r => r.json()).then(d => setDoctors(d.doctors || []));
  }, []);

  const handleDoctorChange = (e) => {
    const doc = doctors.find(d => d.id === e.target.value);
    setFormData(prev => ({ ...prev, doctorId: e.target.value, doctorName: doc?.name || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doctorId) { alert('Please select a doctor.'); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: '', text: '', rating: 5, doctorId: '', doctorName: '' });
      } else {
        alert('Failed to submit review.');
      }
    } catch {
      alert('Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
        color: '#166534',
        padding: '2rem',
        borderRadius: '16px',
        textAlign: 'center',
        marginTop: '2rem',
        border: '1px solid #86efac'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Thank You for Your Review!</h3>
        <p style={{ margin: 0, fontSize: '0.9375rem' }}>
          Your review has been submitted and is pending approval by the doctor. Once approved, it will appear on our website.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          style={{ marginTop: '1rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', cursor: 'pointer', fontWeight: 600 }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '20px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
      marginTop: '2rem',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>
          ✍️ Share Your Experience
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
          Your review helps other patients and motivates our team.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Doctor Select */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
            Select Your Doctor *
          </label>
          <select
            required
            value={formData.doctorId}
            onChange={handleDoctorChange}
            style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
              border: '1.5px solid #e2e8f0', fontSize: '0.9375rem', fontFamily: 'inherit',
              outline: 'none', background: '#f8fafc', color: '#0f172a'
            }}
          >
            <option value="">-- Select a Doctor --</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.name} — {doc.specialization.split('—')[0].trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
            Your Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Ali Raza"
            style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
              border: '1.5px solid #e2e8f0', fontSize: '0.9375rem', fontFamily: 'inherit',
              outline: 'none', background: '#f8fafc'
            }}
          />
        </div>

        {/* Star Rating */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
            Your Rating *
          </label>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0.125rem',
                  fontSize: '2rem', lineHeight: 1, transition: 'transform 0.15s',
                  transform: (hoveredStar || formData.rating) >= star ? 'scale(1.15)' : 'scale(1)'
                }}
                aria-label={`${star} star`}
              >
                <span style={{ color: (hoveredStar || formData.rating) >= star ? '#FBBF24' : '#e2e8f0' }}>★</span>
              </button>
            ))}
            <span style={{ marginLeft: '0.5rem', color: '#64748b', fontSize: '0.875rem', alignSelf: 'center' }}>
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hoveredStar || formData.rating]}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
            Your Experience *
          </label>
          <textarea
            required
            value={formData.text}
            onChange={e => setFormData(prev => ({ ...prev, text: e.target.value }))}
            placeholder="How was your consultation? Tell us about your experience..."
            rows={4}
            minLength={20}
            style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
              border: '1.5px solid #e2e8f0', fontSize: '0.9375rem', fontFamily: 'inherit',
              outline: 'none', background: '#f8fafc', resize: 'vertical', minHeight: '110px'
            }}
          />
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Minimum 20 characters · {formData.text.length} typed
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
          style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem', opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? 'Submitting...' : '🚀 Submit Review'}
        </button>
      </form>
    </div>
  );
}
