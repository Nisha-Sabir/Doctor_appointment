"use client";

import { useState, useEffect } from 'react';
import styles from "./page.module.css";
import Link from "next/link";

export default function BookAppointment() {
  const [paymentMethod, setPaymentMethod] = useState("clinic");
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    type: 'in_person'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Smart Calendar State
  const [availableSlots, setAvailableSlots] = useState(['16:00', '17:00', '18:00', '19:00', '20:00']);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Generate next 14 days
  const today = new Date();
  const next14Days = Array.from({length: 14}, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  const handleDateSelect = async (dateStr) => {
    setFormData(prev => ({ ...prev, date: dateStr, time: '' }));
    setLoadingSlots(true);
    
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        // Find all appointments for this date that are not cancelled
        const bookedForDate = data
          .filter(apt => apt.date === dateStr && apt.status !== 'Cancelled')
          .map(apt => apt.time);
        
        setBookedSlots(bookedForDate);
      }
    } catch (err) {
      console.error('Failed to fetch slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      alert("Please select a date and time slot.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, paymentMethod })
      });
      if (res.ok) {
        setIsSuccess(true);
      } else {
        alert('Failed to book appointment. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.bookingPage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.formCard} style={{ textAlign: 'center', maxWidth: '500px', padding: '4rem 2rem' }}>
          <div style={{ width: '80px', height: '80px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '1rem' }}>Appointment Request Sent!</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            Thank you, {formData.firstName}. Your appointment request for {formData.date} at {formData.time} has been received. 
            Our staff will review and confirm it shortly.
          </p>
          <Link href="/" className="btn btn-primary">Return to Homepage</Link>
        </div>
      </div>
    );
  }

  const getDayName = (d) => d.toLocaleDateString('en-US', { weekday: 'short' });
  const getDayNumber = (d) => d.getDate();
  const getDateString = (d) => {
    const offset = d.getTimezoneOffset();
    const d2 = new Date(d.getTime() - (offset*60*1000));
    return d2.toISOString().split('T')[0];
  };

  return (
    <div className={styles.bookingPage}>
      <div className={`container ${styles.bookingContainer}`}>
        <div className={styles.bookingHeader}>
          <h1 className={styles.title}>Book an Appointment</h1>
          <p className={styles.subtitle}>
            Fill out the form below to schedule your consultation.
          </p>
        </div>
        
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <h3 style={{marginBottom: '1.5rem', color: 'var(--primary-dark)'}}>1. Select Date & Time (Smart Calendar)</h3>
            
            <div style={{ marginBottom: '2rem' }}>
              <label className={styles.label}>Choose a Date</label>
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                {next14Days.map((d, i) => {
                  const dateStr = getDateString(d);
                  const isSelected = formData.date === dateStr;
                  const isSunday = d.getDay() === 0;
                  
                  return (
                    <div 
                      key={i} 
                      onClick={() => !isSunday && handleDateSelect(dateStr)}
                      style={{
                        minWidth: '70px',
                        padding: '0.75rem 0.5rem',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                        backgroundColor: isSelected ? 'var(--primary-color)' : isSunday ? '#f1f5f9' : 'transparent',
                        color: isSelected ? 'white' : isSunday ? '#94a3b8' : 'var(--text-main)',
                        cursor: isSunday ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        opacity: isSunday ? 0.5 : 1,
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>{getDayName(d)}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{getDayNumber(d)}</div>
                    </div>
                  );
                })}
              </div>

              {formData.date && (
                <div style={{ marginTop: '1.5rem' }}>
                  <label className={styles.label}>Available Time Slots</label>
                  {loadingSlots ? (
                    <div style={{ padding: '1rem', color: 'var(--primary-color)' }}>Checking availability...</div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {availableSlots.map((time) => {
                        const isBooked = bookedSlots.includes(time);
                        const isSelected = formData.time === time;
                        
                        return (
                          <div 
                            key={time}
                            onClick={() => !isBooked && setFormData(prev => ({ ...prev, time }))}
                            style={{
                              padding: '0.75rem 1.25rem',
                              borderRadius: '8px',
                              border: `1px solid ${isSelected ? 'var(--primary-color)' : isBooked ? '#cbd5e1' : 'var(--primary-color)'}`,
                              backgroundColor: isSelected ? 'var(--primary-color)' : isBooked ? '#e2e8f0' : 'transparent',
                              color: isSelected ? 'white' : isBooked ? '#94a3b8' : 'var(--primary-color)',
                              cursor: isBooked ? 'not-allowed' : 'pointer',
                              fontWeight: 600,
                              textDecoration: isBooked ? 'line-through' : 'none'
                            }}
                          >
                            {time}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <h3 style={{marginBottom: '1.5rem', color: 'var(--primary-dark)'}}>2. Patient Information</h3>
            
            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" className={styles.input} placeholder="Ali" required value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" className={styles.input} placeholder="Raza" required value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>
            
            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" className={styles.input} placeholder="+92 300 0000000" required value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">Email Address</label>
                <input type="email" id="email" className={styles.input} placeholder="ali@example.com" value={formData.email} onChange={handleInputChange} />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="type">Consultation Type</label>
              <select id="type" className={styles.select} required value={formData.type} onChange={handleInputChange}>
                <option value="in_person">In-Clinic Visit (Rs. 2,000)</option>
                <option value="online">Online Video Consult (Rs. 1,500)</option>
              </select>
            </div>

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={isSubmitting} style={{marginTop: '2rem'}}>
              {isSubmitting ? 'Submitting...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
