import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

export const MatchCard = ({ match }) => {
  const { matchedReport, similarityScore, matchReasons } = match;

  const getScoreColor = (score) => {
    if (score >= 80) return '#059669'; // High emerald
    if (score >= 60) return '#0284c7'; // Medium blue
    return '#d97706'; // Moderate amber
  };

  const scoreColor = getScoreColor(similarityScore);

  return (
    <div
      className="card"
      style={{
        border: `1px solid ${scoreColor}40`,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Match Score Header */}
      <div
        style={{
          padding: '0.75rem 1rem',
          background: `linear-gradient(90deg, ${scoreColor}15, #f8fafc)`,
          borderBottom: '1px solid var(--slate-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} style={{ color: scoreColor }} />
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: scoreColor }}>
            {similarityScore}% Match Confidence
          </span>
        </div>
        <span className={`badge ${matchedReport.type?.toLowerCase() === 'lost' ? 'badge-lost' : 'badge-found'}`}>
          {matchedReport.type}
        </span>
      </div>

      {/* Item info */}
      <div style={{ padding: '1rem', display: 'flex', gap: '1rem', flex: 1 }}>
        {matchedReport.photo && (
          <img
            src={matchedReport.photo}
            alt={matchedReport.title}
            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.35rem' }}>
            {matchedReport.title}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={13} /> {matchedReport.locationName}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={13} /> {new Date(matchedReport.date).toLocaleDateString()}
            </span>
          </div>

          {/* Match reasons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
            {matchReasons.map((reason, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--slate-100)',
                  color: 'var(--slate-700)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <CheckCircle2 size={11} style={{ color: scoreColor }} />
                {reason}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--slate-100)', background: 'var(--slate-50)' }}>
        <Link
          to={`/items/${matchedReport.reportID}`}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.825rem' }}
        >
          <span>Compare Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
