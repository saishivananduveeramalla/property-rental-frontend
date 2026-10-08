import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { PlusCircle, ArrowLeft, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

const COMMON_AMENITIES = [
  'High Speed WiFi',
  'Covered Parking',
  'Swimming Pool',
  'Gym / Fitness Center',
  '24/7 Security & CCTV',
  'Power Backup',
  'Lift / Elevator',
  'Air Conditioning',
  'Club House',
  'Children Play Area',
  'Piped Gas',
  'Rainwater Harvesting'
];

export const AddProperty = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('');
  const [rent, setRent] = useState('');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [area, setArea] = useState('');
  const [furnishedStatus, setFurnishedStatus] = useState('Furnished');
  const [selectedAmenities, setSelectedAmenities] = useState(['High Speed WiFi', 'Covered Parking', '24/7 Security & CCTV']);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [available, setAvailable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddImage = (e) => {
    e.preventDefault();
    if (imageUrlInput.trim() && !images.includes(imageUrlInput.trim())) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (images.length === 0) {
      setError('Please add at least one property image URL.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/properties', {
        title,
        description,
        propertyType,
        address,
        city,
        state,
        pincode,
        rent: parseFloat(rent),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        area: parseFloat(area),
        furnishedStatus,
        amenities: selectedAmenities.join(', '),
        available,
        images,
      });

      navigate('/owner/properties');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list property. Please verify your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <Link to="/owner/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to My Properties</span>
        </Link>

        <div className="card" style={{ background: '#fff', padding: '2.5rem' }}>
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>List a New Property</h1>
            <p style={{ color: '#64748b' }}>Provide accurate details to find verified tenants quickly</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Property Title / Heading *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Spacious 3BHK Gated Apartment in Hitec City"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea
                required
                rows="4"
                className="form-control"
                placeholder="Describe rooms, views, ventilation, landmark proximity, preferred tenant family/bachelors..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Type, Furnishing */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Property Type *</label>
                <select
                  className="form-control"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">Independent House</option>
                  <option value="Villa">Villa</option>
                  <option value="PG">PG / Paying Guest</option>
                  <option value="Room">Single Room</option>
                  <option value="Studio">Studio Apartment</option>
                  <option value="Commercial">Commercial / Office</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Furnishing Status *</label>
                <select
                  className="form-control"
                  value={furnishedStatus}
                  onChange={(e) => setFurnishedStatus(e.target.value)}
                >
                  <option value="Furnished">Fully Furnished</option>
                  <option value="Semi_Furnished">Semi Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>

            {/* Location Fields */}
            <div className="form-group">
              <label className="form-label">Street Address *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Flat 402, Cyber Heights, Gachibowli Main Rd"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Hyderabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Telangana"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pincode *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. 500081"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>
            </div>

            {/* Pricing & Measurements */}
            <div className="grid-4">
              <div className="form-group">
                <label className="form-label">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  required
                  min="500"
                  className="form-control"
                  placeholder="e.g. 35000"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bedrooms *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="form-control"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bathrooms *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="form-control"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Super Area (sqft) *</label>
                <input
                  type="number"
                  required
                  min="100"
                  className="form-control"
                  placeholder="e.g. 1450"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div className="form-group">
              <label className="form-label">Amenities & Features</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
                {COMMON_AMENITIES.map((amenity) => (
                  <label
                    key={amenity}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      color: '#475569',
                      background: '#f8fafc',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image URLs */}
            <div className="form-group">
              <label className="form-label">Property Photos (Image URLs) *</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="url"
                  className="form-control"
                  placeholder="Paste direct image link (e.g. Unsplash or web image)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="btn btn-secondary"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <ImageIcon size={16} />
                  <span>Add Image</span>
                </button>
              </div>

              {/* Thumbnails */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {images.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '90px', height: '70px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={url} alt="property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '600', color: '#1e3a8a' }}>
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                />
                <span>Set Property as Immediately Available for Rent</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <Link to="/owner/properties" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
                <PlusCircle size={18} />
                <span>{loading ? 'Publishing Property...' : 'Publish Property Listing'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
