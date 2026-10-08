import React from 'react';
import { 
  Building2, 
  Server, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Code2, 
  Layers 
} from 'lucide-react';

export const About = () => {
  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Academic B.Tech Project
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
            About Property Rental System
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.7' }}>
            A modern, enterprise-style Java Full-Stack web application architected with Spring Boot, PostgreSQL, and React.js to provide a robust digital marketplace for property rentals.
          </p>
        </div>

        {/* 3 Tier Architecture Cards */}
        <div className="grid-3" style={{ marginBottom: '4rem' }}>
          <div className="card" style={{ background: '#fff' }}>
            <div style={{ color: '#0284c7', marginBottom: '1rem' }}>
              <Layers size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>React Frontend</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Single Page Application built with React, Vite, React Router, and Axios. Features responsive UI, role-based view routing, and dynamic data filtering.
            </p>
            <span className="badge badge-secondary">React.js • Axios • CSS3</span>
          </div>

          <div className="card" style={{ background: '#fff' }}>
            <div style={{ color: '#16a34a', marginBottom: '1rem' }}>
              <Server size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Spring Boot Backend</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              REST API layer built with Spring Boot 3, Spring Web, Spring Security, and JWT. Implements BCrypt hashing, global exception handling, and clean layered architecture.
            </p>
            <span className="badge badge-secondary">Java 21 • Spring Boot • JWT</span>
          </div>

          <div className="card" style={{ background: '#fff' }}>
            <div style={{ color: '#3b82f6', marginBottom: '1rem' }}>
              <Database size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>PostgreSQL Database</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Relational data store managed via Spring Data JPA and Hibernate ORM. Includes foreign keys, indexes, and full relational tables for users, properties, and bookings.
            </p>
            <span className="badge badge-secondary">PostgreSQL • JPA • Hibernate</span>
          </div>
        </div>

        {/* Key Features Overview */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '4rem', background: '#fff' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
            Key Functional Modules
          </h2>
          <div className="grid-3">
            <div>
              <h4 style={{ color: '#1e3a8a', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} />
                <span>Tenant Module</span>
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Search & Filter Properties</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Submit Rental Requests</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Contact Property Landlords</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Demo Payment Simulation</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Printable Payment Receipts</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#0d9488', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={18} />
                <span>Owner Module</span>
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Add, Edit & Delete Properties</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Toggle Property Availability</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Approve / Reject Rental Requests</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> View Tenant Messages & Reply</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Monitor Rental Income</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#b45309', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} />
                <span>Admin Module</span>
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> System-wide User Management</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Enable / Disable User Accounts</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Moderate All Listed Properties</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Audit All Bookings & Transactions</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={15} color="#10b981" /> Visual Reports & Statistics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
