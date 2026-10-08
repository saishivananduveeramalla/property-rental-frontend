import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Building2, 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  MessageSquare, 
  ArrowRight, 
  FileText, 
  User, 
  Bell 
} from 'lucide-react';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/bookings')
      ]);
      setStats(statsRes.data);
      // Filter pending requests for this owner
      const pending = bookingsRes.data.filter((b) => b.status === 'PENDING').slice(0, 5);
      setPendingRequests(pending);
    } catch (err) {
      console.error('Failed to load owner dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/bookings/${id}/approve`);
      fetchOwnerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to decline this rental request?')) return;
    try {
      await api.put(`/bookings/${id}/reject`);
      fetchOwnerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject request');
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>Landlord Portal</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{user?.name}</p>
        </div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/owner/dashboard" className="sidebar-link active">
              <Building2 size={18} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/owner/properties" className="sidebar-link">
              <Building2 size={18} />
              <span>My Properties</span>
            </Link>
          </li>
          <li>
            <Link to="/owner/properties/add" className="sidebar-link">
              <PlusCircle size={18} />
              <span>Add New Property</span>
            </Link>
          </li>
          <li>
            <Link to="/owner/requests" className="sidebar-link">
              <FileText size={18} />
              <span>Rental Requests</span>
            </Link>
          </li>
          <li>
            <Link to="/owner/history" className="sidebar-link">
              <CheckCircle size={18} />
              <span>Rental History</span>
            </Link>
          </li>
          <li>
            <Link to="/owner/messages" className="sidebar-link">
              <MessageSquare size={18} />
              <span>Tenant Inquiries</span>
            </Link>
          </li>
          <li>
            <Link to="/owner/profile" className="sidebar-link">
              <User size={18} />
              <span>Owner Profile</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Panel */}
      <main className="dashboard-main">
        {/* Header Banner */}
        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              Welcome, {user?.name}
            </h1>
            <p style={{ color: '#64748b' }}>Overview of your listed properties, incoming requests, and rental income</p>
          </div>

          <Link to="/owner/properties/add" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>List New Property</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#eff6ff', color: '#1e3a8a' }}>
              <Building2 size={24} />
            </div>
            <div>
              <div className="stat-value">{stats?.totalProperties || 0}</div>
              <div className="stat-label">Total Properties</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="stat-value">{stats?.availableProperties || 0}</div>
              <div className="stat-label">Available for Rent</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="stat-value">{stats?.pendingRequests || 0}</div>
              <div className="stat-label">Pending Requests</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#eff6ff', color: '#0d9488' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div className="stat-value">{formatRent(stats?.totalRevenue || 0)}</div>
              <div className="stat-label">Confirmed Revenue</div>
            </div>
          </div>
        </div>

        {/* Actionable Pending Rental Requests */}
        <div className="card" style={{ background: '#fff', marginBottom: '2rem' }}>
          <div className="flex-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
                Pending Rental Requests ({pendingRequests.length})
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Tenants waiting for your approval to rent your property</p>
            </div>
            <Link to="/owner/requests" className="btn btn-secondary btn-sm">
              <span>View All Requests</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {pendingRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
              <CheckCircle size={40} color="#cbd5e1" style={{ margin: '0 auto 0.75rem' }} />
              <p>No pending rental requests at this moment.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Applicant / Tenant</th>
                    <th>Requested Dates</th>
                    <th>Monthly Rent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <Link to={`/properties/${req.propertyId}`} style={{ fontWeight: '600', color: '#1e3a8a' }}>
                          {req.propertyTitle}
                        </Link>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{req.propertyCity}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: '600' }}>{req.tenantName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{req.tenantEmail} • {req.tenantPhone}</div>
                        {req.notes && (
                          <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#475569', marginTop: '0.2rem' }}>
                            "{req.notes}"
                          </div>
                        )}
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>
                        <div>{req.startDate} to {req.endDate}</div>
                        <div style={{ color: '#64748b' }}>Applied on {new Date(req.createdAt).toLocaleDateString()}</div>
                      </td>

                      <td style={{ fontWeight: '700', color: '#1e3a8a' }}>
                        {formatRent(req.monthlyRent)}
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="btn btn-success btn-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            Reject
                          </button>
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
