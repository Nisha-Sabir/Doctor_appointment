'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './messages.module.css';

import { Suspense } from 'react';

function MessagesContent() {
  const searchParams = useSearchParams();
  const preselectedDoctor = searchParams.get('doctor') || '';
  const preselectedDoctorName = searchParams.get('doctorName') || '';

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(preselectedDoctor);
  const [selectedDoctorName, setSelectedDoctorName] = useState(preselectedDoctorName);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch('/api/doctors').then(r => r.json()).then(data => setDoctors(data.doctors || []));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startSession = () => {
    if (!patientName.trim() || !patientPhone.trim() || !selectedDoctor) return;
    setSessionStarted(true);
    loadMessages();
  };

  const loadMessages = async () => {
    if (!patientPhone || !selectedDoctor) return;
    const res = await fetch(`/api/messages?patientPhone=${patientPhone}&doctorId=${selectedDoctor}`);
    const data = await res.json();
    setMessages(data.messages || []);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionStarted) return;
    setIsLoading(true);

    const payload = {
      patientName,
      patientPhone,
      doctorId: selectedDoctor,
      doctorName: selectedDoctorName,
      content: newMessage.trim(),
      sender: 'patient'
    };

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      setMessages(prev => [...prev, data.message]);
      setNewMessage('');
    }
    setIsLoading(false);
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctorId);
    const doc = doctors.find(d => d.id === doctorId);
    setSelectedDoctorName(doc ? doc.name : '');
  };

  return (
    <main style={{ paddingTop: '72px' }}>
      <section className={styles.messagesSection}>
        <div className="container">
          <div className={styles.pageHeader}>
            <div className={styles.headerTag}>Connect</div>
            <h1>Message a Doctor</h1>
            <p>Send a message directly to any of our specialist dentists. We typically respond within a few hours.</p>
          </div>

          <div className={styles.chatContainer}>
            {/* Sidebar: Doctor List */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarHeader}>
                <h3>Our Doctors</h3>
              </div>
              <div className={styles.doctorList}>
                {doctors.map(doc => (
                  <button
                    key={doc.id}
                    className={`${styles.doctorItem} ${selectedDoctor === doc.id ? styles.doctorItemActive : ''}`}
                    onClick={() => {
                      setSelectedDoctor(doc.id);
                      setSelectedDoctorName(doc.name);
                    }}
                  >
                    <img src={doc.photo} alt={doc.name} className={styles.docAvatar} />
                    <div className={styles.docInfo}>
                      <span className={styles.docName}>{doc.name}</span>
                      <span className={styles.docSpec}>{doc.specialization.split('—')[0].trim()}</span>
                    </div>
                    <div className={styles.onlineDot}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className={styles.chatArea}>
              {!sessionStarted ? (
                /* Login / Start Session */
                <div className={styles.startSession}>
                  <div className={styles.startSessionIcon}>💬</div>
                  <h2>Start a Conversation</h2>
                  <p>Enter your details to start messaging with {selectedDoctorName || 'a doctor'}.</p>
                  
                  <div className={styles.sessionForm}>
                    <div className={styles.formGroup}>
                      <label>Select Doctor *</label>
                      <select value={selectedDoctor} onChange={handleDoctorChange} className={styles.input}>
                        <option value="">-- Select a Doctor --</option>
                        {doctors.map(d => (
                          <option key={d.id} value={d.id}>{d.name} — {d.specialization.split('—')[0].trim()}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Your Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Ali Raza"
                        value={patientName}
                        onChange={e => setPatientName(e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Your Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="e.g. 03001234567"
                        value={patientPhone}
                        onChange={e => setPatientPhone(e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={startSession}
                      disabled={!patientName || !patientPhone || !selectedDoctor}
                    >
                      Start Conversation →
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Chat */
                <>
                  {/* Chat Header */}
                  <div className={styles.chatHeader}>
                    {doctors.find(d => d.id === selectedDoctor) && (
                      <>
                        <img
                          src={doctors.find(d => d.id === selectedDoctor)?.photo}
                          alt={selectedDoctorName}
                          className={styles.chatHeaderAvatar}
                        />
                        <div>
                          <div className={styles.chatHeaderName}>{selectedDoctorName}</div>
                          <div className={styles.chatHeaderStatus}>
                            <span className={styles.onlineDot}></span> Online · Typically replies in a few hours
                          </div>
                        </div>
                      </>
                    )}
                    <button
                      className={styles.endSession}
                      onClick={() => setSessionStarted(false)}
                    >
                      ✕ End
                    </button>
                  </div>

                  {/* Messages */}
                  <div className={styles.messages}>
                    {messages.length === 0 && (
                      <div className={styles.emptyMessages}>
                        <div style={{ fontSize: '3rem' }}>💬</div>
                        <p>No messages yet. Say hello to {selectedDoctorName}!</p>
                      </div>
                    )}
                    {messages.map(msg => (
                      <div key={msg.id} className={`${styles.bubble} ${msg.sender === 'patient' ? styles.bubbleRight : styles.bubbleLeft}`}>
                        <div className={styles.bubbleContent}>{msg.content}</div>
                        <div className={styles.bubbleTime}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form className={styles.messageInput} onSubmit={sendMessage}>
                    <input
                      type="text"
                      placeholder={`Message ${selectedDoctorName}...`}
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      className={styles.messageInputField}
                    />
                    <button type="submit" className={`btn btn-primary ${styles.sendBtn}`} disabled={isLoading || !newMessage.trim()}>
                      {isLoading ? '...' : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div style={{padding: '4rem', textAlign: 'center'}}>Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
