import styles from './admin.module.css';
import Link from 'next/link';
import { getDB } from '../../lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const db = await getDB();
  const appointments = db.appointments || [];
  
  // Calculate Stats
  const totalAppointments = appointments.length;
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const todaysConsultations = appointments.filter(a => a.date === todayStr).length;
  const pendingApprovals = appointments.filter(a => a.status === 'Pending').length;
  
  // Calculate revenue (this month)
  const thisMonthStr = today.toISOString().slice(0, 7); // YYYY-MM
  let revenue = 0;
  appointments.forEach(apt => {
    if (apt.date && apt.date.startsWith(thisMonthStr) && apt.status === 'Completed') {
      const isOnline = apt.type === 'online';
      const doctor = db.doctors?.find(d => d.id === apt.doctorId);
      if (doctor) {
        revenue += isOnline ? doctor.onlineFee : doctor.clinicFee;
      } else {
        revenue += isOnline ? 1000 : 2000;
      }
    }
  });

  const stats = [
    { title: "Total Appointments", value: totalAppointments.toString(), icon: "calendar", type: "primary" },
    { title: "Today's Consultations", value: todaysConsultations.toString(), icon: "users", type: "warning" },
    { title: "Pending Approvals", value: pendingApprovals.toString(), icon: "clock", type: "warning" },
    { title: "Revenue (This Month)", value: `Rs. ${revenue.toLocaleString()}`, icon: "trending-up", type: "success" }
  ];

  const recentAppointments = appointments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getIcon = (name) => {
    switch(name) {
      case 'calendar': return <span style={{fontSize: '1.5rem'}}>📅</span>;
      case 'users': return <span style={{fontSize: '1.5rem'}}>👥</span>;
      case 'clock': return <span style={{fontSize: '1.5rem'}}>🕒</span>;
      case 'trending-up': return <span style={{fontSize: '1.5rem'}}>📈</span>;
      default: return null;
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

  return (
    <>
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statInfo}>
              <h3>{stat.title}</h3>
              <div className={styles.statValue}>{stat.value}</div>
            </div>
            <div className={`${styles.statIcon} ${stat.type === 'primary' ? styles.statIconPrimary : stat.type === 'success' ? styles.statIconSuccess : stat.type === 'warning' ? styles.statIconWarning : ''}`}>
              {getIcon(stat.icon)}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Appointments</h2>
          <Link href="/admin/appointments" className="btn btn-outline" style={{padding: '0.375rem 0.75rem', fontSize: '0.875rem'}}>
            View All
          </Link>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>No appointments yet</td>
                </tr>
              ) : recentAppointments.map((apt) => (
                <tr key={apt.id}>
                  <td style={{fontWeight: '500'}}>
                    <span title={apt.id}>{apt.id.substring(0, 6)}...</span>
                  </td>
                  <td>
                    <div className={styles.patientInfo}>
                      <span className={styles.patientName}>{apt.firstName} {apt.lastName}</span>
                      <span className={styles.patientContact}>{apt.phone}</span>
                    </div>
                  </td>
                  <td>{apt.doctorName}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
