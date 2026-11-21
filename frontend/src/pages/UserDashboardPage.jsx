import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  CheckSquare, 
  Bell, 
  PlusCircle, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Tag, 
  MapPin, 
  Calendar,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { dashboardApi } from '../api/commonApi';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getUserStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load user dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  return (
    <div style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <div className="container">
        
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--blue-600)', letterSpacing: '0.05em' }}>
              Student & Staff Portal
            </span>
            <h1 className="title-lg" style={{ color: 'var(--navy-900)', marginTop: '0.2rem' }}>
              Welcome back, {user?.username}!
            </h1>
            <p className="subtitle">
              Manage your lost and found submissions, check match updates, and view your ownership claims.
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

        {/* Statistic Cards */}
        <div className="grid-cols-4" style={{ marginBottom: '2.5rem' }}>
          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--lost-bg)', color: 'var(--lost-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1.1 }}>
                {stats?.myLostReports || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>My Lost Reports</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--found-bg)', color: 'var(--found-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1.1 }}>
                {stats?.myFoundReports || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>My Found Reports</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1.1 }}>
                {stats?.myPendingClaims || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Pending Claims</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1.1 }}>
                {stats?.myApprovedClaims || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Approved Claims</div>
            </div>
          </div>
        </div>

        {/* Two Columns: My Recent Reports & My Recent Claims */}
        <div className="grid-cols-2" style={{ gap: '2rem' }}>
          
          {/* Column 1: Recent Reports */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--slate-100)' }}>
              <h2 className="title-md" style={{ fontSize: '1.1rem' }}>My Recent Reports</h2>
              <Link to="/my-reports" style={{ fontSize: '0.825rem', color: 'var(--blue-600)', fontWeight: 700 }}>
                View All
              </Link>
            </div>

            {stats?.myRecentReports?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--slate-400)', fontSize: '0.875rem' }}>
                You have not submitted any lost or found reports yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {stats?.myRecentReports?.map((r) => (
                  <div
                    key={r.reportID}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--slate-50)',
                      border: '1px solid var(--slate-200)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className={`badge ${r.type?.toLowerCase() === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                          {r.type}
                        </span>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.title}
                        </h4>
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', display: 'flex', gap: '0.75rem' }}>
                        <span><MapPin size={12} /> {r.locationName}</span>
                        <span><Calendar size={12} /> {new Date(r.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link to={`/items/${r.reportID}`} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.65rem', flexShrink: 0 }}>
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Recent Claims */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--slate-100)' }}>
              <h2 className="title-md" style={{ fontSize: '1.1rem' }}>My Ownership Claims</h2>
              <Link to="/my-claims" style={{ fontSize: '0.825rem', color: 'var(--blue-600)', fontWeight: 700 }}>
                View All
              </Link>
            </div>

            {stats?.myRecentClaims?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--slate-400)', fontSize: '0.875rem' }}>
                You have not submitted any ownership claims yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {stats?.myRecentClaims?.map((c) => (
                  <div
                    key={c.claimID}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--slate-50)',
                      border: '1px solid var(--slate-200)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span
                          className={`badge ${
                            c.status === 'Approved'
                              ? 'badge-approved'
                              : c.status === 'Rejected'
                              ? 'badge-rejected'
                              : 'badge-pending'
                          }`}
                        >
                          {c.status}
                        </span>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.reportTitle}
                        </h4>
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>
                        Claimed on {new Date(c.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Link to="/my-claims" className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.65rem', flexShrink: 0 }}>
                      Status
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
