import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bell, CheckCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Notifications</h1>
            <p style={{ color: '#64748b' }}>Stay updated on rental requests, landlord approvals, and payment receipts</p>
          </div>

          {notifications.some(n => !n.read) && (
            <button onClick={handleMarkAllAsRead} className="btn btn-secondary btn-sm">
              <CheckCheck size={16} />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        <div className="card" style={{ background: '#fff', padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="flex-center" style={{ minHeight: '250px' }}>
              <div className="spinner"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
              <Bell size={40} color="#cbd5e1" style={{ margin: '0 auto 0.75rem' }} />
              <p>You have no notifications at this time.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: n.read ? '#fff' : '#f0f9ff',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: n.read ? '#f1f5f9' : '#dbeafe',
                      color: n.read ? '#64748b' : '#1e3a8a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Bell size={18} />
                    </div>

                    <div>
                      <p style={{ color: n.read ? '#475569' : '#0f172a', fontWeight: n.read ? '400' : '600', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {n.message}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                        <Clock size={12} />
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', flexShrink: 0 }}
                      title="Mark as read"
                    >
                      Dismiss
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
