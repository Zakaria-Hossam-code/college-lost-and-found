import React from 'react';
import { SearchX, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  title = 'No reports found',
  description = 'Try adjusting your search criteria, filters, or report a new item.',
  actionText,
  actionLink,
  onAction,
  icon: Icon = SearchX,
}) => {
  return (
    <div
      className="card"
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--slate-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--slate-400)',
          marginBottom: '1rem',
        }}
      >
        <Icon size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', maxWidth: '420px', marginBottom: '1.5rem' }}>
        {description}
      </p>

      {actionText && (
        actionLink ? (
          <Link to={actionLink} className="btn btn-primary">
            {actionText}
          </Link>
        ) : (
          <button type="button" onClick={onAction} className="btn btn-primary">
            {actionText}
          </button>
        )
      )}
    </div>
  );
};
