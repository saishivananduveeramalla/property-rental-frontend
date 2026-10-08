import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Send, 
  X, 
  AlertCircle 
} from 'lucide-react';

export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isTenant } = useAuth();

  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Rental Request form state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStartDate = tomorrow.toISOString().split('T')[0];

  const futureEndDate = new Date();
  futureEndDate.setMonth(futureEndDate.getMonth() + 6);
  const defaultEndDate = futureEndDate.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [notes, setNotes] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Contact Owner state
  const [contactMessage, setContactMessage] = useState('');
  const [submittingMessage, setSubmittingMessage] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState('');
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/properties/${id}`);
      setProperty(res.data);
    } catch (err) {
      setError('Property details not found or removed.');
    } finally {
      setLoading(false);
    }
  };

  const formatRent = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Duration & estimated rent calculation
  const calculateEstimate = () => {
    if (!startDate || !endDate) return { days: 0, total: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return { days: 0, total: 0 };

    const months = Math.max(1.0, diffDays / 30.0);
    const total = Math.round(property.rent * months);
    return { days: diffDays, total };
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }
    if (!isTenant) {
      setBookingError('Only registered tenants can submit rental requests. Please login with a Tenant account.');
      return;
    }

    setSubmittingBooking(true);
    setBookingError('');
    try {
      await api.post('/bookings', {
        propertyId: property.id,
        startDate,
        endDate,
        notes,
      });
      setBookingSuccess('Rental request submitted successfully! The owner has been notified.');
      setTimeout(() => {
        setShowRequestModal(false);
        navigate('/tenant/requests');
      }, 2000);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to submit rental request. Please try again.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }

    setSubmittingMessage(true);
    setMessageError('');
    try {
      await api.post('/messages', {
        propertyId: property.id,
        message: contactMessage,
      });
      setMessageSuccess('Your message has been sent to the property owner successfully!');
      setTimeout(() => {
        setShowContactModal(false);
        setContactMessage('');
        setMessageSuccess('');
      }, 2000);
    } catch (err) {
      setMessageError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSubmittingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <h2>Property Not Found</h2>
          <p style={{ color: '#64748b', margin: '1rem 0 1.5rem' }}>{error || 'This property might have been deleted.'}</p>
          <Link to="/properties" className="btn btn-primary">Browse Other Properties</Link>
        </div>
      </div>
    );
  }

  const defaultImg = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';
  const images = (property.images && property.images.length > 0) ? property.images : [defaultImg];
  const { days, total } = calculateEstimate();
  const amenitiesList = property.amenities ? property.amenities.split(',').map((a) => a.trim()).filter(Boolean) : [];

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Breadcrumb & Navigation */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          <Link to="/" style={{ color: '#1e3a8a' }}>Home</Link>
          <span>/</span>
          <Link to="/properties" style={{ color: '#1e3a8a' }}>Properties</Link>
          <span>/</span>
          <span>{property.city}</span>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: '500' }}>{property.title}</span>
        </div>

        {/* Gallery Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ width: '100%', height: '480px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: '#e2e8f0', marginBottom: '1rem' }}>
            <img
              src={images[selectedImage]}
              alt={property.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = defaultImg; }}
            />
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '100px',
                    height: '70px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === idx ? '3px solid #1e3a8a' : '2px solid transparent',
                    flexShrink: 0
                  }}
                >
                  <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Left Details */}
          <div>
            {/* Title & Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">{property.propertyType}</span>
              <span className="badge badge-secondary">{property.furnishedStatus}</span>
              {property.available ? (
                <span className="badge badge-success">Available for Rent</span>
              ) : (
                <span className="badge badge-danger">Currently Rented</span>
              )}
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
              {property.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem' }}>
              <MapPin size={18} color="#1e3a8a" />
              <span>{property.address}, {property.city}, {property.state} - {property.pincode}</span>
            </div>

            {/* Quick Specs Bar */}
            <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.25rem', marginBottom: '2rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Bedrooms</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <BedDouble size={20} color="#1e3a8a" />
                  <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'Studio'}</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Bathrooms</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <Bath size={20} color="#1e3a8a" />
                  <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{property.bathrooms} Baths</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Built-up Area</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <Square size={20} color="#1e3a8a" />
                  <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{property.area} sqft</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Furnishing</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <CheckCircle size={20} color="#0d9488" />
                  <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{property.furnishedStatus}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Property Description</h2>
              <p style={{ color: '#475569', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{property.description}</p>
            </div>

            {/* Amenities */}
            {amenitiesList.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Amenities & Facilities</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {amenitiesList.map((amenity, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: '#f1f5f9',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#334155',
                        fontWeight: '500'
                      }}
                    >
                      <CheckCircle size={16} color="#10b981" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Sidebar */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '90px', background: '#fff' }}>
              <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Monthly Rent</span>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e3a8a', lineHeight: '1.2' }}>
                  {formatRent(property.rent)}
                  <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '400' }}> / month</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
                {property.available ? (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) navigate('/login', { state: { from: `/properties/${id}` } });
                      else setShowRequestModal(true);
                    }}
                    className="btn btn-primary btn-lg btn-full"
                  >
                    <Calendar size={18} />
                    <span>Request to Rent</span>
                  </button>
                ) : (
                  <button disabled className="btn btn-secondary btn-lg btn-full">
                    Currently Unavailable
                  </button>
                )}

                <button
                  onClick={() => {
                    if (!isAuthenticated) navigate('/login', { state: { from: `/properties/${id}` } });
                    else setShowContactModal(true);
                  }}
                  className="btn btn-secondary btn-full"
                >
                  <MessageSquare size={18} />
                  <span>Contact Owner</span>
                </button>
              </div>

              {/* Owner Info Card */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.85rem', color: '#0f172a' }}>
                  Property Owner
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={15} color="#1e3a8a" />
                    <span style={{ fontWeight: '600' }}>{property.ownerName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={15} color="#1e3a8a" />
                    <span>{property.ownerEmail}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={15} color="#1e3a8a" />
                    <span>{property.ownerPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RENTAL REQUEST MODAL */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowRequestModal(false)}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Request to Rent Property</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Submit your desired rental period to <strong>{property.ownerName}</strong> for approval.
            </p>

            {bookingSuccess && (
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} />
                <span>{bookingSuccess}</span>
              </div>
            )}

            {bookingError && (
              <div style={{ background: '#fef2f2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{bookingError}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Rental Start Date</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rental End Date</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Estimated calculations */}
              <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <div className="flex-between" style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  <span>Rental Duration:</span>
                  <span style={{ fontWeight: '600' }}>{days} days (~{(days / 30).toFixed(1)} months)</span>
                </div>
                <div className="flex-between" style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  <span>Monthly Rent:</span>
                  <span style={{ fontWeight: '600' }}>{formatRent(property.rent)}</span>
                </div>
                <div className="flex-between" style={{ fontSize: '1rem', fontWeight: '700', color: '#1e3a8a', borderTop: '1px solid #bfdbfe', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  <span>Estimated Total Amount:</span>
                  <span>{formatRent(total)}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message / Notes for Owner (Optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Introduce yourself, your profession, moving timeline..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowRequestModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submittingBooking || days < 30} className="btn btn-primary">
                  {submittingBooking ? 'Submitting...' : 'Submit Rental Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTACT OWNER MODAL */}
      {showContactModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowContactModal(false)}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Contact Property Owner</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Send an inquiry to <strong>{property.ownerName}</strong> regarding {property.title}.
            </p>

            {messageSuccess && (
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} />
                <span>{messageSuccess}</span>
              </div>
            )}

            {messageError && (
              <div style={{ background: '#fef2f2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{messageError}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea
                  required
                  rows="5"
                  className="form-control"
                  placeholder="Ask about maintenance charges, lease terms, scheduling a physical inspection visit..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowContactModal(false)} className="btn btn-secondary">
                  Close
                </button>
                <button type="submit" disabled={submittingMessage || !contactMessage.trim()} className="btn btn-primary">
                  <Send size={16} />
                  <span>{submittingMessage ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
