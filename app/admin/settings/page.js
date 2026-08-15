'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    clinicName: '',
    phone: '',
    address: '',
    onlineFee: '',
    inClinicFee: '',
    timingsMonToThu: '',
    timingsFriday: '',
    timingsSaturday: '',
    timingsSunday: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setSettings(data);
        }
        setIsLoading(false);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicName: settings.clinicName,
          phone: settings.phone,
          address: settings.address,
          onlineFee: settings.onlineFee,
          inClinicFee: settings.inClinicFee,
          timingsMonToThu: settings.timingsMonToThu,
          timingsFriday: settings.timingsFriday,
          timingsSaturday: settings.timingsSaturday,
          timingsSunday: settings.timingsSunday
        }),
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading settings...</div>;
  }

  return (
    <div className={styles.card} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Clinic Settings</h2>
      </div>
      
      <div style={{ padding: '2rem' }}>
        <form onSubmit={handleSave}>
          
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#0f172a' }}>General Information</h3>
          <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Clinic Name</label>
              <input 
                type="text" 
                value={settings.clinicName}
                onChange={(e) => setSettings({...settings, clinicName: e.target.value})}
                className="input-field"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Phone Number</label>
              <input 
                type="text" 
                value={settings.phone}
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                className="input-field"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Address</label>
              <textarea 
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                className="input-field"
                rows="2"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#0f172a' }}>Consultation Fees (Rs.)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Online Consultation</label>
              <input 
                type="text" 
                value={settings.onlineFee}
                onChange={(e) => setSettings({...settings, onlineFee: e.target.value})}
                className="input-field"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>In-Clinic Consultation</label>
              <input 
                type="text" 
                value={settings.inClinicFee}
                onChange={(e) => setSettings({...settings, inClinicFee: e.target.value})}
                className="input-field"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#0f172a' }}>Clinic Timings</h3>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Mon - Thu</label>
              <input 
                type="text" 
                value={settings.timingsMonToThu}
                onChange={(e) => setSettings({...settings, timingsMonToThu: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Friday</label>
              <input 
                type="text" 
                value={settings.timingsFriday}
                onChange={(e) => setSettings({...settings, timingsFriday: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Saturday</label>
              <input 
                type="text" 
                value={settings.timingsSaturday}
                onChange={(e) => setSettings({...settings, timingsSaturday: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Sunday</label>
              <input 
                type="text" 
                value={settings.timingsSunday}
                onChange={(e) => setSettings({...settings, timingsSunday: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
            {saved && <span style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: '500' }}>Settings saved successfully!</span>}
          </div>

        </form>
      </div>
    </div>
  );
}
