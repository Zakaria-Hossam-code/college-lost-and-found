import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowRight, ImageOff } from 'lucide-react';

export const ItemCard = ({ report }) => {
  const isLost = report.type?.toLowerCase() === 'lost';
  const formattedDate = new Date(report.date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Thumbnail */}
      <div
        style={{
          height: '180px',
          width: '100%',
          backgroundColor: '#e2e8f0',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {report.photo ? (
          <img
            src={report.photo}
            alt={report.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;gap:6px;color:#94a3b8;font-size:0.85rem;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> No image</div>';
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-400)' }}>
            <ImageOff size={28} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>No image provided</span>
          </div>
        )}

        {/* Type Badge Floating */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            {isLost ? '• Lost Item' : '• Found Item'}
          </span>
        </div>

        {/* Status Badge Floating */}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <span
            className={`badge ${
              report.status?.toLowerCase() === 'active'
                ? 'badge-active'
                : report.status?.toLowerCase() === 'claimed' || report.status?.toLowerCase() === 'resolved'
                ? 'badge-approved'
                : 'badge-pending'
            }`}
          >
            {report.status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--blue-600)', fontWeight: 700, marginBottom: '0.4rem' }}>
          <Tag size={13} />
          <span>{report.categoryName || 'General'}</span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--navy-900)',
            marginBottom: '0.5rem',
            lineHeight: 1.35,
          }}
        >
          {report.title}
        </h3>

        {/* Description Snippet */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--slate-600)',
            marginBottom: '1rem',
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {report.description}
        </p>

        {/* Metadata Footer */}
        <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--slate-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
              <MapPin size={14} style={{ color: 'var(--slate-400)', flexShrink: 0 }} />
              {report.locationName || 'Campus'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} style={{ color: 'var(--slate-400)' }} />
              {formattedDate}
            </span>
          </div>

          <Link
            to={`/items/${report.reportID}`}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'space-between', fontWeight: 700 }}
          >
            <span>View Item Details</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};
