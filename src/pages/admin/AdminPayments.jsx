import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { DollarSign, ArrowLeft, Search, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/payments');
      setPayments(res.data);
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRent = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const filtered = payments.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.transactionId && p.transactionId.toLowerCase().includes(term)) ||
      (p.propertyTitle && p.propertyTitle.toLowerCase().includes(term)) ||
      (p.tenantName && p.tenantName.toLowerCase().includes(term)) ||
      (p.ownerName && p.ownerName.toLowerCase().includes(term))
    );
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
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Payment Transactions & Audit</h1>
            <p style={{ color: '#64748b' }}>Complete financial ledger of simulated rental payments and receipts</p>
          </div>

          <div className="card" style={{ padding: '0.85rem 1.5rem', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <span style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: '600', display: 'block' }}>Total Platform Revenue</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#047857' }}>{formatRent(totalAmount)}</span>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search transaction ID, tenant, property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.2rem', minWidth: '280px' }}
            />
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {/* Payments Table */}
        <div className="card" style={{ background: '#fff' }}>
          {loading ? (
            <div className="flex-center" style={{ minHeight: '300px' }}>
              <div className="spinner"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
              <DollarSign size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>No payment records found</h3>
              <p>Transactions will appear here when tenants complete rent payments.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Property</th>
                    <th>Tenant (Payer)</th>
                    <th>Landlord (Receiver)</th>
                    <th>Amount Paid</th>
                    <th>Method</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((pay) => (
                    <tr key={pay.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: '700', color: '#0f766e', fontSize: '0.85rem' }}>
                        {pay.transactionId}
                      </td>

                      <td>
                        <Link to={`/properties/${pay.propertyId}`} style={{ fontWeight: '600', color: '#1e3a8a' }}>
                          {pay.propertyTitle}
                        </Link>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{pay.propertyCity}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{pay.tenantName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{pay.tenantEmail}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{pay.ownerName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{pay.ownerEmail}</div>
                      </td>

                      <td style={{ fontWeight: '800', color: '#047857', fontSize: '1rem' }}>
                        {formatRent(pay.amount)}
                      </td>

                      <td>
                        <span className="badge badge-secondary">{pay.paymentMethod}</span>
                      </td>

                      <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                        {new Date(pay.paymentDate).toLocaleString()}
                      </td>

                      <td>
                        <span className="badge badge-success">
                          ✓ {pay.paymentStatus}
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
