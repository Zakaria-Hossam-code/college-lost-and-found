import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  PlusCircle, 
  FileText, 
  CheckSquare, 
  LogOut, 
  Shield, 
  ChevronDown,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadCount, notifications, fetchNotifications, markAsRead } = useNotification();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenNotifs = () => {
    if (!notifMenuOpen) {
      fetchNotifications();
    }
    setNotifMenuOpen(!notifMenuOpen);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="brand-link">
          <div className="brand-badge">
            <Search size={20} strokeWidth={2.75} />
          </div>
          <div>
            <span style={{ color: '#ffffff' }}>Campus</span>
            <span style={{ color: 'var(--blue-400)' }}>Find</span>
            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--slate-400)', fontWeight: 500, letterSpacing: '0.05em' }}>
              COLLEGE LOST & FOUND
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link 
            to="/items" 
            className={`nav-link ${location.pathname === '/items' ? 'active' : ''}`}
          >
            Lost & Found
          </Link>
          <Link 
            to="/report-lost" 
            className={`nav-link ${location.pathname === '/report-lost' ? 'active' : ''}`}
            style={{ color: '#fef3c7' }}
          >
            Report Lost
          </Link>
          <Link 
            to="/report-found" 
            className={`nav-link ${location.pathname === '/report-found' ? 'active' : ''}`}
            style={{ color: '#d1fae5' }}
          >
            Report Found
          </Link>

          {isAuthenticated && (
            <Link 
              to="/dashboard" 
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              My Dashboard
            </Link>
          )}

          {isAdmin && (
            <Link 
              to="/admin/dashboard" 
              className="btn btn-sm btn-accent"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              <Shield size={14} /> Admin Portal
            </Link>
          )}
        </nav>

        {/* User Actions / Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }} ref={notifMenuRef}>
                <button
                  type="button"
                  onClick={handleOpenNotifs}
                  className="btn btn-ghost"
                  style={{
                    color: '#ffffff',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-full)',
                    position: 'relative',
                  }}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--navy-900)',
                      }}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 10px)',
                      width: '340px',
                      background: '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--slate-200)',
                      zIndex: 60,
                      overflow: 'hidden',
                      color: 'var(--slate-800)',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.85rem 1rem',
                        borderBottom: '1px solid var(--slate-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--slate-50)',
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                      <Link
                        to="/notifications"
                        onClick={() => setNotifMenuOpen(false)}
                        style={{ fontSize: '0.775rem', color: 'var(--blue-600)', fontWeight: 600 }}
                      >
                        View All
                      </Link>
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.notificationID}
                            onClick={() => {
                              markAsRead(n.notificationID);
                              if (n.linkUrl) {
                                navigate(n.linkUrl);
                                setNotifMenuOpen(false);
                              }
                            }}
                            style={{
                              padding: '0.75rem 1rem',
                              borderBottom: '1px solid var(--slate-100)',
                              backgroundColor: n.isRead ? '#ffffff' : '#f0f9ff',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease',
                            }}
                          >
                            <p style={{ fontSize: '0.825rem', color: 'var(--slate-700)', marginBottom: '0.25rem', lineHeight: 1.35 }}>
                              {n.message}
                            </p>
                            <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                              {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotifMenuOpen(false);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    padding: '0.4rem 0.75rem',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--blue-500), var(--navy-800))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.username}</span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 10px)',
                      width: '220px',
                      background: '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--slate-200)',
                      zIndex: 60,
                      padding: '0.5rem',
                      color: 'var(--slate-800)',
                    }}
                  >
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--slate-100)', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user?.username}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{user?.email}</div>
                      <div style={{ marginTop: '0.35rem' }}>
                        <span className={`badge ${isAdmin ? 'badge-found' : 'badge-active'}`}>
                          {user?.role}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="admin-nav-item"
                      style={{ color: 'var(--slate-700)', padding: '0.5rem 0.75rem' }}
                    >
                      <User size={16} /> My Dashboard
                    </Link>
                    <Link
                      to="/my-reports"
                      onClick={() => setUserMenuOpen(false)}
                      className="admin-nav-item"
                      style={{ color: 'var(--slate-700)', padding: '0.5rem 0.75rem' }}
                    >
                      <FileText size={16} /> My Reports
                    </Link>
                    <Link
                      to="/my-claims"
                      onClick={() => setUserMenuOpen(false)}
                      className="admin-nav-item"
                      style={{ color: 'var(--slate-700)', padding: '0.5rem 0.75rem' }}
                    >
                      <CheckSquare size={16} /> My Claims
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="admin-nav-item"
                      style={{ color: 'var(--slate-700)', padding: '0.5rem 0.75rem' }}
                    >
                      <User size={16} /> Profile Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="admin-nav-item"
                        style={{ color: 'var(--blue-600)', padding: '0.5rem 0.75rem', borderTop: '1px solid var(--slate-100)' }}
                      >
                        <Shield size={16} /> Admin Dashboard
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="admin-nav-item"
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        color: '#ef4444',
                        padding: '0.5rem 0.75rem',
                        borderTop: '1px solid var(--slate-100)',
                        marginTop: '0.25rem',
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-accent btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            className="btn btn-ghost"
            style={{ color: '#ffffff', padding: '0.5rem', display: 'none' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
};
