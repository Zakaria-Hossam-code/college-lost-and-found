import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  AlertCircle,
  ImageOff
} from 'lucide-react';
import { reportsApi } from '../api/reportsApi';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { ClaimModal } from '../components/ClaimModal';
import { MatchCard } from '../components/MatchCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useNotification();

  const [report, setReport] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  useEffect(() => {
    const fetchItemAndMatches = async () => {
      setLoading(true);
      try {
        const itemData = await reportsApi.getById(id);
        setReport(itemData);

        // Fetch matches
        setMatchesLoading(true);
        try {
          const matchData = await reportsApi.getMatches(id);
          setMatches(matchData);
        } catch (matchErr) {
          console.error('Failed to fetch matches:', matchErr);
        } finally {
          setMatchesLoading(false);
        }
      } catch (err) {
        showToast('Report not found or unavailable.', 'error');
        navigate('/items');
      } finally {
        setLoading(false);
      }
    };

    fetchItemAndMatches();
  }, [id, navigate, showToast]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }
    try {
      await reportsApi.delete(id);
      showToast('Report deleted successfully.', 'success');
      navigate('/items');
    } catch (err) {
      showToast('Failed to delete report.', 'error');
    }
  };

  if (loading || !report) {
    return <LoadingSpinner text="Loading item details..." />;
  }

  const isOwner = user && user.userID === report.userID;
  const canModify = isOwner || isAdmin;
  const isFound = report.type?.toLowerCase() === 'found';
  const isLost = report.type?.toLowerCase() === 'lost';
  const isClaimed = report.status?.toLowerCase() === 'claimed' || report.status?.toLowerCase() === 'resolved';

  return (
    <div style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <div className="container" style={{ maxWidth: '1050px' }}>
        
        {/* Back Link */}
        <Link
          to="/items"
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '1.5rem', display: 'inline-flex', paddingLeft: 0, color: 'var(--slate-500)' }}
        >
          <ArrowLeft size={16} /> Back to Directory
        </Link>

        {/* Main Details Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '3rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            
            {/* Left: Photo / Visuals */}
            <div>
              <div
                style={{
                  width: '100%',
                  height: '380px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--slate-100)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--slate-200)',
                  position: 'relative',
                }}
              >
                {report.photo ? (
                  <img
                    src={report.photo}
                    alt={report.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--slate-400)' }}>
                    <ImageOff size={48} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>No photograph provided</span>
                  </div>
                )}

                {/* Status Badges Overlay */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '0.5rem' }}>
                  <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`} style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    {isLost ? '• Lost Property' : '• Found Property'}
                  </span>
                  <span
                    className={`badge ${
                      isClaimed ? 'badge-approved' : 'badge-active'
                    }`}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    {report.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Info, Metadata, Actions */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              
              {/* Category */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-600)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <Tag size={15} />
                <span>{report.categoryName}</span>
              </div>

              {/* Title */}
              <h1 className="title-lg" style={{ color: 'var(--navy-900)', marginBottom: '1rem', lineHeight: 1.25 }}>
                {report.title}
              </h1>

              {/* Description */}
              <div style={{ marginBottom: '1.5rem', lineHeight: 1.6, color: 'var(--slate-700)', fontSize: '0.95rem' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                  Item Description
                </h4>
                <p style={{ whiteSpace: 'pre-line' }}>{report.description}</p>
              </div>

              {/* Details List */}
              <div
                style={{
                  backgroundColor: 'var(--slate-50)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  border: '1px solid var(--slate-200)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginBottom: '1.75rem',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)' }}>
                    <MapPin size={16} /> Campus Location
                  </span>
                  <strong style={{ color: 'var(--navy-900)' }}>{report.locationName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)' }}>
                    <Calendar size={16} /> {isLost ? 'Date Lost' : 'Date Found'}
                  </span>
                  <strong style={{ color: 'var(--navy-900)' }}>
                    {new Date(report.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)' }}>
                    <User size={16} /> Reported By
                  </span>
                  <strong style={{ color: 'var(--navy-900)' }}>{report.username}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Claim Button for Found Items */}
                {isFound && !isClaimed && (
                  <div>
                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={() => setClaimModalOpen(true)}
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <ShieldCheck size={20} />
                        <span>Claim This Found Property</span>
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <ShieldCheck size={20} />
                        <span>Sign In to Claim This Item</span>
                      </Link>
                    )}
                  </div>
                )}

                {isClaimed && (
                  <div
                    style={{
                      padding: '0.85rem',
                      backgroundColor: 'var(--found-bg)',
                      border: '1px solid var(--found-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--found-text)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    ✓ This item has been verified and returned to its owner.
                  </div>
                )}

                {/* Edit / Delete actions for owner or admin */}
                {canModify && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                    >
                      <Trash2 size={15} /> Delete Report
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Possible Matches Section */}
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{ color: 'var(--blue-600)' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="title-md" style={{ color: 'var(--navy-900)' }}>
                System-Suggested Possible Matches
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                Algorithmically matching opposite {isLost ? 'found' : 'lost'} reports based on category, location, and dates.
              </p>
            </div>
          </div>

          {matchesLoading ? (
            <LoadingSpinner text="Computing similarity matches..." />
          ) : matches.length === 0 ? (
            <div
              className="card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--slate-500)',
                fontSize: '0.9rem',
                backgroundColor: '#ffffff',
              }}
            >
              No high-confidence matches found yet. The system continuously evaluates newly reported items.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
              {matches.map((m) => (
                <MatchCard key={m.matchedReport.reportID} match={m} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Claim Submission Modal */}
      <ClaimModal
        report={report}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onClaimSubmitted={() => {
          // Refresh report details
          reportsApi.getById(id).then(setReport);
        }}
      />
    </div>
  );
};
