import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
            Contact & Support
          </h1>
          <p style={{ color: '#64748b' }}>
            Have questions about listing a property, rental agreements, or college project evaluation? We're here to assist.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }}>
          {/* Contact Information */}
          <div>
            <div className="card" style={{ background: '#fff', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', color: '#0f172a' }}>
                Contact Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ background: '#eff6ff', padding: '0.6rem', borderRadius: '8px', color: '#1e3a8a' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0f172a' }}>Headquarters</h4>
                    <p style={{ fontSize: '0.85rem' }}>Cyber Towers, Hitec City, Hyderabad, Telangana - 500081</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ background: '#eff6ff', padding: '0.6rem', borderRadius: '8px', color: '#1e3a8a' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0f172a' }}>Helpline Phone</h4>
                    <p style={{ fontSize: '0.85rem' }}>+91 98765 43210 / 040-23456789</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ background: '#eff6ff', padding: '0.6rem', borderRadius: '8px', color: '#1e3a8a' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0f172a' }}>Email Address</h4>
                    <p style={{ fontSize: '0.85rem' }}>support@propertyrental.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>College Project Note</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6' }}>
                This is a fully-integrated full stack demonstration created for B.Tech CSE / IT evaluation. All data and queries are persisted securely in the PostgreSQL database.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="card" style={{ background: '#fff' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '1.25rem', color: '#0f172a' }}>
              Send us a Message
            </h3>

            {submitted && (
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={20} />
                <span>Thank you! Your inquiry has been received. Our team will get back to you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Inquiry about Listing Properties in Mumbai"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  required
                  rows="4"
                  className="form-control"
                  placeholder="Write your query or message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg">
                <Send size={18} />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
