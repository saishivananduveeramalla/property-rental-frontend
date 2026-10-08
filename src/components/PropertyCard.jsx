import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Square, ArrowRight } from 'lucide-react';

export const PropertyCard = ({ property }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
  const imageUrl = (property.images && property.images.length > 0) ? property.images[0] : defaultImage;

  const formatRent = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="property-card">
      <div className="property-img-wrapper">
        <img
          src={imageUrl}
          alt={property.title}
          className="property-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
        <div className="property-badge-type">
          {property.propertyType}
        </div>
        <div className="property-badge-status">
          {property.available ? (
            <span className="badge badge-success">Available</span>
          ) : (
            <span className="badge badge-danger">Rented</span>
          )}
        </div>
      </div>

      <div className="property-card-body">
        <div className="property-price">
          {formatRent(property.rent)} <span>/ month</span>
        </div>

        <h3 className="property-title" title={property.title}>
          {property.title}
        </h3>

        <div className="property-location">
          <MapPin size={15} />
          <span>{property.city}, {property.state}</span>
        </div>

        <div className="property-features">
          <div className="feature-item" title="Bedrooms">
            <BedDouble size={16} />
            <span>{property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'Studio'}</span>
          </div>
          <div className="feature-item" title="Bathrooms">
            <Bath size={16} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="feature-item" title="Super Built-up Area">
            <Square size={16} />
            <span>{property.area} sqft</span>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
          <Link to={`/properties/${property.id}`} className="btn btn-primary btn-full">
            <span>View Details</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
