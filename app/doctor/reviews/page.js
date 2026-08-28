'use client';
import { useState, useEffect } from 'react';
import styles from '../messages/doctor-messages.module.css';

export default function DoctorReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  const [filter, setFilter] = useState('Pending');

  useEffect(() => {
    fetchWhoAmI();
  }, []);

  const fetchWhoAmI = async () => {
    const res = await fetch('/api/doctor-whoami');
    if (res.ok) {
      const data = await res.json();
      setDoctorId(data.doctorId);
      fetchReviews(data.doctorId);
    } else {
      window.location.href = '/doctor/login';
    }
  };

  const fetchReviews = async (dId) => {
    try {
      const res = await fetch(`/api/reviews?doctorId=${dId}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);
    } catch {}
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch {}
  };

  const filtered = filter === 'All' ? reviews : reviews.filter(r => r.status === filter);
  const pendingCount = reviews.filter(r => r.status === 'Pending').length;

  const cardStyle = {
    background: 'white',
    borderRadius: '14px',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    marginBottom: '1rem'
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem', color: '#64748b' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        Loading reviews...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>
          Patient Reviews
          {pendingCount > 0 && (
            <span style={{ marginLeft: '0.625rem', background: '#ef4444', color: 'white', borderRadius: '99px', padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
              {pendingCount} pending
            </span>
          )}
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9375rem' }}>
          Approve reviews to publish them on the website.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px', width: 'fit-content' }}>
        {['Pending', 'Published', 'All'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit',
              background: filter === f ? 'white' : 'transparent',
              color: filter === f ? '#0f172a' : '#64748b',
              boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            {f}
            {f === 'Pending' && pendingCount > 0 && (
              <span style={{ marginLeft: '0.375rem', background: '#ef4444', color: 'white', borderRadius: '99px', padding: '0.05rem 0.35rem', fontSize: '0.7rem' }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Review Cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b', background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
          <p style={{ margin: 0 }}>No {filter.toLowerCase()} reviews yet.</p>
        </div>
      ) : filtered.map(rev => (
        <div key={rev.id} style={{
          ...cardStyle,
          borderLeft: rev.status === 'Published' ? '4px solid #22c55e' : rev.status === 'Pending' ? '4px solid #f59e0b' : '4px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Left: author + stars + text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)',
                  color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1rem', flexShrink: 0
                }}>
                  {rev.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>{rev.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div style={{ marginBottom: '0.75rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: i < (rev.rating || 5) ? '#FBBF24' : '#e2e8f0', fontSize: '1.125rem' }}>★</span>
                ))}
              </div>

              {/* Review text */}
              <p style={{ margin: 0, color: '#334155', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                &ldquo;{rev.text}&rdquo;
              </p>
            </div>

            {/* Right: status + actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0 }}>
              <span style={{
                padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                background: rev.status === 'Published' ? '#dcfce7' : '#fef9c3',
                color: rev.status === 'Published' ? '#166534' : '#854d0e'
              }}>
                {rev.status}
              </span>

              {rev.status === 'Pending' ? (
                <button
                  onClick={() => handleStatusChange(rev.id, 'Published')}
                  style={{
                    background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px',
                    padding: '0.5rem 1.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                    fontFamily: 'inherit', whiteSpace: 'nowrap'
                  }}
                >
                  ✅ Approve & Publish
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange(rev.id, 'Pending')}
                  style={{
                    background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px',
                    padding: '0.5rem 1.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                    fontFamily: 'inherit', whiteSpace: 'nowrap'
                  }}
                >
                  Unpublish
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
