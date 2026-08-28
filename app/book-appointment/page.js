"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from "./page.module.css";
import Link from "next/link";

function BookAppointmentForm() {
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctor') || '';

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("clinic");
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    type: 'in_person',
    doctorId: preselectedDoctorId,
    doctorName: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // All available time slots
  const ALL_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  // Generate next 14 days
  const today = new Date();
  const next14Days = Array.from({length: 14}, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    fetch('/api/doctors').then(r => r.json()).then(data => {
      const docList = data.doctors || [];
      setDoctors(docList);
      if (preselectedDoctorId) {
        const doc = docList.find(d => d.id === preselectedDoctorId);
        if (doc) {
          setSelectedDoctor(doc);
          setFormData(prev => ({ ...prev, doctorId: doc.id, doctorName: doc.name }));
        }
      }
    });
  }, [preselectedDoctorId]);

  const handleDoctorSelect = (doc) => {
    setSelectedDoctor(doc);
    setFormData(prev => ({ ...prev, doctorId: doc.id, doctorName: doc.name, time: '' }));
  };

  const handleDateSelect = async (dateStr) => {
    setFormData(prev => ({ ...prev, date: dateStr, time: '' }));
    setLoadingSlots(true);
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        const bookedForDate = data
          .filter(apt => apt.date === dateStr && apt.status !== 'Cancelled' && apt.doctorId === formData.doctorId)
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
    if (!formData.doctorId) {
      alert("Please select a doctor.");
      return;
    }
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

  const getDayName = (d) => d.toLocaleDateString('en-US', { weekday: 'short' });
  const getDayNumber = (d) => d.getDate();
  const getMonthName = (d) => d.toLocaleDateString('en-US', { month: 'short' });
  const getDateString = (d) => {
    const offset = d.getTimezoneOffset();
    const d2 = new Date(d.getTime() - (offset * 60 * 1000));
    return d2.toISOString().split('T')[0];
  };

  if (isSuccess) {
    return (
      <div className={styles.bookingPage} style={{ paddingTop: '72px' }}>
        <div className="container" style={{ maxWidth: '600px', padding: '5rem 1.5rem', textAlign: 'center' }}>
          <div className={styles.successIcon}>✅</div>
          <h2 className={styles.successTitle}>Appointment Booked!</h2>
          <p className={styles.successText}>
            Thank you, <strong>{formData.firstName}</strong>! Your appointment with{' '}
            <strong>{formData.doctorName}</strong> on{' '}
            <strong>{formData.date}</strong> at <strong>{formData.time}</strong> has been received.
            Our staff will confirm it via WhatsApp or phone shortly.
          </p>
          <div className={styles.successActions}>
            <Link
              href="/patient"
              className="btn btn-primary"
            >
              🩺 Track Appointment & Chat with Doctor
            </Link>
            <Link href="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookingPage} style={{ paddingTop: '72px' }}>
      <div className={`container ${styles.bookingContainer}`}>
        
        {/* Header */}
        <div className={styles.bookingHeader}>
          <div className={styles.headerTag}>Schedule</div>
          <h1 className={styles.title}>Book an Appointment</h1>
          <p className={styles.subtitle}>
            Choose your dentist, select a convenient time, and we&apos;ll confirm your appointment.
          </p>
        </div>

        <div className={styles.bookingLayout}>
          {/* Form */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>

              {/* Step 1: Select Doctor */}
              <div className={styles.step}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepNum}>1</div>
                  <h3>Select a Doctor</h3>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="doctorSelect">Choose a Doctor *</label>
                  <select 
                    id="doctorSelect" 
                    className={styles.select} 
                    required 
                    value={formData.doctorId} 
                    onChange={(e) => {
                      const doc = doctors.find(d => d.id === e.target.value);
                      if (doc) handleDoctorSelect(doc);
                    }}
                  >
                    <option value="" disabled>-- Select a Doctor --</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} — {doc.specialization.split('—')[0].split('&')[0].trim()}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedDoctor && (
                  <div className={styles.selectedDoctorInfo} style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-alt)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <strong>{selectedDoctor.name}</strong>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>🏥 Clinic: {selectedDoctor.clinicTimings}</p>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>💻 Online: {selectedDoctor.onlineTimings}</p>
                      {selectedDoctor.offDays && (
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#ef4444', fontWeight: 500 }}>🚫 Off Dates: {selectedDoctor.offDays}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Date & Time */}
              <div className={styles.step}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepNum}>2</div>
                  <h3>Select Date & Time</h3>
                </div>
                
                {/* Date Picker */}
                <label className={styles.label}>Choose Date</label>
                <div className={styles.datePicker}>
                  {next14Days.map((d, i) => {
                    const dateStr = getDateString(d);
                    const isSelected = formData.date === dateStr;
                    const isSunday = d.getDay() === 0;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => !isSunday && handleDateSelect(dateStr)}
                        disabled={isSunday}
                        className={`${styles.dateBtn} ${isSelected ? styles.dateBtnSelected : ''} ${isSunday ? styles.dateBtnDisabled : ''}`}
                      >
                        <span className={styles.dateBtnDay}>{getDayName(d)}</span>
                        <span className={styles.dateBtnNum}>{getDayNumber(d)}</span>
                        <span className={styles.dateBtnMonth}>{getMonthName(d)}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots */}
                {formData.date && (
                  <div className={styles.timeSection}>
                    <label className={styles.label}>
                      Available Slots for {formData.date}
                    </label>
                    {loadingSlots ? (
                      <div className={styles.loadingSlots}>Checking availability…</div>
                    ) : (
                      <div className={styles.timeSlotsGrid}>
                        {ALL_SLOTS.map((time) => {
                          const isBooked = bookedSlots.includes(time);
                          const isSelected = formData.time === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => !isBooked && setFormData(prev => ({ ...prev, time }))}
                              disabled={isBooked}
                              className={`${styles.timeSlot} ${isSelected ? styles.timeSlotSelected : ''} ${isBooked ? styles.timeSlotBooked : ''}`}
                            >
                              {time}
                              {isBooked && <span className={styles.bookedLabel}>Full</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step 3: Patient Info */}
              <div className={styles.step}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepNum}>3</div>
                  <h3>Patient Information</h3>
                </div>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="firstName">First Name *</label>
                    <input type="text" id="firstName" className={styles.input} placeholder="Ali" required value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="lastName">Last Name *</label>
                    <input type="text" id="lastName" className={styles.input} placeholder="Raza" required value={formData.lastName} onChange={handleInputChange} />
                  </div>
                </div>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="phone">Phone Number *</label>
                    <input type="tel" id="phone" className={styles.input} placeholder="+92 300 0000000" required value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="email">Email (Optional)</label>
                    <input type="email" id="email" className={styles.input} placeholder="ali@example.com" value={formData.email} onChange={handleInputChange} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="type">Consultation Type *</label>
                  <select id="type" className={styles.select} required value={formData.type} onChange={handleInputChange}>
                    <option value="in_person">🏥 In-Clinic Visit — Rs. {selectedDoctor?.clinicFee || '1500'}</option>
                    <option value="online">💻 Online Video Consultation — Rs. {selectedDoctor?.onlineFee || '1000'}</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="notes">Reason for Visit / Notes (Optional)</label>
                  <textarea id="notes" className={styles.textarea} placeholder="e.g. Tooth pain, need braces consultation…" value={formData.notes} onChange={handleInputChange} rows={3} />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={isSubmitting}>
                {isSubmitting ? 'Booking…' : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Confirm Appointment
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar Info */}
          <div className={styles.bookingSidebar}>
            <div className={styles.sideCard}>
              <h4>🕐 Clinic Timings</h4>
              <div className={styles.timingLine}><span>Mon – Thu</span><span>5:00 PM – 9:00 PM</span></div>
              <div className={styles.timingLine}><span>Friday</span><span>3:00 PM – 7:00 PM</span></div>
              <div className={styles.timingLine}><span>Saturday</span><span>11:00 AM – 3:00 PM</span></div>
              <div className={styles.timingLine}><span>Sunday</span><span style={{ color: 'var(--danger-color)' }}>Closed</span></div>
            </div>

            <div className={styles.sideCard}>
              <h4>📞 Need Help?</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Call us or WhatsApp to book by phone.
              </p>
              <a href="tel:+923323284294" className="btn btn-call btn-sm" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.625rem' }}>
                📞 0332-3284294
              </a>
              <a href="https://wa.me/923323284294" target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                WhatsApp
              </a>
            </div>

            <div className={styles.sideCard} style={{ background: 'var(--primary-light)' }}>
              <h4>💡 Quick Tips</h4>
              <ul style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', paddingLeft: '1rem', lineHeight: 1.75 }}>
                <li>Arrive 10 minutes early for first visit</li>
                <li>Bring previous dental records if any</li>
                <li>Online consultations via WhatsApp/Zoom</li>
                <li>Cancellations: 24 hours notice required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: '72px', textAlign: 'center', padding: '5rem' }}>Loading…</div>}>
      <BookAppointmentForm />
    </Suspense>
  );
}
