import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  PlusCircle, 
  MapPin, 
  Calendar, 
  Tag, 
  Trash2, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { reportsApi } from '../api/reportsApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { useNotification } from '../context/NotificationContext';

export const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All'); // 'All', 'Lost', 'Found'
  const { showToast } = useNotification();

  const fetchMyReports = async () => {
    setLoading(true);
    try {
      const data = await reportsApi.getMyReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load my reports:', err);
      showToast('Error loading your reports.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await reportsApi.delete(id);
      setReports((prev) => prev.filter((r) => r.reportID !== id));
      showToast('Report deleted successfully.', 'success');
    } catch (err) {
      showToast('Failed to delete report.', 'error');
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterType === 'All') return true;
    return r.type?.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 className="title-lg" style={{ color: 'var(--navy-900)' }}>
              My Submitted Reports
            </h1>
            <p className="subtitle">
              Manage your personal lost belongings and items you've turned in on campus.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/report-lost" className="btn btn-primary btn-sm">
              <PlusCircle size={15} style={{ color: '#fbbf24' }} /> Report Lost Item
            </Link>
            <Link to="/report-found" className="btn btn-secondary btn-sm">
              <CheckCircle2 size={15} style={{ color: 'var(--found-primary)' }} /> Report Found Item
            </Link>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', backgroundColor: 'var(--slate-100)', padding: '0.3rem', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
          {['All', 'Lost', 'Found'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className="btn btn-sm"
              style={{
                backgroundColor: filterType === t ? '#ffffff' : 'transparent',
                color: filterType === t ? 'var(--navy-900)' : 'var(--slate-600)',
                boxShadow: filterType === t ? 'var(--shadow-sm)' : 'none',
                fontWeight: 700,
              }}
            >
              {t === 'All' ? 'All Reports' : t === 'Lost' ? 'Lost Items' : 'Found Items'}
            </button>
          ))}
        </div>

        {/* List of Reports */}
        {loading ? (
          <LoadingSpinner text="Fetching your reports..." />
        ) : filteredReports.length === 0 ? (
          <EmptyState
            title="No reports submitted yet"
            description="You haven't filed any reports in this category yet. Click below to report a lost or found item."
            actionText="Report a Lost Item"
            actionLink="/report-lost"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredReports.map((r) => {
              const isLost = r.type?.toLowerCase() === 'lost';
              return (
                <div
                  key={r.reportID}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    flexWrap: 'wrap',
                    backgroundColor: '#ffffff',
                  }}
                >
                  {/* Photo thumbnail */}
                  {r.photo ? (
                    <img
                      src={r.photo}
                      alt={r.title}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--slate-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--slate-400)',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={28} />
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: '1 1 280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
                        {r.type}
                      </span>
                      <span className="badge badge-active">{r.status}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--blue-600)', fontWeight: 700 }}>
                        {r.categoryName}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.35rem' }}>
                      {r.title}
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} /> {r.locationName}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} /> Reported on {new Date(r.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginLeft: 'auto' }}>
                    <Link
                      to={`/items/${r.reportID}`}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.4rem', fontWeight: 700 }}
                    >
                      <Sparkles size={14} style={{ color: 'var(--blue-600)' }} />
                      <span>Matches & Details</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(r.reportID)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#ef4444', padding: '0.45rem' }}
                      title="Delete Report"
                    >
                      <Trash2 size={16} />
                    </button>
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
