'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        const list = data.appointments || data || [];
        const sorted = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAppointments(sorted);
      }
    } catch (err) {
      console.error('Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt)
        );
      }
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Pending': return styles.badgePending;
      case 'Approved': return styles.badgeApproved;
      case 'Completed': return styles.badgeCompleted;
      case 'Cancelled': return styles.badgeCancelled;
      default: return '';
    }
  };

  const filteredAppointments = filter === 'All' 
    ? appointments 
    : appointments.filter(apt => apt.status === filter);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className={styles.cardTitle}>All Appointments</h2>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Pending', 'Approved', 'Completed', 'Cancelled'].map(f => (
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
              <th>ID</th>
              <th>Patient</th>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((apt) => (
              <tr key={apt.id}>
                <td style={{fontWeight: '500'}}>{apt.id}</td>
                <td>
                  <div className={styles.patientInfo}>
                    <span className={styles.patientName}>{apt.firstName} {apt.lastName}</span>
                    <span className={styles.patientContact}>{apt.phone}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.patientInfo}>
                    <span>{apt.date}</span>
                    <span className={styles.patientContact}>{apt.time}</span>
                  </div>
                </td>
                <td>{apt.type === 'in_person' ? 'In-Clinic' : 'Online'}</td>
                <td>
                  <span className={`${styles.badge} ${getStatusBadgeClass(apt.status)}`}>
                    {apt.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    {apt.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(apt.id, 'Approved')}
                          className={`${styles.actionBtn} ${styles.btnApprove}`}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                          className={`${styles.actionBtn} ${styles.btnReject}`}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {apt.status === 'Approved' && (
                      <button 
                        onClick={() => handleStatusChange(apt.id, 'Completed')}
                        className={`${styles.actionBtn} ${styles.btnView}`}
                        style={{ background: '#e0e7ff', color: '#4338ca' }}
                      >
                        Mark Completed
                      </button>
                    )}
                    <button className={`${styles.actionBtn} ${styles.btnView}`}>
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                  No appointments found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
