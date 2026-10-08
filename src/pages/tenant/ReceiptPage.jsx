import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Printer, ArrowLeft, CheckCircle, Building2, ShieldCheck } from 'lucide-react';

export const ReceiptPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceiptData();
  }, [id]);

  const fetchReceiptData = async () => {
    setLoading(true);
    try {
      const [bookingRes, paymentsRes] = await Promise.all([
        api.get(`/bookings/${id}`),
        api.get(`/payments/booking/${id}`)
      ]);
      setBooking(bookingRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error('Failed to load receipt details', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
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

  if (!booking) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Receipt Not Found</h2>
        <Link to="/tenant/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const payment = payments.length > 0 ? payments[0] : null;

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Actions bar (hidden on print) */}
        <div className="flex-between no-print" style={{ marginBottom: '1.5rem' }}>
          <Link to="/tenant/bookings" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} />
            <span>Back to My Bookings</span>
          </Link>

          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} />
            <span>Print / Save as PDF</span>
          </button>
        </div>

        {/* Printable Receipt Card */}
        <div className="card receipt-printable" style={{ background: '#fff', padding: '3rem', border: '1px solid #cbd5e1' }}>
          {/* Header */}
          <div className="flex-between" style={{ borderBottom: '2px solid #1e3a8a', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e3a8a', fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.35rem' }}>
                <Building2 size={26} />
                <span>PropertyRental System</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Official Rental Lease Confirmation & Payment Invoice
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                PAYMENT CONFIRMED
              </span>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>
                Invoice #{booking.id.toString().padStart(6, '0')}
              </div>
            </div>
          </div>

          {/* Meta Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>
                Tenant Information
              </h4>
              <p style={{ fontWeight: '700', fontSize: '1.05rem', color: '#0f172a' }}>{booking.tenantName}</p>
              <p style={{ fontSize: '0.9rem', color: '#475569' }}>{booking.tenantEmail}</p>
              <p style={{ fontSize: '0.9rem', color: '#475569' }}>{booking.tenantPhone}</p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>
                Landlord / Owner
              </h4>
              <p style={{ fontWeight: '700', fontSize: '1.05rem', color: '#0f172a' }}>{booking.ownerName}</p>
              <p style={{ fontSize: '0.9rem', color: '#475569' }}>{booking.ownerEmail}</p>
              <p style={{ fontSize: '0.9rem', color: '#475569' }}>{booking.ownerPhone}</p>
            </div>
          </div>

          {/* Transaction Metadata */}
          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block' }}>Transaction ID:</span>
              <span style={{ fontWeight: '600', color: '#0f172a', wordBreak: 'break-all' }}>
                {booking.transactionId || (payment ? payment.transactionId : 'N/A')}
              </span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block' }}>Payment Method:</span>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>
                {payment ? payment.paymentMethod : 'ONLINE_SIMULATED'}
              </span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block' }}>Payment Date:</span>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>
                {payment ? new Date(payment.paymentDate).toLocaleDateString() : new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Rental Particulars Table */}
          <table className="data-table" style={{ marginBottom: '2rem' }}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Period</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{booking.propertyTitle}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {booking.propertyAddress}, {booking.propertyCity}
                  </div>
                </td>
                <td>
                  {booking.startDate} to {booking.endDate}
                </td>
                <td style={{ textAlign: 'right', fontWeight: '700' }}>
                  {formatRent(booking.totalAmount)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" style={{ textAlign: 'right', fontWeight: '700', fontSize: '1rem' }}>
                  Total Paid:
                </td>
                <td style={{ textAlign: 'right', fontWeight: '800', fontSize: '1.25rem', color: '#1e3a8a' }}>
                  {formatRent(booking.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Stamp & Disclaimer */}
          <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '400px' }}>
              <p>System-generated digital receipt. No signature required.</p>
              <p>Project Demonstration: Property Rental System Full-Stack App.</p>
            </div>

            <div style={{ border: '2px solid #10b981', color: '#10b981', padding: '0.4rem 1rem', borderRadius: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              ✓ PAID & CONFIRMED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
