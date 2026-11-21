import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, User, AlertCircle, Loader2, Shield, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password) {
      setError('Please enter both username/email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login({
        usernameOrEmail: usernameOrEmail.trim(),
        password,
      });

      showToast(`Welcome back, ${res.user.username}!`, 'success');
      if (res.user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userVal, passVal) => {
    setUsernameOrEmail(userVal);
    setPassword(passVal);
    setError('');
  };

  return (
    <div style={{ padding: '3.5rem 1.25rem', minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '460px', width: '100%' }}>
        
        {/* Card */}
        <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--navy-900)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <LogIn size={24} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              Sign In to CampusFind
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
              Access your college lost & found account
            </p>
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

          {/* Quick Demo Login Fillers */}
          <div
            style={{
              padding: '0.85rem',
              backgroundColor: 'var(--slate-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--slate-200)',
              marginBottom: '1.5rem',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Quick Fill Demo Accounts:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => fillCredentials('admin@college.edu', 'Admin@123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', justifyContent: 'center' }}
              >
                <Shield size={13} style={{ color: 'var(--blue-600)' }} />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('john.doe@college.edu', 'Student@123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', justifyContent: 'center' }}
              >
                <GraduationCap size={13} style={{ color: 'var(--found-primary)' }} />
                <span>Student</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. admin or john.doe@college.edu"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontWeight: 700 }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--slate-100)', fontSize: '0.875rem', color: 'var(--slate-500)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--blue-600)', fontWeight: 700 }}>
              Create Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
