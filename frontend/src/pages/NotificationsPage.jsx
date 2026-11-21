import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Sparkles, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { EmptyState } from '../components/EmptyState';

export const NotificationsPage = () => {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, unreadCount } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = (n) => {
    markAsRead(n.notificationID);
    if (n.linkUrl) {
      navigate(n.linkUrl);
    }
  };

  return (
    <div style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="title-lg" style={{ color: 'var(--navy-900)' }}>
              Notifications & Alerts
            </h1>
            <p className="subtitle">
              System alerts for possible matches, claim verifications, and report updates.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.4rem', fontWeight: 600 }}
            >
              <CheckCheck size={16} />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <EmptyState
            title="You have no notifications yet"
            description="We'll notify you whenever a found item matches your lost report or an administrator reviews your claim."
            icon={Bell}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map((n) => {
              const isMatch = n.type === 'Match';
              const isApproved = n.type === 'ClaimApproved';

              return (
                <div
                  key={n.notificationID}
                  onClick={() => handleNotificationClick(n)}
                  className="card card-interactive"
                  style={{
                    padding: '1.25rem',
                    backgroundColor: n.isRead ? '#ffffff' : '#f0f9ff',
                    border: n.isRead ? '1px solid var(--slate-200)' : '1px solid #bae6fd',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isMatch ? 'var(--blue-50)' : isApproved ? 'var(--found-bg)' : 'var(--slate-100)',
                      color: isMatch ? 'var(--blue-600)' : isApproved ? 'var(--found-primary)' : 'var(--slate-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isMatch ? <Sparkles size={20} /> : isApproved ? <ShieldCheck size={20} /> : <Bell size={20} />}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: isMatch ? 'var(--blue-600)' : 'var(--slate-400)', letterSpacing: '0.04em' }}>
                        {n.type}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                        {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--slate-800)', lineHeight: 1.45, fontWeight: n.isRead ? 400 : 600 }}>
                      {n.message}
                    </p>

                    {n.linkUrl && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--blue-600)', fontWeight: 600 }}>
                        <span>Click to view details</span>
                        <ExternalLink size={13} />
                      </div>
                    )}
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <div
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--blue-600)',
                        flexShrink: 0,
                        marginTop: '6px',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
