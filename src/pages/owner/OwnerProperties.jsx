import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Building2, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  MapPin 
} from 'lucide-react';

export const OwnerProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/properties/owner/${user.id}`);
      setProperties(res.data);
    } catch (err) {
      console.error('Failed to load owner properties', err);
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
    if (!window.confirm(`Are you sure you want to delete the listing "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete property');
    }
  };

  const formatRent = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/owner/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>My Listed Properties</h1>
            <p style={{ color: '#64748b' }}>Manage your real-estate listings, rental availability, and updates</p>
          </div>

          <Link to="/owner/properties/add" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>Add New Property</span>
          </Link>
        </div>

        {/* Properties Table */}
        <div className="card" style={{ background: '#fff' }}>
          {loading ? (
            <div className="flex-center" style={{ minHeight: '300px' }}>
              <div className="spinner"></div>
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
              <Building2 size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No properties listed yet</h3>
              <p style={{ marginBottom: '1.5rem' }}>Start by adding your apartments, houses, or rooms to reach prospective tenants.</p>
              <Link to="/owner/properties/add" className="btn btn-primary">
                Add Your First Property
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Rent</th>
                    <th>Specs</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img
                            src={(p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80'}
                            alt={p.title}
                            style={{ width: '60px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80'; }}
                          />
                          <div>
                            <Link to={`/properties/${p.id}`} style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '0.95rem' }}>
                              {p.title}
                            </Link>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <MapPin size={12} />
                              <span>{p.city}, {p.address}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge badge-secondary">{p.propertyType}</span>
                      </td>

                      <td style={{ fontWeight: '700', color: '#0f172a' }}>
                        {formatRent(p.rent)} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/mo</span>
                      </td>

                      <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                        {p.bedrooms > 0 ? `${p.bedrooms} BHK` : 'Studio'} • {p.bathrooms} Baths • {p.area} sqft
                      </td>

                      <td>
                        <button
                          onClick={() => handleToggleAvailability(p.id)}
                          className={`badge ${p.available ? 'badge-success' : 'badge-danger'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                          title="Click to toggle availability"
                        >
                          {p.available ? '● Available' : '○ Rented'}
                        </button>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link to={`/properties/${p.id}`} className="btn btn-secondary btn-sm" title="View Details">
                            <Eye size={14} />
                          </Link>
                          <Link to={`/owner/properties/edit/${p.id}`} className="btn btn-secondary btn-sm" title="Edit">
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="btn btn-outline-danger btn-sm"
                            title="Delete"
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
