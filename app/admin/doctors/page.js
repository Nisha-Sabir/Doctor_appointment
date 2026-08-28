'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/doctors')
      .then(r => r.json())
      .then(data => {
        setDoctors(data.doctors || []);
        setLoading(false);
      });
  }, []);

  const handleEdit = (doc) => {
    setEditingDoctor({ ...doc });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor: editingDoctor })
      });
      
      if (res.ok) {
        setDoctors(docs => docs.map(d => d.id === editingDoctor.id ? editingDoctor : d));
        setEditingDoctor(null);
      } else {
        alert('Failed to save doctor details');
      }
    } catch (err) {
      alert('Error saving doctor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading doctors...</div>;
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Manage Doctors</h2>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Clinic Timings</th>
                <th>Online Timings</th>
                <th>Fees (Clinic/Online)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={doc.photo} alt={doc.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--secondary-dark)' }}>{doc.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>{doc.specialization}</td>
                  <td>{doc.clinicTimings}</td>
                  <td>{doc.onlineTimings}</td>
                  <td>Rs. {doc.clinicFee} / Rs. {doc.onlineFee}</td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(doc)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingDoctor && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Doctor: {editingDoctor.name}</h3>
              <button className={styles.modalClose} onClick={() => setEditingDoctor(null)}>✕</button>
            </div>
            
            <form onSubmit={handleSave} className={styles.formContainer}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input type="text" className={styles.formInput} value={editingDoctor.name} onChange={e => setEditingDoctor({...editingDoctor, name: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Title</label>
                  <input type="text" className={styles.formInput} value={editingDoctor.title} onChange={e => setEditingDoctor({...editingDoctor, title: e.target.value})} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone Number</label>
                  <input type="text" className={styles.formInput} value={editingDoctor.phone} onChange={e => setEditingDoctor({...editingDoctor, phone: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>WhatsApp Number</label>
                  <input type="text" className={styles.formInput} value={editingDoctor.whatsapp} onChange={e => setEditingDoctor({...editingDoctor, whatsapp: e.target.value})} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Clinic Timings</label>
                  <input type="text" className={styles.formInput} value={editingDoctor.clinicTimings} onChange={e => setEditingDoctor({...editingDoctor, clinicTimings: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Online Timings</label>
                  <input type="text" className={styles.formInput} value={editingDoctor.onlineTimings} onChange={e => setEditingDoctor({...editingDoctor, onlineTimings: e.target.value})} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Clinic Fee (Rs)</label>
                  <input type="number" className={styles.formInput} value={editingDoctor.clinicFee} onChange={e => setEditingDoctor({...editingDoctor, clinicFee: parseInt(e.target.value)})} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Online Fee (Rs)</label>
                  <input type="number" className={styles.formInput} value={editingDoctor.onlineFee} onChange={e => setEditingDoctor({...editingDoctor, onlineFee: parseInt(e.target.value)})} required />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                <label className={styles.formLabel}>Bio</label>
                <textarea className={styles.formTextarea} value={editingDoctor.bio} onChange={e => setEditingDoctor({...editingDoctor, bio: e.target.value})} rows="4" required></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setEditingDoctor(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
