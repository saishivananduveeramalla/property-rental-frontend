import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { PropertyCard } from '../../components/PropertyCard';
import { Search, Filter, RotateCcw, Building2 } from 'lucide-react';

export const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [city, setCity] = useState(searchParams.get('city') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '');
  const [minRent, setMinRent] = useState(searchParams.get('minRent') || '');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [availableOnly, setAvailableOnly] = useState(searchParams.get('available') !== 'false');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'date_desc');

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const qCity = searchParams.get('city') || '';
      const qType = searchParams.get('type') || '';
      const qMin = searchParams.get('minRent') || '';
      const qMax = searchParams.get('maxRent') || '';
      const qBeds = searchParams.get('bedrooms') || '';
      const qAvail = searchParams.get('available');
      const qSort = searchParams.get('sortBy') || 'date_desc';

      const params = new URLSearchParams();
      if (qCity) params.append('city', qCity);
      if (qType) params.append('type', qType);
      if (qMin) params.append('minRent', qMin);
      if (qMax) params.append('maxRent', qMax);
      if (qBeds) params.append('bedrooms', qBeds);
      if (qAvail !== null && qAvail !== '') params.append('available', qAvail);
      params.append('sortBy', qSort);

      const res = await api.get(`/properties/search?${params.toString()}`);
      setProperties(res.data);
    } catch (err) {
      console.error('Failed to fetch properties', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.append('city', city.trim());
    if (propertyType) params.append('type', propertyType);
    if (minRent) params.append('minRent', minRent);
    if (maxRent) params.append('maxRent', maxRent);
    if (bedrooms) params.append('bedrooms', bedrooms);
    if (availableOnly) params.append('available', 'true');
    if (sortBy) params.append('sortBy', sortBy);

    setSearchParams(params);
  };

  const handleReset = () => {
    setCity('');
    setPropertyType('');
    setMinRent('');
    setMaxRent('');
    setBedrooms('');
    setAvailableOnly(true);
    setSortBy('date_desc');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a' }}>Explore Properties</h1>
          <p style={{ color: '#64748b' }}>Search and filter among our wide selection of flats, houses, villas, and PGs.</p>
        </div>

        {/* Filter Card */}
        <div className="card" style={{ marginBottom: '2.5rem', background: '#fff' }}>
          <form onSubmit={applyFilters}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
              {/* City / Location */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">City / Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Hyderabad, Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              {/* Property Type */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Property Type</label>
                <select
                  className="form-control"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="PG">PG / Co-living</option>
                  <option value="Room">Single Room</option>
                  <option value="Studio">Studio Apartment</option>
                  <option value="Commercial">Commercial / Office</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Min Bedrooms</label>
                <select
                  className="form-control"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                >
                  <option value="">Any BHK</option>
                  <option value="1">1+ BHK</option>
                  <option value="2">2+ BHK</option>
                  <option value="3">3+ BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              {/* Min Rent */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Min Rent (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min ₹"
                  value={minRent}
                  onChange={(e) => setMinRent(e.target.value)}
                />
              </div>

              {/* Max Rent */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Rent (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max ₹"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                />
              </div>

              {/* Sort By */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Sort By</label>
                <select
                  className="form-control"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date_desc">Newest First</option>
                  <option value="rent_asc">Rent: Low to High</option>
                  <option value="rent_desc">Rent: High to Low</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex-between" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#475569' }}>
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                />
                Show Available Properties Only
              </label>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={handleReset} className="btn btn-secondary btn-sm">
                  <RotateCcw size={15} />
                  <span>Reset</span>
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Filter size={15} />
                  <span>Apply Filters</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Info */}
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontWeight: '600', color: '#475569' }}>
            Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex-center" style={{ minHeight: '350px' }}>
            <div className="spinner"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem', textAlign: 'center' }}>
            <Building2 size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No properties found</h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Try broadening your search criteria or removing filters.</p>
            <button onClick={handleReset} className="btn btn-secondary">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
