'use client';
import { useState, useEffect, useRef } from 'react';
import styles from '../admin.module.css';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Chat state
  const [activeSession, setActiveSession] = useState(null); // { patientPhone, doctorId, patientName }
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch('/api/messages')
      .then(r => r.json())
      .then(data => {
        setMessages(data.messages || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeSession]);

  // Group messages by session (patientPhone + doctorId)
  const sessionsMap = new Map();
  messages.forEach(msg => {
    const key = `${msg.patientPhone}-${msg.doctorId}`;
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
    if (!msg.isRead && msg.sender === 'patient') {
      session.unreadCount++;
    }
    if (new Date(msg.createdAt) > new Date(session.lastMessageAt)) {
      session.lastMessageAt = msg.createdAt;
    }
  });

  const sessions = Array.from(sessionsMap.values()).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

  const handleSelectSession = async (session) => {
    setActiveSession(session);
    
    // Mark messages as read
    const unreadMsgs = session.messages.filter(m => !m.isRead && m.sender === 'patient');
    for (const msg of unreadMsgs) {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: msg.id })
      });
    }
    if (unreadMsgs.length > 0) {
      fetchMessages();
    }
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
      sender: 'doctor' // Admin replies as doctor
    };

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setReplyContent('');
        fetchMessages();
      }
    } catch (err) {
      alert('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading messages...</div>;
  }

  return (
    <div className={styles.card} style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.cardHeader} style={{ flexShrink: 0 }}>
        <h2 className={styles.cardTitle}>Patient Messages</h2>
      </div>
      
      <div className={styles.messagesLayout}>
        
        {/* Sidebar: Sessions List */}
        <div className={styles.messagesSidebar}>
          {sessions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No conversations yet</div>
          ) : sessions.map(session => (
            <div 
              key={`${session.patientPhone}-${session.doctorId}`}
              onClick={() => handleSelectSession(session)}
              style={{
                padding: '1rem',
                borderBottom: '1px solid var(--border-color)',
                cursor: 'pointer',
                backgroundColor: activeSession?.patientPhone === session.patientPhone && activeSession?.doctorId === session.doctorId 
                  ? 'var(--primary-light)' 
                  : session.unreadCount > 0 ? '#F0F9FF' : 'transparent',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                <strong style={{ color: 'var(--secondary-dark)' }}>{session.patientName}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(session.lastMessageAt).toLocaleDateString()}
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                To: {session.doctorName}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {session.messages[session.messages.length - 1].content}
                </span>
                {session.unreadCount > 0 && (
                  <span style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '99px', padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                    {session.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Chat Area */}
        <div className={styles.messagesMain}>
          {activeSession ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--secondary-dark)' }}>{activeSession.patientName}</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Phone: {activeSession.patientPhone} | Messaging: {activeSession.doctorName}
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeSession.messages.map(msg => {
                  const isDoctor = msg.sender === 'doctor';
                  return (
                    <div key={msg.id} style={{ 
                      alignSelf: isDoctor ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}>
                      <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        backgroundColor: isDoctor ? 'var(--primary-dark)' : 'white',
                        color: isDoctor ? 'white' : 'var(--text-main)',
                        border: isDoctor ? 'none' : '1px solid var(--border-color)',
                        borderBottomRightRadius: isDoctor ? '4px' : '12px',
                        borderBottomLeftRadius: isDoctor ? '12px' : '4px',
                      }}>
                        {msg.content}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', alignSelf: isDoctor ? 'flex-end' : 'flex-start' }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${activeSession.patientName}...`}
                    style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={sending || !replyContent.trim()}>
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
