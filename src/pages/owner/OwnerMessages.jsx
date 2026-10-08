import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { MessageSquare, ArrowLeft, Send, CheckCircle2, Clock, User, Building2 } from 'lucide-react';

export const OwnerMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/messages/received');
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (messageId) => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const res = await api.put(`/messages/${messageId}/reply`, { reply: replyText });
      setMessages(messages.map(m => m.id === messageId ? res.data : m));
      setActiveReplyId(null);
      setReplyText('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/owner/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Tenant Inquiries & Messages</h1>
          <p style={{ color: '#64748b' }}>Respond directly to prospective tenants interested in your properties</p>
        </div>

        {loading ? (
          <div className="flex-center" style={{ minHeight: '300px' }}>
            <div className="spinner"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 1rem', background: '#fff' }}>
            <MessageSquare size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No messages received yet</h3>
            <p style={{ color: '#64748b' }}>When tenants contact you from your property details pages, their messages will arrive here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {messages.map((msg) => (
              <div key={msg.id} className="card" style={{ background: '#fff' }}>
                <div className="flex-between" style={{ marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#eff6ff', color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                      {msg.senderName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{msg.senderName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{msg.senderEmail} • {msg.senderPhone}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                    <Clock size={13} />
                    <span>{new Date(msg.sentAt).toLocaleString()}</span>
                  </div>
                </div>

                {msg.propertyTitle && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#f8fafc', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.85rem', color: '#1e3a8a', fontWeight: '600', marginBottom: '0.75rem' }}>
                    <Building2 size={14} />
                    <span>Property: {msg.propertyTitle}</span>
                  </div>
                )}

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  "{msg.message}"
                </div>

                {/* Reply section */}
                {msg.reply ? (
                  <div style={{ background: '#ecfdf5', borderLeft: '4px solid #10b981', padding: '0.85rem 1rem', borderRadius: '0 8px 8px 0', fontSize: '0.9rem' }}>
                    <div style={{ fontWeight: '700', color: '#065f46', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={14} />
                      <span>Your Reply:</span>
                    </div>
                    <p style={{ color: '#047857' }}>{msg.reply}</p>
                    {msg.repliedAt && (
                      <span style={{ fontSize: '0.75rem', color: '#6ee7b7', display: 'block', marginTop: '0.3rem' }}>
                        Replied on {new Date(msg.repliedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                ) : activeReplyId === msg.id ? (
                  <div style={{ marginTop: '0.75rem' }}>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="Type your reply to the tenant..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      style={{ marginBottom: '0.75rem' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => { setActiveReplyId(null); setReplyText(''); }}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendReply(msg.id)}
                        disabled={submittingReply || !replyText.trim()}
                        className="btn btn-primary btn-sm"
                      >
                        <Send size={14} />
                        <span>{submittingReply ? 'Sending...' : 'Send Reply'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => { setActiveReplyId(msg.id); setReplyText(''); }}
                      className="btn btn-secondary btn-sm"
                    >
                      <MessageSquare size={14} />
                      <span>Reply to Tenant</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
