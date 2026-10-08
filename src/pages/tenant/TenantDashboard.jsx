import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  CreditCard, 
  Search, 
  ArrowRight, 
  Building2, 
  XCircle, 
  Bell 
} from 'lucide-react';

export const TenantDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, requestsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/bookings')
      ]);
      setStats(statsRes.data);
      setRecentRequests(requestsRes.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to load tenant dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this pending rental request?')) return;
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel request');
    }
  };

  const formatRent = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>Tenant Portal</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{user?.name}</p>
        </div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/tenant/dashboard" className="sidebar-link active">
              <Building2 size={18} />
              <span>Overview</span>
            </Link>
          </li>
          <li>
            <Link to="/tenant/requests" className="sidebar-link">
              <FileText size={18} />
              <span>My Rental Requests</span>
            </Link>
          </li>
          <li>
            <Link to="/tenant/bookings" className="sidebar-link">
              <CheckCircle size={18} />
              <span>My Confirmed Rentals</span>
            </Link>
          </li>
          <li>
            <Link to="/tenant/notifications" className="sidebar-link">
              <Bell size={18} />
              <span>Notifications</span>
            </Link>
          </li>
          <li>
            <Link to="/tenant/profile" className="sidebar-link">
              <CreditCard size={18} />
              <span>My Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/properties" className="sidebar-link" style={{ marginTop: '1.5rem', color: '#1e3a8a', fontWeight: '600' }}>
              <Search size={18} />
              <span>Browse Properties</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Panel */}
      <main className="dashboard-main">
        {/* Welcome Banner */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', color: '#fff', marginBottom: '2rem', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ opacity: 0.9, maxWidth: '600px', fontSize: '0.95rem' }}>
            Track the status of your rental applications, proceed with payments for approved properties, and manage your lease documents here.
          </p>
          <div style={{ marginTop: '1.25rem' }}>
            <Link to="/properties" className="btn btn-secondary btn-sm" style={{ background: '#fff', color: '#1e3a8a', border: 'none' }}>
              <Search size={15} />
              <span>Search Available Properties</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#eff6ff', color: '#1e3a8a' }}>
              <FileText size={24} />
            </div>
            <div>
              <div className="stat-value">{stats?.totalBookings || 0}</div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="stat-value">{stats?.pendingRequests || 0}</div>
              <div className="stat-label">Pending Approval</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="stat-value">{stats?.approvedRentals || 0}</div>
              <div className="stat-label">Approved (Awaiting Pay)</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <div className="stat-value">{stats?.completedRentals || 0}</div>
              <div className="stat-label">Active / Confirmed</div>
            </div>
          </div>
        </div>

        {/* Recent Requests Section */}
        <div className="card" style={{ background: '#fff' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>Recent Rental Applications</h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>View latest updates from property landlords</p>
            </div>
            <Link to="/tenant/requests" className="btn btn-secondary btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
              <Building2 size={40} color="#cbd5e1" style={{ margin: '0 auto 0.75rem' }} />
              <p>You haven't submitted any rental requests yet.</p>
              <Link to="/properties" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                Find Properties to Rent
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>City</th>
                    <th>Monthly Rent</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <Link to={`/properties/${req.propertyId}`} style={{ fontWeight: '600', color: '#1e3a8a' }}>
                          {req.propertyTitle}
                        </Link>
                      </td>
                      <td>{req.propertyCity}</td>
                      <td style={{ fontWeight: '600' }}>{formatRent(req.monthlyRent)}</td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {req.startDate} to {req.endDate}
                      </td>
                      <td>
                        <span className={`badge status-${req.status}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {req.status === 'APPROVED' && !req.paid && (
                            <Link to={`/tenant/payment/${req.id}`} className="btn btn-success btn-sm">
                              Pay Rent
                            </Link>
                          )}
                          {req.status === 'COMPLETED' && (
                            <Link to="/tenant/bookings" className="btn btn-secondary btn-sm">
                              Receipt
                            </Link>
                          )}
                          {req.status === 'PENDING' && (
                            <button
                              onClick={() => handleCancelRequest(req.id)}
                              className="btn btn-outline-danger btn-sm"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
