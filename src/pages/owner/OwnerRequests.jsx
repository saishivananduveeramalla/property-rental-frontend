import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FileText, CheckCircle, XCircle, ArrowLeft, Clock, Phone, Mail, Building2 } from 'lucide-react';

export const OwnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to load rental requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/bookings/${id}/approve`);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to decline this rental request?')) return;
    try {
      await api.put(`/bookings/${id}/reject`);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject request');
    }
  };

  const formatRent = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/owner/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Rental Applications Received</h1>
          <p style={{ color: '#64748b' }}>Review applicants interested in leasing your listed properties</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px' }}
            >
              {tab === 'ALL' ? 'All Applications' : tab}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="card" style={{ background: '#fff' }}>
          {loading ? (
            <div className="flex-center" style={{ minHeight: '300px' }}>
              <div className="spinner"></div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
              <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>No rental applications found</h3>
              <p>No applications match the selected status filter.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Applicant Tenant</th>
                    <th>Rental Term</th>
                    <th>Rent</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <Link to={`/properties/${req.propertyId}`} style={{ fontWeight: '700', color: '#1e3a8a', display: 'block', fontSize: '1rem' }}>
                          {req.propertyTitle}
                        </Link>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {req.propertyCity}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{req.tenantName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {req.tenantEmail} • {req.tenantPhone}
                        </div>
                        {req.notes && (
                          <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '0.35rem 0.5rem', borderRadius: '4px', marginTop: '0.35rem', color: '#334155' }}>
                            "{req.notes}"
                          </div>
                        )}
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: '500' }}>{req.startDate} to {req.endDate}</div>
                        <div style={{ color: '#64748b' }}>Applied on {new Date(req.createdAt).toLocaleDateString()}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: '700', color: '#1e3a8a' }}>{formatRent(req.monthlyRent)}/mo</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Est: {formatRent(req.totalAmount)}</div>
                      </td>

                      <td>
                        <span className={`badge status-${req.status}`}>
                          {req.status}
                        </span>
                      </td>

                      <td>
                        {req.status === 'PENDING' ? (
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
                        ) : req.status === 'APPROVED' ? (
                          <span style={{ fontSize: '0.8rem', color: '#2563eb' }}>Awaiting Payment</span>
                        ) : req.status === 'COMPLETED' ? (
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>Active Lease (Paid)</span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Closed</span>
                        )}
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
