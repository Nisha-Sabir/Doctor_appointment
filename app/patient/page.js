'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './patient.module.css';

export default function PatientPortalPage() {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // ── Data ──────────────────────────────────────────────────────────────────
  const [appointments, setAppointments] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Chat ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);
  const chatInputRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages, selectedDoctorId]);

  // Load doctors on mount
  useEffect(() => {
    fetch('/api/doctors').then(r => r.json()).then(d => setDoctors(d.doctors || []));
  }, []);

  // Restore session from localStorage
  const loadData = useCallback(async (ph, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/patient-portal?phone=${encodeURIComponent(ph)}`);
      const data = await res.json();
      if (data.appointments) setAppointments(data.appointments);
      if (data.messages) setAllMessages(data.messages);

      // Auto-select doctor from first appointment if not yet chosen
      if (!selectedDoctorId && data.appointments?.length > 0) {
        const apt = data.appointments[0];
        setSelectedDoctorId(apt.doctorId || '');
        setSelectedDoctorName(apt.doctorName || '');
      }
    } catch (e) {}
    if (!silent) setLoading(false);
  }, [selectedDoctorId]);

  useEffect(() => {
    const savedPhone = localStorage.getItem('patient_phone');
    const savedName = localStorage.getItem('patient_name');
    if (savedPhone && savedName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhone(savedPhone);
      setName(savedName);
      setIsLoggedIn(true);
      loadData(savedPhone);
    }
  }, [loadData]);

  // Live polling — refresh every 6 seconds when logged in
  useEffect(() => {
    if (isLoggedIn && phone) {
      pollingRef.current = setInterval(() => {
        loadData(phone, true);
      }, 6000);
    }
    return () => clearInterval(pollingRef.current);
  }, [isLoggedIn, phone, loadData]);

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setLoginError('Please enter a valid phone number (used when booking appointment).');
      return;
    }
    if (!name.trim()) {
      setLoginError('Please enter your name.');
      return;
    }
    localStorage.setItem('patient_phone', cleanPhone);
    localStorage.setItem('patient_name', name.trim());
    setPhone(cleanPhone);
    setIsLoggedIn(true);
    setLoginError('');
    loadData(cleanPhone);
  };

  const handleLogout = () => {
    localStorage.removeItem('patient_phone');
    localStorage.removeItem('patient_name');
    setIsLoggedIn(false);
    setAppointments([]);
    setAllMessages([]);
    setPhone('');
    setName('');
    setSelectedDoctorId('');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedDoctorId) return;
    setSending(true);

    const doc = doctors.find(d => d.id === selectedDoctorId);
    const payload = {
      patientName: name,
      patientPhone: phone,
      doctorId: selectedDoctorId,
      doctorName: doc?.name || selectedDoctorName,
      content: newMessage.trim(),
      sender: 'patient'
    };

    // Optimistic UI — add message immediately
    const tempMsg = {
      id: 'temp-' + Date.now(),
      ...payload,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setAllMessages(prev => [...prev, tempMsg]);
    setNewMessage('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        // Refresh from server to get proper ID
        loadData(phone, true);
      }
    } catch (err) {
      alert('Failed to send message. Please try again.');
    }
    setSending(false);
    chatInputRef.current?.focus();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return { bg: '#FEF9C3', color: '#854D0E', border: '#FDE047' };
      case 'Approved': return { bg: '#DCFCE7', color: '#166534', border: '#86EFAC' };
      case 'Completed': return { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' };
      case 'Cancelled': return { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' };
      default: return { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' };
    }
  };

  // Messages for current doctor chat
  const activeMessages = allMessages.filter(m => m.doctorId === selectedDoctorId);

  // Count unread doctor replies across all conversations
  const totalUnreadFromDoctors = allMessages.filter(m => m.sender === 'doctor' && !m.isRead).length;

  // Unread per doctor
  const getUnreadCount = (doctorId) =>
    allMessages.filter(m => m.doctorId === doctorId && m.sender === 'doctor' && !m.isRead).length;

  // Last message per doctor
  const getLastMessage = (doctorId) => {
    const msgs = allMessages.filter(m => m.doctorId === doctorId);
    return msgs.length > 0 ? msgs[msgs.length - 1] : null;
  };

  // Sort doctors: those with chats first
  const chattedDoctorIds = [...new Set(allMessages.map(m => m.doctorId))];
  const sortedDoctors = [...doctors].sort((a, b) => {
    const aHas = chattedDoctorIds.includes(a.id);
    const bHas = chattedDoctorIds.includes(b.id);
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    return 0;
  });

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <main style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--bg-alt)' }}>
        <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 72px)', padding: '2rem' }}>
          <div className={styles.loginCard}>
            <div className={styles.loginHeader}>
              <div className={styles.loginIcon}>🦷</div>
              <h1 className={styles.loginTitle}>Patient Portal</h1>
              <p className={styles.loginSubtitle}>Enter your name and phone number used when booking to see your appointments and chat with your doctor.</p>
            </div>

            <form onSubmit={handleLogin} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label>Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ali Raza"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number (used when booking)</label>
                <input
                  type="tel"
                  placeholder="e.g. 03001234567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              {loginError && (
                <div className={styles.errorMsg}>{loginError}</div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}>
                Access My Portal →
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Haven&apos;t booked yet?{' '}
              <a href="/book-appointment" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Book an Appointment</a>
            </p>
          </div>
        </section>
      </main>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <main style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--bg-alt)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Header */}
        <div className={styles.dashHeader}>
          <div>
            <h1 className={styles.dashTitle}>Welcome, {name}! 👋</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Your personal health portal at NextGenStudio Dental Clinic</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ color: '#dc2626', borderColor: '#fecaca' }}>
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'appointments' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            📅 My Appointments
            {appointments.length > 0 && <span className={styles.tabBadge}>{appointments.length}</span>}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'chat' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 Message Doctor
            {totalUnreadFromDoctors > 0 && (
              <span className={styles.tabBadge} style={{ background: '#16a34a' }}>
                {totalUnreadFromDoctors}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingBox}>
            <div className={styles.spinner}></div>
            <p>Loading your data...</p>
          </div>
        ) : (
          <>
            {/* ── Appointments Tab ── */}
            {activeTab === 'appointments' && (
              <div className={styles.tabContent}>
                {appointments.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div style={{ fontSize: '4rem' }}>📋</div>
                    <h3>No Appointments Found</h3>
                    <p>We couldn&apos;t find any appointments for your phone number. Make sure you entered the same number used during booking.</p>
                    <a href="/book-appointment" className="btn btn-primary" style={{ marginTop: '1rem' }}>Book an Appointment</a>
                  </div>
                ) : appointments.map(apt => {
                  const colors = getStatusColor(apt.status);
                  return (
                    <div key={apt.id} className={styles.aptCard}>
                      <div className={styles.aptCardTop}>
                        <div>
                          <div className={styles.aptDoctor}>Dr. {apt.doctorName?.replace('Dr. ', '')}</div>
                          <div className={styles.aptType}>{apt.type === 'online' ? '💻 Online Consultation' : '🏥 In-Clinic Visit'}</div>
                        </div>
                        <div
                          className={styles.aptStatus}
                          style={{ background: colors.bg, color: colors.color, border: `1px solid ${colors.border}` }}
                        >
                          {apt.status}
                        </div>
                      </div>
                      <div className={styles.aptMeta}>
                        <span>📅 {apt.date}</span>
                        <span>🕐 {apt.time}</span>
                        <span>💊 {apt.reason || 'General Checkup'}</span>
                      </div>
                      {apt.status === 'Approved' && (
                        <div className={styles.aptAction}>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.8rem' }}
                            onClick={() => {
                              setSelectedDoctorId(apt.doctorId);
                              setSelectedDoctorName(apt.doctorName);
                              setActiveTab('chat');
                            }}
                          >
                            💬 Message {apt.doctorName?.split(' ')[1] || 'Doctor'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Chat Tab ── */}
            {activeTab === 'chat' && (
              <div className={styles.chatContainer}>
                {/* Doctor Selector Sidebar */}
                <div className={styles.chatSidebar}>
                  <div className={styles.chatSidebarHeader}>Doctors</div>
                  {sortedDoctors.map(doc => {
                    const unread = getUnreadCount(doc.id);
                    const lastMsg = getLastMessage(doc.id);
                    return (
                      <button
                        key={doc.id}
                        className={`${styles.doctorBtn} ${selectedDoctorId === doc.id ? styles.doctorBtnActive : ''}`}
                        onClick={() => { setSelectedDoctorId(doc.id); setSelectedDoctorName(doc.name); }}
                      >
                        <div className={styles.doctorBtnAvatarWrap}>
                          {doc.photo && (
                            <img
                              src={doc.photo}
                              alt={doc.name}
                              className={styles.doctorBtnPhoto}
                            />
                          )}
                          {!doc.photo && (
                            <div className={styles.doctorBtnAvatar}>
                              {doc.name.split(' ').slice(-1)[0]?.[0] || 'D'}
                            </div>
                          )}
                          {unread > 0 && (
                            <span className={styles.unreadBadge}>{unread}</span>
                          )}
                        </div>
                        <div className={styles.doctorBtnInfo}>
                          <span className={styles.doctorBtnName}>{doc.name}</span>
                          <span className={styles.doctorBtnSpec}>
                            {lastMsg
                              ? (lastMsg.content.length > 26 ? lastMsg.content.slice(0, 26) + '…' : lastMsg.content)
                              : doc.specialization.split('—')[0].trim()
                            }
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Chat Area */}
                <div className={styles.chatArea}>
                  {!selectedDoctorId ? (
                    <div className={styles.chatEmpty}>
                      <div style={{ fontSize: '3.5rem' }}>💬</div>
                      <h3 style={{ margin: '0.5rem 0 0.25rem', color: 'var(--secondary-dark)' }}>Select a Doctor</h3>
                      <p>Choose a doctor from the left panel to start a conversation</p>
                    </div>
                  ) : (() => {
                    const doc = doctors.find(d => d.id === selectedDoctorId);
                    return (
                      <>
                        {/* Chat Header */}
                        <div className={styles.chatHeader}>
                          <div className={styles.chatHeaderAvatarWrap}>
                            {doc?.photo ? (
                              <img
                                src={doc.photo}
                                alt={selectedDoctorName}
                                className={styles.chatHeaderPhoto}
                              />
                            ) : (
                              <div className={styles.chatHeaderAvatar}>
                                {selectedDoctorName.split(' ').slice(-1)[0]?.[0] || 'D'}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className={styles.chatHeaderName}>{selectedDoctorName}</div>
                            <div className={styles.chatHeaderStatus}>
                              <span className={styles.onlineDot}></span>
                              {doc?.specialization?.split('—')[0]?.trim() || 'Specialist'}
                            </div>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className={styles.messages}>
                          {activeMessages.length === 0 ? (
                            <div className={styles.chatEmpty}>
                              <div style={{ fontSize: '3rem' }}>👋</div>
                              <h3 style={{ margin: '0.5rem 0 0.25rem', color: 'var(--secondary-dark)' }}>Say Hello!</h3>
                              <p>Send your first message to {selectedDoctorName}. Replies arrive during clinic hours.</p>
                            </div>
                          ) : activeMessages.map(msg => (
                            <div
                              key={msg.id}
                              className={`${styles.bubble} ${msg.sender === 'patient' ? styles.bubbleRight : styles.bubbleLeft}`}
                            >
                              <div className={styles.bubbleContent}>{msg.content}</div>
                              <div className={styles.bubbleTime}>
                                {new Date(msg.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                                {msg.sender === 'patient' ? ' · You' : ' · Doctor'}
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form className={styles.chatInputArea} onSubmit={handleSendMessage}>
                          <input
                            ref={chatInputRef}
                            type="text"
                            placeholder={`Message ${selectedDoctorName}...`}
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            className={styles.chatInput}
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={sending || !newMessage.trim()}
                            style={{ flexShrink: 0 }}
                          >
                            {sending ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></span>
                              </span>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                              </svg>
                            )}
                          </button>
                        </form>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
