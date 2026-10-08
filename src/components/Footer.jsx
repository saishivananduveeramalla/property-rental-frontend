import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '4rem 0 2rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              <div style={{ background: '#1e3a8a', padding: '0.4rem', borderRadius: '8px' }}>
                <Building2 size={22} />
              </div>
              <span>PropertyRental</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.2rem' }}>
              A full-stack, enterprise-grade Property Rental Management platform built for tenants, property owners, and administrators.
            </p>
            <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
              B.Tech Final Year Project Demo
            </span>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1.2rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ hover: { color: '#fff' } }}>Home</Link></li>
              <li><Link to="/properties">Find Properties</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1.2rem' }}>Top Cities</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/properties?city=Hyderabad">Hyderabad Properties</Link></li>
              <li><Link to="/properties?city=Bangalore">Bangalore Properties</Link></li>
              <li><Link to="/properties?city=Mumbai">Mumbai Properties</Link></li>
              <li><Link to="/properties?city=Chennai">Chennai Properties</Link></li>
              <li><Link to="/properties?city=Delhi">Delhi NCR Properties</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1.2rem' }}>Contact Info</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={16} color="#38bdf8" />
                <span>Cyber Towers, Hitec City, Hyderabad</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} color="#38bdf8" />
                <span>+91 98765 43210</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={16} color="#38bdf8" />
                <span>support@propertyrental.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <p>© {new Date().getFullYear()} Property Rental System. Built with Java Spring Boot, PostgreSQL & React.</p>
        </div>
      </div>
    </footer>
  );
};
