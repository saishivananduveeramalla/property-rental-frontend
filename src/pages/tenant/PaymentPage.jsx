import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  QrCode, 
  Lock 
} from 'lucide-react';

export const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8910');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [upiId, setUpiId] = useState('tenant@okaxis');
  const [submitting, setSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/bookings/${bookingId}`);
      if (res.data.status !== 'APPROVED' && res.data.status !== 'COMPLETED') {
        setError(`Payment is not available for this booking. Status: ${res.data.status}`);
      }
      setBooking(res.data);
    } catch (err) {
      setError('Could not load booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/payments', {
        bookingId: parseInt(bookingId),
        paymentMethod,
        cardNumber: paymentMethod === 'CARD' ? cardNumber : null,
        cardExpiry: paymentMethod === 'CARD' ? cardExpiry : null,
        cardCvv: paymentMethod === 'CARD' ? cardCvv : null,
        upiId: paymentMethod === 'UPI' ? upiId : null,
      });

      setPaymentSuccess(true);
      setTimeout(() => {
        navigate(`/tenant/receipt/${bookingId}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed. Please try again.');
      setSubmitting(false);
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

  if (error || !booking) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <h2>Unable to Process Payment</h2>
          <p style={{ color: '#64748b', margin: '1rem 0 1.5rem' }}>{error}</p>
          <Link to="/tenant/requests" className="btn btn-primary">Return to My Requests</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: 'calc(100vh - 140px)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <Link to="/tenant/requests" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Rental Requests</span>
        </Link>

        {/* Demo Notice Banner */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '0.9rem 1.25rem', borderRadius: '8px', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
          <ShieldCheck size={20} color="#d97706" />
          <span>
            <strong>Academic Demo Simulation:</strong> No real money will be charged. This simulates an approved payment workflow and issues a verified digital lease receipt.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          {/* Payment Form */}
          <div className="card" style={{ background: '#fff' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
              Select Payment Method
            </h2>

            {paymentSuccess ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ color: '#065f46', fontSize: '1.3rem', fontWeight: '700' }}>Payment Successful!</h3>
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Generating official rental confirmation receipt...</p>
              </div>
            ) : (
              <form onSubmit={handlePayment}>
                {/* Method selector tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {[
                    { id: 'CARD', label: 'Card' },
                    { id: 'UPI', label: 'UPI / QR' },
                    { id: 'NET_BANKING', label: 'NetBanking' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        border: `2px solid ${paymentMethod === m.id ? '#1e3a8a' : '#e2e8f0'}`,
                        background: paymentMethod === m.id ? '#eff6ff' : '#fff',
                        color: paymentMethod === m.id ? '#1e3a8a' : '#475569',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'CARD' && (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Card Number (Simulated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input
                          type="password"
                          maxLength="4"
                          className="form-control"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'UPI' && (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Virtual Payment Address (VPA) / UPI ID</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ textAlign: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                      <QrCode size={90} color="#1e3a8a" style={{ margin: '0 auto' }} />
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginTop: '0.5rem' }}>
                        Simulated QR Code Scanner
                      </span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NET_BANKING' && (
                  <div className="form-group">
                    <label className="form-label">Select Bank</label>
                    <select className="form-control" defaultValue="HDFC">
                      <option value="HDFC">HDFC Bank</option>
                      <option value="SBI">State Bank of India (SBI)</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="AXIS">Axis Bank</option>
                    </select>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', margin: '1rem 0 1.5rem' }}>
                  <Lock size={14} color="#10b981" />
                  <span>256-bit Encrypted SSL Simulated Payment Session</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-success btn-full btn-lg"
                >
                  {submitting ? 'Authorizing Payment...' : `Confirm & Pay ${formatRent(booking.totalAmount)}`}
                </button>
              </form>
            )}
          </div>

          {/* Rental Summary Card */}
          <div>
            <div className="card" style={{ background: '#fff' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                Rental Summary
              </h3>

              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e3a8a' }}>{booking.propertyTitle}</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{booking.propertyCity} • {booking.propertyAddress}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#475569', marginBottom: '1.25rem' }}>
                <div className="flex-between">
                  <span>Landlord:</span>
                  <span style={{ fontWeight: '600' }}>{booking.ownerName}</span>
                </div>
                <div className="flex-between">
                  <span>Start Date:</span>
                  <span style={{ fontWeight: '600' }}>{booking.startDate}</span>
                </div>
                <div className="flex-between">
                  <span>End Date:</span>
                  <span style={{ fontWeight: '600' }}>{booking.endDate}</span>
                </div>
                <div className="flex-between">
                  <span>Monthly Rent:</span>
                  <span style={{ fontWeight: '600' }}>{formatRent(booking.monthlyRent)}</span>
                </div>
              </div>

              <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px' }}>
                <div className="flex-between" style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e3a8a' }}>
                  <span>Total Payable:</span>
                  <span>{formatRent(booking.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
