import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FileText, CheckCircle, Clock, XCircle, CreditCard, ArrowLeft, Building2 } from 'lucide-react';

export const TenantRequests = () => {
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

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this rental request?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel request');
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
        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/tenant/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>My Rental Requests</h1>
            <p style={{ color: '#64748b' }}>Manage your rental applications submitted to property owners</p>
          </div>
          <Link to="/properties" className="btn btn-primary">
            <Building2 size={16} />
            <span>Find More Properties</span>
          </Link>
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px' }}
            >
              {tab === 'ALL' ? 'All Requests' : tab}
            </button>
          ))}
        </div>

        {/* Requests Table */}
        <div className="card" style={{ background: '#fff' }}>
          {loading ? (
            <div className="flex-center" style={{ minHeight: '300px' }}>
              <div className="spinner"></div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 0', color: '#64748b' }}>
              <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>No rental requests found</h3>
              <p>You have no applications matching this filter status.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Property Details</th>
                    <th>Landlord</th>
                    <th>Duration & Dates</th>
                    <th>Rent / Total</th>
                    <th>Status</th>
                    <th>Actions</th>
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
                          {req.propertyCity} • {req.propertyAddress}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: '600' }}>{req.ownerName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{req.ownerPhone}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: '500' }}>{req.startDate} to {req.endDate}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Applied on {new Date(req.createdAt).toLocaleDateString()}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: '700', color: '#1e3a8a' }}>{formatRent(req.monthlyRent)}/mo</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Est. Total: {formatRent(req.totalAmount)}</div>
                      </td>

                      <td>
                        <span className={`badge status-${req.status}`}>
                          {req.status}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {req.status === 'APPROVED' && !req.paid && (
                            <Link to={`/tenant/payment/${req.id}`} className="btn btn-success btn-sm">
                              <CreditCard size={14} />
                              <span>Pay Rent</span>
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
                              <XCircle size={14} />
                              <span>Cancel</span>
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
      </div>
    </div>
  );
};
