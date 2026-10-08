import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Building2, Search, ArrowLeft, Trash2, Eye, MapPin, Power } from 'lucide-react';

export const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/properties');
      setProperties(res.data);
    } catch (err) {
      console.error('Failed to load properties', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const res = await api.put(`/properties/${id}/toggle-availability`);
      setProperties(properties.map(p => p.id === id ? { ...p, available: res.data.available } : p));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update property status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove property listing "${title}" from the platform?`)) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove property');
    }
  };

  const formatRent = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const filteredProperties = properties.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchTerm = p.title.toLowerCase().includes(term) || p.city.toLowerCase().includes(term) || (p.ownerName && p.ownerName.toLowerCase().includes(term));
    const matchCity = selectedCity ? p.city.toLowerCase() === selectedCity.toLowerCase() : true;
    return matchTerm && matchCity;
  });

  const cities = Array.from(new Set(properties.map(p => p.city)));

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
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Moderate Properties</h1>
            <p style={{ color: '#64748b' }}>Oversee all property listings submitted across all landlords</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-control"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search title, landlord..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.2rem', minWidth: '220px' }}
              />
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>

        {/* Properties Table */}
        <div className="card" style={{ background: '#fff' }}>
          {loading ? (
            <div className="flex-center" style={{ minHeight: '300px' }}>
              <div className="spinner"></div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
              <Building2 size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>No properties found</h3>
              <p>Try modifying your city or search keywords.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Landlord</th>
                    <th>Rent</th>
                    <th>Availability</th>
                    <th>Listed Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={(p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80'}
                            alt={p.title}
                            style={{ width: '56px', height: '46px', borderRadius: '6px', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80'; }}
                          />
                          <div>
                            <Link to={`/properties/${p.id}`} style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '0.95rem' }}>
                              {p.title}
                            </Link>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <MapPin size={12} />
                              <span>{p.city}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge badge-secondary">{p.propertyType}</span>
                      </td>

                      <td>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{p.ownerName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.ownerEmail}</div>
                      </td>

                      <td style={{ fontWeight: '700', color: '#0f172a' }}>
                        {formatRent(p.rent)} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/mo</span>
                      </td>

                      <td>
                        <button
                          onClick={() => handleToggleAvailability(p.id)}
                          className={`badge ${p.available ? 'badge-success' : 'badge-danger'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                          title="Toggle availability"
                        >
                          {p.available ? '● Available' : '○ Rented'}
                        </button>
                      </td>

                      <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link to={`/properties/${p.id}`} className="btn btn-secondary btn-sm" title="View Property">
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="btn btn-outline-danger btn-sm"
                            title="Remove Property"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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
