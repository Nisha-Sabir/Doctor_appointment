'use client';
import { useState, useEffect, useRef } from 'react';
import styles from '../admin/admin.module.css';

export default function DoctorDashboardClient({ initialDoctor, initialAppointments }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [updating, setUpdating] = useState(null); // appointmentId being updated
  const pollingRef = useRef(null);

  // Live polling every 10 seconds
  useEffect(() => {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/doctor-whoami');
        if (!res.ok) return;
        const { doctorId } = await res.json();
        const aRes = await fetch(`/api/appointments?doctorId=${doctorId}`);
        if (aRes.ok) {
          const data = await aRes.json();
          setAppointments(data.appointments || []);
        }
      } catch (_) {}
    }, 10000);
    return () => clearInterval(pollingRef.current);
  }, []);

  const updateStatus = async (appointmentId, status) => {
    setUpdating(appointmentId);
    try {
      const res = await fetch('/api/appointments/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status })
      });
      if (res.ok) {
        setAppointments(prev =>
          prev.map(a => a.id === appointmentId ? { ...a, status } : a)
        );
      }
    } catch (_) {}
    setUpdating(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return styles.badgePending;
      case 'Approved': return styles.badgeApproved;
      case 'Completed': return styles.badgeCompleted;
      case 'Cancelled': return styles.badgeCancelled;
      default: return '';
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const totalAppointments = appointments.length;
  const todaysConsultations = appointments.filter(a => a.date === today).length;
  const pendingApprovals = appointments.filter(a => a.status === 'Pending').length;

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary-dark)' }}>Welcome, {initialDoctor.name}!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Here is your schedule and patient updates. Updates every 10 seconds automatically.</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {[
          { title: 'Total Appointments', value: totalAppointments, icon: '📅', type: 'primary' },
          { title: "Today's Consultations", value: todaysConsultations, icon: '👥', type: 'warning' },
          { title: 'Pending Approvals', value: pendingApprovals, icon: '🕒', type: 'warning' },
        ].map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statInfo}>
              <h3>{stat.title}</h3>
              <div className={styles.statValue}>{stat.value}</div>
            </div>
            <div className={`${styles.statIcon} ${stat.type === 'primary' ? styles.statIconPrimary : styles.statIconWarning}`}>
              <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Appointments Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>My Appointments</h2>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No appointments assigned to you yet
                  </td>
                </tr>
              ) : appointments.map(apt => (
                <tr key={apt.id}>
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
                  <td>{apt.type === 'online' ? 'Online' : 'In-Clinic'}</td>
                  <td>
                    <span className={`${styles.badge} ${getStatusBadgeClass(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                      {apt.status === 'Pending' && (
                        <button
                          onClick={() => updateStatus(apt.id, 'Approved')}
                          disabled={updating === apt.id}
                          style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', borderRadius: '6px', background: '#16a34a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                        >
                          ✓ Approve
                        </button>
                      )}
                      {(apt.status === 'Pending' || apt.status === 'Approved') && (
                        <button
                          onClick={() => updateStatus(apt.id, 'Completed')}
                          disabled={updating === apt.id}
                          style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', borderRadius: '6px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                        >
                          ✓ Done
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                        <button
                          onClick={() => updateStatus(apt.id, 'Cancelled')}
                          disabled={updating === apt.id}
                          style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', borderRadius: '6px', background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                        >
                          ✕ Cancel
                        </button>
                      )}
                      {(apt.status === 'Completed' || apt.status === 'Cancelled') && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
