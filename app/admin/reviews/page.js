'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        // Sort by newest first
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(sorted);
      }
    } catch (err) {
      console.error('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setReviews(prev => 
          prev.map(rev => rev.id === id ? { ...rev, status: newStatus } : rev)
        );
      }
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  const filteredReviews = filter === 'All' 
    ? reviews 
    : reviews.filter(rev => rev.status === filter);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className={styles.cardTitle}>Manage Reviews</h2>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Pending', 'Published'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient Name</th>
              <th>Review</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((rev) => (
              <tr key={rev.id}>
                <td>{new Date(rev.createdAt).toLocaleDateString()}</td>
                <td style={{fontWeight: '500'}}>{rev.name}</td>
                <td>
                  <p style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rev.text}
                  </p>
                </td>
                <td>
                  <span className={`${styles.badge} ${rev.status === 'Published' ? styles.badgeCompleted : styles.badgePending}`}>
                    {rev.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    {rev.status === 'Pending' ? (
                      <button 
                        onClick={() => handleStatusChange(rev.id, 'Published')}
                        className={`${styles.actionBtn} ${styles.btnApprove}`}
                      >
                        Publish
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusChange(rev.id, 'Pending')}
                        className={`${styles.actionBtn} ${styles.btnReject}`}
                      >
                        Unpublish
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredReviews.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
