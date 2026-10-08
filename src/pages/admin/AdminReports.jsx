import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { BarChart3, ArrowLeft, Printer, Building2, Users, FileText, DollarSign } from 'lucide-react';

export const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div className="flex-between no-print" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <ArrowLeft size={16} />
              <span>Back to Admin Dashboard</span>
            </Link>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>System Reports & Analytics</h1>
            <p style={{ color: '#64748b' }}>Comprehensive statistical breakdown of the Property Rental platform</p>
          </div>

          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} />
            <span>Print Report</span>
          </button>
        </div>

        {/* Printable Report Document */}
        <div className="card receipt-printable" style={{ background: '#fff', padding: '2.5rem' }}>
          <div style={{ borderBottom: '2px solid #1e3a8a', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1e3a8a' }}>Property Rental System - Comprehensive Executive Report</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Generated on {new Date().toLocaleString()} • College Project Evaluation Demonstration
            </p>
          </div>

          {/* KPI Summary Table */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
              1. Platform Executive Metrics
            </h3>
            <div className="grid-4">
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Users</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e3a8a' }}>{stats?.totalUsers || 0}</div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{stats?.totalTenants} Tenants | {stats?.totalOwners} Owners</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Properties</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#16a34a' }}>{stats?.totalProperties || 0}</div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{stats?.availableProperties} Active | {stats?.rentedProperties} Occupied</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Rental Applications</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#d97706' }}>{stats?.totalBookings || 0}</div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{stats?.completedRentals} Confirmed Leases</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Platform Gross Value</span>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0d9488' }}>{formatRent(stats?.totalRevenue || 0)}</div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Simulated Transactions</span>
              </div>
            </div>
          </div>

          {/* Regional Market Share */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
              2. Geographic City Distribution
            </h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>City / Region</th>
                  <th>Total Properties Listed</th>
                  <th>Share of Platform</th>
                </tr>
              </thead>
              <tbody>
                {stats?.propertiesByCity && Object.entries(stats.propertiesByCity).map(([city, count]) => {
                  const percent = Math.round((count / (stats.totalProperties || 1)) * 100);
                  return (
                    <tr key={city}>
                      <td style={{ fontWeight: '600' }}>{city}</td>
                      <td>{count} units</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ height: '8px', width: '120px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${percent}%`, background: '#1e3a8a' }}></div>
                          </div>
                          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{percent}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Property Category Breakdown */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
              3. Inventory by Property Type
            </h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Inventory Count</th>
                  <th>Share of Inventory</th>
                </tr>
              </thead>
              <tbody>
                {stats?.propertiesByType && Object.entries(stats.propertiesByType).map(([ptype, count]) => {
                  const percent = Math.round((count / (stats.totalProperties || 1)) * 100);
                  return (
                    <tr key={ptype}>
                      <td style={{ fontWeight: '600' }}>{ptype}</td>
                      <td>{count} units</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ height: '8px', width: '120px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${percent}%`, background: '#0d9488' }}></div>
                          </div>
                          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{percent}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Booking Pipeline Status */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
              4. Rental Request Workflow Pipeline
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div style={{ border: '1px solid #fde68a', background: '#fffbeb', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: '600' }}>PENDING</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#b45309' }}>{stats?.pendingRequests || 0}</div>
              </div>

              <div style={{ border: '1px solid #bfdbfe', background: '#eff6ff', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: '600' }}>APPROVED</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2563eb' }}>{stats?.approvedRentals || 0}</div>
              </div>

              <div style={{ border: '1px solid #a7f3d0', background: '#ecfdf5', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: '600' }}>COMPLETED</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{stats?.completedRentals || 0}</div>
              </div>

              <div style={{ border: '1px solid #cbd5e1', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>TOTAL REQUESTS</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{stats?.totalBookings || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
