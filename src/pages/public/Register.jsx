import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('ROLE_TENANT');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await register({
        name,
        email: email.trim(),
        phone: phone.trim(),
        password,
        role,
      });

      if (newUser.role === 'ROLE_OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/tenant/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem', background: '#f8fafc', minHeight: 'calc(100vh - 140px)' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card" style={{ background: '#fff', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Create an Account</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Join PropertyRental to find your next home or list your properties
            </p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account Type Selection */}
            <div className="form-group">
              <label className="form-label">I want to register as:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div
                  onClick={() => setRole('ROLE_TENANT')}
                  style={{
                    padding: '0.85rem',
                    border: `2px solid ${role === 'ROLE_TENANT' ? '#1e3a8a' : '#e2e8f0'}`,
                    backgroundColor: role === 'ROLE_TENANT' ? '#eff6ff' : '#fff',
                    borderRadius: '8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: role === 'ROLE_TENANT' ? '#1e3a8a' : '#475569'
                  }}
                >
                  Tenant (Rent Homes)
                </div>

                <div
                  onClick={() => setRole('ROLE_OWNER')}
                  style={{
                    padding: '0.85rem',
                    border: `2px solid ${role === 'ROLE_OWNER' ? '#1e3a8a' : '#e2e8f0'}`,
                    backgroundColor: role === 'ROLE_OWNER' ? '#eff6ff' : '#fff',
                    borderRadius: '8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: role === 'ROLE_OWNER' ? '#1e3a8a' : '#475569'
                  }}
                >
                  Property Owner (Landlord)
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Ramesh Reddy"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="form-control"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ marginTop: '0.75rem' }}>
              <UserPlus size={18} />
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1e3a8a', fontWeight: '600' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
