import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FileText, ArrowLeft, CheckCircle, XCircle, Search, Calendar } from 'lucide-react';

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/bookings/${id}/approve`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve booking');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this request?')) return;
    try {
      await api.put(`/bookings/${id}/reject`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject booking');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const formatRent = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const filtered = bookings.filter((b) => {
    const matchesFilter = statusFilter === 'ALL' || b.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesTerm = (
      b.propertyTitle.toLowerCase().includes(term) ||
      b.tenantName.toLowerCase().includes(term) ||
      b.ownerName.toLowerCase().includes(term)
    );
    return matchesFilter && matchesTerm;
  });

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <ArrowLeft size={16} />
              <span>Back to Admin Dashboard</span>
            </Link>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>System Bookings & Requests</h1>
            <p style={{ color: '#64748b' }}>Audit and manage all rental applications and lease agreements</p>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search property, tenant, owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.2rem', minWidth: '240px' }}
            />
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`btn btn-sm ${statusFilter === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px' }}
            >
              {tab === 'ALL' ? 'All Bookings' : tab}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="card" style={{ background: '#fff' }}>
          {loading ? (
            <div className="flex-center" style={{ minHeight: '300px' }}>
              <div className="spinner"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
              <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>No bookings found</h3>
              <p>No records match your filter criteria.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Property</th>
                    <th>Tenant</th>
                    <th>Landlord</th>
                    <th>Rental Term</th>
                    <th>Total Value</th>
                    <th>Status</th>
                    <th>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: '600', color: '#64748b' }}>#{b.id}</td>

                      <td>
                        <Link to={`/properties/${b.propertyId}`} style={{ fontWeight: '700', color: '#1e3a8a' }}>
                          {b.propertyTitle}
                        </Link>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.propertyCity}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{b.tenantName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.tenantEmail}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{b.ownerName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.ownerEmail}</div>
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>
                        <div>{b.startDate} to {b.endDate}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Applied {new Date(b.createdAt).toLocaleDateString()}</div>
                      </td>

                      <td style={{ fontWeight: '700', color: '#1e3a8a' }}>
                        {formatRent(b.totalAmount)}
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '400' }}>({formatRent(b.monthlyRent)}/mo)</div>
                      </td>

                      <td>
                        <span className={`badge status-${b.status}`}>
                          {b.status}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {b.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(b.id)}
                                className="btn btn-success btn-sm"
                                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(b.id)}
                                className="btn btn-outline-danger btn-sm"
                                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {b.status === 'APPROVED' && (
                            <button
                              onClick={() => handleCancel(b.id)}
                              className="btn btn-outline-danger btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                            >
                              Cancel
                            </button>
                          )}
                          {b.status === 'COMPLETED' && (
                            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>Verified Paid</span>
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
      </div>
    </div>
  );
};
