import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Building2, LogIn, AlertCircle, Shield, User, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  const from = location.state?.from?.pathname || null;

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await api.get('/properties/available');
      setBackendStatus('online');
    } catch (err) {
      if (!err.response) {
        setBackendStatus('offline');
      } else {
        setBackendStatus('online');
      }
    }
  };

  const executeLogin = async (loginEmail, loginPassword) => {
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(loginEmail.trim(), loginPassword);
      const destination = (from && from !== '/login') ? from : (
        loggedUser.role === 'ROLE_ADMIN' ? '/admin/dashboard' :
        loggedUser.role === 'ROLE_OWNER' ? '/owner/dashboard' :
        '/tenant/dashboard'
      );
      navigate(destination, { replace: true });
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to the Backend server. Please make sure the Spring Boot backend is running on port 8081.');
        setBackendStatus('offline');
      } else {
        setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    executeLogin(demoEmail, demoPassword);
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem', background: '#f8fafc', minHeight: 'calc(100vh - 140px)' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card" style={{ background: '#fff', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              background: '#eff6ff',
              color: '#1e3a8a',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Building2 size={28} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Sign In to Account</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Access your personalized property rental dashboard
            </p>

            {/* Backend connection indicator */}
            <div style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '12px', background: backendStatus === 'online' ? '#ecfdf5' : backendStatus === 'offline' ? '#fef2f2' : '#f1f5f9', color: backendStatus === 'online' ? '#047857' : backendStatus === 'offline' ? '#b91c1c' : '#64748b' }}>
              {backendStatus === 'online' && <CheckCircle2 size={13} />}
              {backendStatus === 'offline' && <AlertCircle size={13} />}
              {backendStatus === 'checking' && <RefreshCw size={13} className="spin" />}
              <span>Backend API: {backendStatus === 'online' ? 'Online (Port 8081)' : backendStatus === 'offline' ? 'Offline (Start backend)' : 'Checking...'}</span>
            </div>
          </div>

          {backendStatus === 'offline' && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Backend server is not running:</strong>
                <div style={{ marginTop: '0.25rem' }}>
                  Please run <code>start-all.bat</code> in the project folder or execute <code>mvn spring-boot:run</code> in the <code>backend/</code> folder.
                </div>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ marginTop: '0.5rem' }}>
              <LogIn size={18} />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* 1-Click Demo Accounts for Viva / Faculty Evaluation */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.85rem' }}>
              <KeyRound size={16} color="#d97706" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#b45309' }}>
                1-Click Demo Login (Instant Access)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('admin@propertyrental.com', 'admin123')}
                className="btn btn-secondary btn-sm"
                title="admin@propertyrental.com / admin123"
              >
                <Shield size={14} color="#1e3a8a" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('rajesh.owner@example.com', 'owner123')}
                className="btn btn-secondary btn-sm"
                title="rajesh.owner@example.com / owner123"
              >
                <Building2 size={14} color="#0d9488" />
                <span>Owner</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('rahul.tenant@example.com', 'tenant123')}
                className="btn btn-secondary btn-sm"
                title="rahul.tenant@example.com / tenant123"
              >
                <User size={14} color="#3b82f6" />
                <span>Tenant</span>
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1e3a8a', fontWeight: '600' }}>
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
