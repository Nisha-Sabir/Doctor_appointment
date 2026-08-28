'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './doctor-messages.module.css';

export default function DoctorMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  
  const [activeSession, setActiveSession] = useState(null); 
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const replyInputRef = useRef(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    fetchWhoAmI();
    return () => clearInterval(pollingRef.current);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeSession]);

  async function fetchWhoAmI() {
    const res = await fetch('/api/doctor-whoami');
    if (res.ok) {
      const data = await res.json();
      setDoctorId(data.doctorId);
      fetchMessages(data.doctorId);
      pollingRef.current = setInterval(() => fetchMessages(data.doctorId, true), 6000);
    } else {
      window.location.assign('/doctor/login');
    }
  };

  const fetchMessages = async (dId, silent = false) => {
    try {
      const res = await fetch(`/api/messages?doctorId=${dId}`);
      const data = await res.json();
      const msgs = data.messages || [];
      setMessages(msgs);
      if (activeSession) {
        setActiveSession(prev => {
          if (!prev) return prev;
          const updated = msgs.filter(m => m.patientPhone === prev.patientPhone);
          return { ...prev, messages: updated };
        });
      }
    } catch {}
    if (!silent) setLoading(false);
  };

  const sessionsMap = new Map();
  messages.forEach(msg => {
    const key = msg.patientPhone;
    if (!sessionsMap.has(key)) {
      sessionsMap.set(key, {
        patientName: msg.patientName,
        patientPhone: msg.patientPhone,
        doctorId: msg.doctorId,
        doctorName: msg.doctorName,
        messages: [],
        unreadCount: 0,
        lastMessageAt: msg.createdAt
      });
    }
    const session = sessionsMap.get(key);
    session.messages.push(msg);
    if (!msg.isRead && msg.sender === 'patient') session.unreadCount++;
    if (new Date(msg.createdAt) > new Date(session.lastMessageAt)) {
      session.lastMessageAt = msg.createdAt;
    }
  });

  const sessions = Array.from(sessionsMap.values())
    .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

  const totalUnread = sessions.reduce((sum, s) => sum + s.unreadCount, 0);

  const handleSelectSession = async (session) => {
    setActiveSession(session);
    setTimeout(() => replyInputRef.current?.focus(), 100);
    const unreadMsgs = session.messages.filter(m => !m.isRead && m.sender === 'patient');
    for (const msg of unreadMsgs) {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: msg.id })
      });
    }
    if (unreadMsgs.length > 0) fetchMessages(doctorId, true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !activeSession) return;
    setSending(true);

    const payload = {
      patientName: activeSession.patientName,
      patientPhone: activeSession.patientPhone,
      doctorId: activeSession.doctorId,
      doctorName: activeSession.doctorName,
      content: replyContent.trim(),
      sender: 'doctor'
    };

    // eslint-disable-next-line react-hooks/purity
    const tempMsg = { id: 'temp-' + Date.now(), ...payload, isRead: true, createdAt: new Date().toISOString() };
    setActiveSession(prev => ({ ...prev, messages: [...prev.messages, tempMsg] }));
    setReplyContent('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) fetchMessages(doctorId, true);
    } catch {
      alert('Failed to send reply');
    } finally {
      setSending(false);
      replyInputRef.current?.focus();
    }
  };

  const getInitials = (name) => {
    const parts = name?.split(' ') || [];
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return (name?.[0] || '?').toUpperCase();
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString())
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className={styles.chatPage}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHead}>
          <h2 className={styles.sidebarTitle}>
            Messages
            {totalUnread > 0 && <span className={styles.totalUnread}>{totalUnread}</span>}
          </h2>
          <p className={styles.sidebarSub}>{sessions.length} conversation{sessions.length !== 1 ? 's' : ''}</p>
        </div>

        <div className={styles.sessionList}>
          {sessions.length === 0 ? (
            <div className={styles.emptyState}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>💬</div>
              <p>No patient messages yet.<br />Messages will appear here when patients contact you.</p>
            </div>
          ) : sessions.map(session => (
            <button
              key={session.patientPhone}
              className={`${styles.sessionItem} ${activeSession?.patientPhone === session.patientPhone ? styles.sessionItemActive : ''}`}
              onClick={() => handleSelectSession(session)}
            >
              <div className={`${styles.patientAvatar} ${session.unreadCount > 0 ? styles.patientAvatarUnread : ''}`}>
                {getInitials(session.patientName)}
              </div>
              <div className={styles.sessionInfo}>
                <div className={styles.sessionTopRow}>
                  <span className={styles.patientNameText}>{session.patientName}</span>
                  <span className={styles.sessionTime}>{formatTime(session.lastMessageAt)}</span>
                </div>
                <div className={styles.sessionBottomRow}>
                  <span className={styles.lastMsg}>
                    {session.messages[session.messages.length - 1]?.sender === 'doctor' && (
                      <span className={styles.youLabel}>You: </span>
                    )}
                    {(session.messages[session.messages.length - 1]?.content || '').slice(0, 32)}
                    {(session.messages[session.messages.length - 1]?.content || '').length > 32 ? '…' : ''}
                  </span>
                  {session.unreadCount > 0 && (
                    <span className={styles.unreadBadge}>{session.unreadCount}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        {!activeSession ? (
          <div className={styles.noChatSelected}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
            <h3>Select a Conversation</h3>
            <p>Choose a patient from the left to view and reply to their messages.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderAvatar}>
                {getInitials(activeSession.patientName)}
              </div>
              <div className={styles.chatHeaderInfo}>
                <div className={styles.chatHeaderName}>{activeSession.patientName}</div>
                <div className={styles.chatHeaderSub}>📞 {activeSession.patientPhone}</div>
              </div>
              <span className={styles.chatHeaderBadge}>Patient</span>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
              {activeSession.messages.map(msg => {
                const isDoctor = msg.sender === 'doctor';
                return (
                  <div
                    key={msg.id}
                    className={`${styles.msgRow} ${isDoctor ? styles.msgRowDoctor : styles.msgRowPatient}`}
                  >
                    {!isDoctor && (
                      <div className={styles.msgAvatar}>{getInitials(activeSession.patientName)}</div>
                    )}
                    <div className={styles.msgBubbleWrap}>
                      <div className={`${styles.msgBubble} ${isDoctor ? styles.msgBubbleDoctor : styles.msgBubblePatient}`}>
                        {msg.content}
                      </div>
                      <div className={`${styles.msgTime} ${isDoctor ? styles.msgTimeRight : ''}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isDoctor && ' · You'}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <form className={styles.replyArea} onSubmit={handleSendReply}>
              <input
                ref={replyInputRef}
                type="text"
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder={`Reply to ${activeSession.patientName}...`}
                className={styles.replyInput}
              />
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={sending || !replyContent.trim()}
              >
                {sending ? (
                  <span className={styles.sendSpinner}></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
