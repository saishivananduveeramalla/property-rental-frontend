import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, Search, ArrowLeft, Shield, User, Building2, Trash2, Power } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = roleFilter !== 'ALL' ? `/users?role=${roleFilter}` : '/users';
      const res = await api.get(url);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, name, isEnabled) => {
    const action = isEnabled ? 'disable' : 'enable';
    if (!window.confirm(`Are you sure you want to ${action} user "${name}"?`)) return;
    try {
      const res = await api.put(`/users/${id}/toggle-status`);
      setUsers(users.map(u => u.id === id ? res.data : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? All associated properties and records will be affected.`)) {
      return;
    }
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.phone.includes(term);
  });

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
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Manage Users</h1>
            <p style={{ color: '#64748b' }}>Audit registered tenants, property owners, and administrators</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.2rem', minWidth: '240px' }}
              />
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {[
            { id: 'ALL', label: 'All Users' },
            { id: 'ROLE_TENANT', label: 'Tenants' },
            { id: 'ROLE_OWNER', label: 'Property Owners' },
            { id: 'ROLE_ADMIN', label: 'Administrators' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`btn btn-sm ${roleFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Users Table */}
        <div className="card" style={{ background: '#fff' }}>
          {loading ? (
            <div className="flex-center" style={{ minHeight: '300px' }}>
              <div className="spinner"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
              <Users size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>No users found</h3>
              <p>Try clearing search keywords or choosing a different role filter.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>User Profile</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Account Status</th>
                    <th>Joined Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td style={{ color: '#64748b', fontWeight: '600' }}>#{u.id}</td>

                      <td>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{u.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                      </td>

                      <td>
                        {u.role === 'ROLE_ADMIN' ? (
                          <span className="badge badge-primary">
                            <Shield size={12} /> Admin
                          </span>
                        ) : u.role === 'ROLE_OWNER' ? (
                          <span className="badge badge-warning">
                            <Building2 size={12} /> Owner
                          </span>
                        ) : (
                          <span className="badge badge-secondary">
                            <User size={12} /> Tenant
                          </span>
                        )}
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>{u.phone}</td>

                      <td>
                        <span className={`badge ${u.enabled ? 'badge-success' : 'badge-danger'}`}>
                          {u.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </td>

                      <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td>
                        {u.role !== 'ROLE_ADMIN' ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleToggleStatus(u.id, u.name, u.enabled)}
                              className={`btn btn-sm ${u.enabled ? 'btn-secondary' : 'btn-success'}`}
                              title={u.enabled ? 'Disable user' : 'Enable user'}
                            >
                              <Power size={13} />
                              <span>{u.enabled ? 'Disable' : 'Enable'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="btn btn-outline-danger btn-sm"
                              title="Delete user"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Protected</span>
                        )}
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
