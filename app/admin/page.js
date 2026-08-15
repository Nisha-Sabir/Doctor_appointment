import styles from './admin.module.css';
import Link from 'next/link';

// Mock Data for Dashboard
const stats = [
  { title: "Total Appointments", value: "1,248", icon: "calendar", type: "primary" },
  { title: "Today's Consultations", value: "12", icon: "users", type: "warning" },
  { title: "Pending Approvals", value: "5", icon: "clock", type: "warning" },
  { title: "Revenue (This Month)", value: "Rs. 45k", icon: "trending-up", type: "success" }
];

const recentAppointments = [
  { id: "APT-001", name: "Ali Raza", contact: "+92 300 1112223", date: "2023-11-20", time: "16:30", type: "Online", status: "Approved" },
  { id: "APT-002", name: "Sara Khan", contact: "+92 321 4445556", date: "2023-11-20", time: "17:00", type: "In-Clinic", status: "Pending" },
  { id: "APT-003", name: "Usman Ahmed", contact: "+92 333 7778889", date: "2023-11-21", time: "18:15", type: "Online", status: "Approved" },
  { id: "APT-004", name: "Ayesha Malik", contact: "+92 345 9990001", date: "2023-11-21", time: "19:00", type: "In-Clinic", status: "Completed" }
];

export default function AdminDashboard() {
  const getIcon = (name) => {
    switch(name) {
      case 'calendar': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
      case 'users': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
      case 'clock': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
      case 'trending-up': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
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
                <th>Date & Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((apt) => (
                <tr key={apt.id}>
                  <td style={{fontWeight: '500'}}>{apt.id}</td>
                  <td>
                    <div className={styles.patientInfo}>
                      <span className={styles.patientName}>{apt.name}</span>
                      <span className={styles.patientContact}>{apt.contact}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.patientInfo}>
                      <span>{apt.date}</span>
                      <span className={styles.patientContact}>{apt.time}</span>
                    </div>
                  </td>
                  <td>{apt.type}</td>
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
