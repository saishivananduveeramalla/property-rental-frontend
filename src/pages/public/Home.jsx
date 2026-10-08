import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { PropertyCard } from '../../components/PropertyCard';
import { 
  Search, 
  MapPin, 
  Home as HomeIcon, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Building, 
  Users, 
  ArrowRight 
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await api.get('/properties/available');
      setFeaturedProperties(res.data.slice(0, 6));
    } catch (err) {
      console.error('Failed to load featured properties', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.append('city', city.trim());
    if (type) params.append('type', type);
    if (minRent) params.append('minRent', minRent);
    if (maxRent) params.append('maxRent', maxRent);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Find Your Perfect Property</h1>
          <p>Search, compare and rent properties easily with verified owners and zero broker hassles.</p>

          {/* Search Box */}
          <form className="hero-search-box" onSubmit={handleSearch}>
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>Location / City</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="#1e3a8a" />
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>Property Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', background: 'transparent' }}
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="PG">PG / Co-living</option>
                <option value="Studio">Studio</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>Min Rent (₹)</label>
              <input
                type="number"
                placeholder="₹ Min"
                value={minRent}
                onChange={(e) => setMinRent(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>Max Rent (₹)</label>
              <input
                type="number"
                placeholder="₹ Max"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', height: '100%' }}>
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Popular Cities Quick Browse */}
      <section style={{ padding: '2.5rem 0', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '600', color: '#475569', fontSize: '0.95rem' }}>Popular Cities:</span>
          {['Hyderabad', 'Bangalore', 'Mumbai', 'Chennai', 'Delhi'].map((c) => (
            <button
              key={c}
              onClick={() => navigate(`/properties?city=${c}`)}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '20px' }}
            >
              <MapPin size={14} color="#0d9488" />
              <span>{c}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Featured Properties</h2>
              <p style={{ color: '#64748b' }}>Explore top-rated residential and commercial rental options</p>
            </div>
            <Link to="/properties" className="btn btn-secondary">
              <span>View All Properties</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex-center" style={{ minHeight: '300px' }}>
              <div className="spinner"></div>
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: '#64748b' }}>No properties listed currently.</p>
            </div>
          ) : (
            <div className="grid-3">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Property Categories */}
      <section style={{ padding: '4rem 0', background: '#f1f5f9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Explore by Property Type</h2>
            <p style={{ color: '#64748b' }}>Whether you need a compact room or a luxury villa, we have it all.</p>
          </div>

          <div className="grid-4">
            {[
              { type: 'Apartment', title: 'Apartments', desc: 'Modern high-rises and gated flats', icon: Building },
              { type: 'House', title: 'Independent Houses', desc: 'Private duplex and builder floors', icon: HomeIcon },
              { type: 'Villa', title: 'Luxury Villas', desc: 'Spacious villas with gardens', icon: ShieldCheck },
              { type: 'PG', title: 'Paying Guest & PG', desc: 'Furnished rooms with food and WiFi', icon: Users },
            ].map((cat) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={cat.type}
                  className="card"
                  onClick={() => navigate(`/properties?type=${cat.type}`)}
                  style={{ cursor: 'pointer', textAlign: 'center', padding: '2rem 1.5rem', transition: 'var(--transition)' }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#eff6ff',
                    color: '#1e3a8a',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                  }}>
                    <IconComponent size={28} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.4rem', color: '#0f172a' }}>{cat.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Why Rent Through Us?</h2>
            <p style={{ color: '#64748b' }}>Built from the ground up for seamless, secure property leasing</p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ border: 'none', background: '#f8fafc', padding: '2rem' }}>
              <div style={{ color: '#10b981', marginBottom: '1rem' }}>
                <ShieldCheck size={36} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>100% Verified Owners</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Every property and landlord profile is systematically approved by our admin team before listing.
              </p>
            </div>

            <div className="card" style={{ border: 'none', background: '#f8fafc', padding: '2rem' }}>
              <div style={{ color: '#0d9488', marginBottom: '1rem' }}>
                <Clock size={36} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Fast Rental Approvals</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Submit rental dates directly to owners and receive quick notifications on request approvals and booking confirmations.
              </p>
            </div>

            <div className="card" style={{ border: 'none', background: '#f8fafc', padding: '2rem' }}>
              <div style={{ color: '#1e3a8a', marginBottom: '1rem' }}>
                <DollarSign size={36} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Transparent Rent & Payments</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                No hidden brokerage charges. Easily verify total rental charges and simulate instant booking confirmation receipts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner CTA */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%)', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1rem' }}>Own a Property in Hyderabad, Bangalore or Mumbai?</h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem', opacity: 0.9 }}>
            Join thousands of landlords who find trusted tenants without paying broker commissions.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-secondary btn-lg" style={{ background: '#fff', color: '#1e3a8a', border: 'none' }}>
              List Your Property Now
            </Link>
            <Link to="/properties" className="btn btn-teal btn-lg" style={{ border: '1px solid rgba(255,255,255,0.4)' }}>
              Browse Available Rentals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
