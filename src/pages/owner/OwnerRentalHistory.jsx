import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { CheckCircle2, ArrowLeft, DollarSign, Calendar, Building2, User } from 'lucide-react';

export const OwnerRentalHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      // Completed / confirmed rentals
      const completed = res.data.filter((b) => b.status === 'COMPLETED');
      setHistory(completed);
    } catch (err) {
      console.error('Failed to load rental history', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRent = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const totalCollected = history.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/owner/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Rental History & Leases</h1>
            <p style={{ color: '#64748b' }}>Records of completed and confirmed property leases</p>
          </div>

          <div className="card" style={{ padding: '0.85rem 1.5rem', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <span style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: '600', display: 'block' }}>Total Revenue</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#047857' }}>{formatRent(totalCollected)}</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="card" style={{ background: '#fff' }}>
          {loading ? (
            <div className="flex-center" style={{ minHeight: '300px' }}>
              <div className="spinner"></div>
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
              <CheckCircle2 size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>No rental history found</h3>
              <p>Once tenants pay rent for approved properties, the completed leases will appear here.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Tenant Details</th>
                    <th>Rental Term</th>
                    <th>Monthly Rent</th>
                    <th>Total Revenue</th>
                    <th>Transaction Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link to={`/properties/${item.propertyId}`} style={{ fontWeight: '700', color: '#1e3a8a' }}>
                          {item.propertyTitle}
                        </Link>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.propertyCity}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: '600' }}>{item.tenantName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.tenantEmail} • {item.tenantPhone}</div>
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>
                        <div>{item.startDate} to {item.endDate}</div>
                        <div style={{ color: '#64748b' }}>Booked on {new Date(item.createdAt).toLocaleDateString()}</div>
                      </td>

                      <td style={{ fontWeight: '600' }}>
                        {formatRent(item.monthlyRent)}
                      </td>

                      <td style={{ fontWeight: '700', color: '#047857' }}>
                        {formatRent(item.totalAmount)}
                      </td>

                      <td>
                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#0f766e', background: '#f0fdfa', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {item.transactionId || 'CONFIRMED'}
                        </span>
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
