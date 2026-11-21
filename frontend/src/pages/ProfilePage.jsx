import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Shield, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authApi } from '../api/authApi';

export const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const { showToast } = useNotification();

  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        email: email.trim(),
        phone: phone.trim(),
      };

      if (newPassword) {
        if (!currentPassword) {
          setError('Please provide your current password to set a new password.');
          setLoading(false);
          return;
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      await authApi.updateProfile(payload);
      await refreshProfile();
      showToast('Profile updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 1.25rem 5rem' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="card" style={{ padding: '2.5rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-xl)' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--slate-100)' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--navy-900), var(--blue-600))',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 className="title-md" style={{ color: 'var(--navy-900)' }}>
                  {user?.username}
                </h1>
                <span className={`badge ${user?.role === 'Admin' ? 'badge-found' : 'badge-active'}`}>
                  {user?.role}
                </span>
              </div>
              <span style={{ fontSize: '0.825rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Calendar size={13} /> Member since {new Date(user?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                value={user?.username || ''}
                disabled
                style={{ backgroundColor: 'var(--slate-100)', color: 'var(--slate-500)', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.25rem', display: 'block' }}>
                Usernames are university identifiers and cannot be changed.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div style={{ margin: '2rem 0 1.25rem', borderTop: '1px solid var(--slate-100)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
                Change Password (Optional)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '1.25rem' }}>
                Leave these blank if you do not want to change your password.
              </p>

              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontWeight: 700 }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                'Save Profile Changes'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
