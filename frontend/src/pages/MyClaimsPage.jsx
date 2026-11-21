import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { claimsApi } from '../api/claimsApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { useNotification } from '../context/NotificationContext';

export const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const data = await claimsApi.getMyClaims();
      setClaims(data);
    } catch (err) {
      console.error('Failed to load claims:', err);
      showToast('Error loading your ownership claims.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <div style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="title-lg" style={{ color: 'var(--navy-900)' }}>
            My Ownership Claims
          </h1>
          <p className="subtitle">
            Track the verification progress and administrator decisions for found property you claimed.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your claims..." />
        ) : claims.length === 0 ? (
          <EmptyState
            title="No claims submitted yet"
            description="If you see your lost item in the Found directory, click 'Claim This Item' on its details page."
            actionText="Browse Found Items"
            actionLink="/items?type=Found"
            icon={CheckSquare}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {claims.map((claim) => {
              const isApproved = claim.status === 'Approved';
              const isRejected = claim.status === 'Rejected';
              const isPending = claim.status === 'Pending';

              return (
                <div
                  key={claim.claimID}
                  className="card"
                  style={{
                    backgroundColor: '#ffffff',
                    border: isApproved
                      ? '1px solid #a7f3d0'
                      : isRejected
                      ? '1px solid #fecaca'
                      : '1px solid var(--slate-200)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Status Banner */}
                  <div
                    style={{
                      padding: '0.75rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isApproved
                        ? 'var(--found-bg)'
                        : isRejected
                        ? '#fee2e2'
                        : '#fef3c7',
                      borderBottom: '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem' }}>
                      {isApproved && <CheckCircle2 size={16} style={{ color: '#059669' }} />}
                      {isRejected && <XCircle size={16} style={{ color: '#dc2626' }} />}
                      {isPending && <Clock size={16} style={{ color: '#d97706' }} />}

                      <span
                        style={{
                          color: isApproved ? '#047857' : isRejected ? '#b91c1c' : '#b45309',
                        }}
                      >
                        Claim Status: {claim.status.toUpperCase()}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      Submitted {new Date(claim.createdDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      {/* Photo preview */}
                      {claim.reportPhoto && (
                        <img
                          src={claim.reportPhoto}
                          alt={claim.reportTitle}
                          style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
                        />
                      )}

                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.35rem' }}>
                          {claim.reportTitle}
                        </h3>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <MapPin size={13} /> {claim.locationName}
                          </span>
                          <span>Category: {claim.categoryName}</span>
                        </div>

                        {/* Proof snippet */}
                        <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid var(--slate-200)' }}>
                          <strong style={{ color: 'var(--slate-700)', display: 'block', marginBottom: '0.2rem' }}>
                            Your Submitted Proof:
                          </strong>
                          <p style={{ color: 'var(--slate-600)', whiteSpace: 'pre-line' }}>{claim.proof}</p>
                          {claim.photo && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <a href={claim.photo} target="_blank" rel="noreferrer" style={{ color: 'var(--blue-600)', fontWeight: 600, fontSize: '0.8rem' }}>
                                View Attached Supporting Photo ↗
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Admin Decision Notes */}
                        {isApproved && (
                          <div
                            style={{
                              padding: '1rem',
                              backgroundColor: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              borderRadius: 'var(--radius-md)',
                              color: '#065f46',
                              fontSize: '0.875rem',
                              lineHeight: 1.5,
                              marginBottom: '0.75rem',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                              <ShieldCheck size={18} />
                              <span>Handover Approved by Campus Admin</span>
                            </div>
                            <p>
                              Please bring your Student ID card to the <strong>Campus Lost & Found Office (Student Union Center, Suite 102)</strong> to pick up your property.
                            </p>
                            {claim.adminNotes && (
                              <p style={{ marginTop: '0.5rem', fontSize: '0.825rem', fontStyle: 'italic' }}>
                                Admin note: "{claim.adminNotes}"
                              </p>
                            )}
                          </div>
                        )}

                        {isRejected && claim.adminNotes && (
                          <div
                            style={{
                              padding: '0.85rem 1rem',
                              backgroundColor: '#fef2f2',
                              border: '1px solid #fecaca',
                              borderRadius: 'var(--radius-md)',
                              color: '#991b1b',
                              fontSize: '0.85rem',
                              marginBottom: '0.75rem',
                            }}
                          >
                            <strong>Admin Feedback:</strong> {claim.adminNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer link to item */}
                    <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'flex-end' }}>
                      <Link
                        to={`/items/${claim.reportID}`}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.8rem', gap: '0.35rem' }}
                      >
                        <span>View Original Report</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
