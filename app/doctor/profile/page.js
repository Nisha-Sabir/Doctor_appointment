'use client';
import { useState, useEffect } from 'react';
import styles from './doctor-profile.module.css';

export default function DoctorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    clinicTimings: '',
    onlineTimings: '',
    clinicFee: '',
    onlineFee: '',
    offDays: '' // new field
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/doctor-profile');
      if (res.ok) {
        const { doctor } = await res.json();
        setFormData({
          clinicTimings: doctor.clinicTimings || '',
          onlineTimings: doctor.onlineTimings || '',
          clinicFee: doctor.clinicFee || '',
          onlineFee: doctor.onlineFee || '',
          offDays: doctor.offDays || ''
        });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load profile data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' }); // clear message on edit
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/doctor-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        const errorData = await res.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to update profile.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#64748b' }}>
        Loading profile settings...
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile Settings</h1>
        <p className={styles.subtitle}>Update your clinic timings, fees, and off days.</p>
      </div>

      {message.text && (
        <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* Timings & Availability Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🕒 Timings & Availability</h2>
          
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>In-Clinic Timings</label>
              <input 
                type="text" 
                name="clinicTimings"
                value={formData.clinicTimings}
                onChange={handleChange}
                placeholder="e.g. Mon–Sat: 5:00 PM – 9:00 PM"
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Online Timings</label>
              <input 
                type="text" 
                name="onlineTimings"
                value={formData.onlineTimings}
                onChange={handleChange}
                placeholder="e.g. Mon–Fri: 12:00 PM – 2:00 PM"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Off Dates / Holidays (Optional)</label>
            <input 
              type="text" 
              name="offDays"
              value={formData.offDays}
              onChange={handleChange}
              placeholder="e.g. Unavailable from 10th to 15th Aug, Sunday Closed"
              className={styles.input}
            />
            <small style={{ color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
              Note down your unavailable dates so patients know when you are away.
            </small>
          </div>
        </div>

        {/* Fees Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>💰 Consultation Fees</h2>
          
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>In-Clinic Fee (Rs.)</label>
              <input 
                type="number" 
                name="clinicFee"
                value={formData.clinicFee}
                onChange={handleChange}
                placeholder="e.g. 1500"
                className={styles.input}
                min="0"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Online Fee (Rs.)</label>
              <input 
                type="number" 
                name="onlineFee"
                value={formData.onlineFee}
                onChange={handleChange}
                placeholder="e.g. 1000"
                className={styles.input}
                min="0"
              />
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
