import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Users, 
  Building2, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  ArrowRight, 
  Layers 
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRent = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#1e3a8a" />
            <span>Administrator</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>System Control Center</p>
        </div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/admin/dashboard" className="sidebar-link active">
              <Layers size={18} />
              <span>Overview</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="sidebar-link">
              <Users size={18} />
              <span>Manage Users</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/properties" className="sidebar-link">
              <Building2 size={18} />
              <span>Manage Properties</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/bookings" className="sidebar-link">
              <FileText size={18} />
              <span>Rental Requests</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/payments" className="sidebar-link">
              <DollarSign size={18} />
              <span>Payments & Audit</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/reports" className="sidebar-link">
              <BarChart3 size={18} />
              <span>Reports & Analytics</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              System Administration Dashboard
            </h1>
            <p style={{ color: '#64748b' }}>High-level analytics and system-wide platform controls</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/reports" className="btn btn-secondary btn-sm">
              <BarChart3 size={16} />
              <span>View Reports</span>
            </Link>
            <Link to="/admin/users" className="btn btn-primary btn-sm">
              <Users size={16} />
              <span>Manage Users</span>
            </Link>
          </div>
        </div>

        {/* Primary KPIs Grid */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#eff6ff', color: '#1e3a8a' }}>
              <Users size={24} />
            </div>
            <div>
              <div className="stat-value">{stats?.totalUsers || 0}</div>
              <div className="stat-label">Total Users ({stats?.totalTenants} Tenants, {stats?.totalOwners} Owners)</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <Building2 size={24} />
            </div>
            <div>
              <div className="stat-value">{stats?.totalProperties || 0}</div>
              <div className="stat-label">Properties ({stats?.availableProperties} Avail, {stats?.rentedProperties} Rented)</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
              <FileText size={24} />
            </div>
            <div>
              <div className="stat-value">{stats?.totalBookings || 0}</div>
              <div className="stat-label">Total Bookings ({stats?.pendingRequests} Pending)</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f0fdfa', color: '#0d9488' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div className="stat-value">{formatRent(stats?.totalRevenue || 0)}</div>
              <div className="stat-label">Platform Gross Revenue</div>
            </div>
          </div>
        </div>

        {/* Analytics Distribution Cards */}
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          {/* Properties by City */}
          <div className="card" style={{ background: '#fff' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
              Properties by City
            </h3>
            {stats?.propertiesByCity && Object.keys(stats.propertiesByCity).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {Object.entries(stats.propertiesByCity).map(([city, count]) => {
                  const percent = Math.round((count / (stats.totalProperties || 1)) * 100);
                  return (
                    <div key={city}>
                      <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: '600', color: '#334155' }}>{city}</span>
                        <span style={{ color: '#64748b' }}>{count} listings ({percent}%)</span>
                      </div>
                      <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percent}%`, background: '#1e3a8a', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: '#64748b' }}>No data available</p>
            )}
          </div>

          {/* Properties by Type */}
          <div className="card" style={{ background: '#fff' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
              Properties by Category
            </h3>
            {stats?.propertiesByType && Object.keys(stats.propertiesByType).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {Object.entries(stats.propertiesByType).map(([ptype, count]) => {
                  const percent = Math.round((count / (stats.totalProperties || 1)) * 100);
                  return (
                    <div key={ptype}>
                      <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: '600', color: '#334155' }}>{ptype}</span>
                        <span style={{ color: '#64748b' }}>{count} units ({percent}%)</span>
                      </div>
                      <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percent}%`, background: '#0d9488', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: '#64748b' }}>No data available</p>
            )}
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="card" style={{ background: '#fff' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
            Quick Admin Operations
          </h3>
          <div className="grid-3">
            <Link to="/admin/users" className="card" style={{ background: '#f8fafc', padding: '1.25rem' }}>
              <Users size={22} color="#1e3a8a" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>Manage Users</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Review tenants & landlords, toggle account access</p>
            </Link>

            <Link to="/admin/properties" className="card" style={{ background: '#f8fafc', padding: '1.25rem' }}>
              <Building2 size={22} color="#0d9488" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>Moderate Properties</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Inspect property descriptions, pricing, and remove spam</p>
            </Link>

            <Link to="/admin/bookings" className="card" style={{ background: '#f8fafc', padding: '1.25rem' }}>
              <FileText size={22} color="#d97706" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>Audit Bookings</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Monitor rental workflows, approvals, and demo payments</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
