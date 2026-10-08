import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { CheckCircle2, ArrowLeft, Printer, Building2, MapPin, Calendar, Phone, Mail } from 'lucide-react';

export const TenantBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      // Filter only confirmed rentals
      const confirmed = res.data.filter((b) => b.status === 'COMPLETED');
      setBookings(confirmed);
    } catch (err) {
      console.error('Failed to load confirmed rentals', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRent = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/tenant/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>My Confirmed Rentals</h1>
          <p style={{ color: '#64748b' }}>Properties you have successfully rented with verified payment confirmation</p>
        </div>

        {loading ? (
          <div className="flex-center" style={{ minHeight: '300px' }}>
            <div className="spinner"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem', background: '#fff', textAlign: 'center' }}>
            <Building2 size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No active rentals yet</h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Once your rental request is approved and payment is simulated, your active lease will appear here.</p>
            <Link to="/properties" className="btn btn-primary">Find a Property to Rent</Link>
          </div>
        ) : (
          <div className="grid-2">
            {bookings.map((b) => (
              <div key={b.id} className="card" style={{ background: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>
                      Confirmed & Active Lease
                    </span>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a' }}>
                      <Link to={`/properties/${b.propertyId}`} style={{ color: 'inherit' }}>
                        {b.propertyTitle}
                      </Link>
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem' }}>
                      <MapPin size={14} color="#1e3a8a" />
                      <span>{b.propertyCity} • {b.propertyAddress}</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', margin: '0.5rem 0 1.25rem' }}>
                  <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#64748b' }}>Rental Term:</span>
                    <span style={{ fontWeight: '600' }}>{b.startDate} to {b.endDate}</span>
                  </div>
                  <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#64748b' }}>Monthly Rent:</span>
                    <span style={{ fontWeight: '600' }}>{formatRent(b.monthlyRent)}</span>
                  </div>
                  <div className="flex-between" style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e3a8a', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                    <span>Amount Paid:</span>
                    <span>{formatRent(b.totalAmount)}</span>
                  </div>
                  {b.transactionId && (
                    <div style={{ fontSize: '0.8rem', color: '#0d9488', marginTop: '0.35rem', wordBreak: 'break-all' }}>
                      Txn Ref: {b.transactionId}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Landlord: <strong>{b.ownerName}</strong> ({b.ownerPhone})
                  </div>
                  <Link to={`/tenant/receipt/${b.id}`} className="btn btn-secondary btn-sm">
                    <Printer size={15} />
                    <span>View & Print Receipt</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
