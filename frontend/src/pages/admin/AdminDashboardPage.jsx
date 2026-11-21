import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  CheckSquare, 
  Archive, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { dashboardApi } from '../../api/commonApi';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const data = await dashboardApi.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading admin analytics..." />;
  }

  return (
    <div>
      {/* Top Bar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title-lg" style={{ color: 'var(--navy-900)' }}>
            System Administration Overview
          </h1>
          <p className="subtitle">
            Campus-wide Lost & Found real-time statistics, pending reviews, and inventory status.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid-cols-3" style={{ marginBottom: '2.5rem' }}>
        
        {/* Total Users */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--blue-50)', color: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={26} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1 }}>
              {stats?.totalUsers || 0}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.25rem' }}>
              Registered Students & Staff
            </div>
          </div>
        </div>

        {/* Pending Claims */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b45309', lineHeight: 1 }}>
              {stats?.pendingClaims || 0}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.25rem' }}>
              Pending Ownership Claims
            </div>
          </div>
          {stats?.pendingClaims > 0 && (
            <Link to="/admin/claims?status=Pending" className="btn btn-sm btn-secondary" style={{ color: '#b45309', fontWeight: 700 }}>
              Review
            </Link>
          )}
        </div>

        {/* Unclaimed Items */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', backgroundColor: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Archive size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b91c1c', lineHeight: 1 }}>
              {stats?.unclaimedItems || 0}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.25rem' }}>
              Unclaimed Items (&gt;14 days)
            </div>
          </div>
          <Link to="/admin/unclaimed" className="btn btn-sm btn-secondary" style={{ color: '#b91c1c', fontWeight: 700 }}>
            Inspect
          </Link>
        </div>

        {/* Lost Reports */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--lost-bg)', color: 'var(--lost-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={26} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1 }}>
              {stats?.totalLostReports || 0}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.25rem' }}>
              Total Lost Reports Filed
            </div>
          </div>
        </div>

        {/* Found Reports */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--found-bg)', color: 'var(--found-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1 }}>
              {stats?.totalFoundReports || 0}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.25rem' }}>
              Total Found Reports Logged
            </div>
          </div>
        </div>

        {/* Returned / Resolved */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', backgroundColor: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857', lineHeight: 1 }}>
              {stats?.returnedItems || 0}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.25rem' }}>
              Reunited Belongings
            </div>
          </div>
        </div>

      </div>

      {/* Two Administrative Tables */}
      <div className="grid-cols-2" style={{ gap: '2rem' }}>
        
        {/* Claims Needing Action */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--slate-100)' }}>
            <h2 className="title-md" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckSquare size={18} style={{ color: 'var(--blue-600)' }} />
              <span>Recent Ownership Claims</span>
            </h2>
            <Link to="/admin/claims" style={{ fontSize: '0.825rem', color: 'var(--blue-600)', fontWeight: 700 }}>
              View All Claims
            </Link>
          </div>

          {stats?.recentClaims?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
              No claims submitted yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {stats?.recentClaims?.map((c) => (
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
                      <span className={`badge ${c.status === 'Approved' ? 'badge-approved' : c.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                        {c.status}
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--navy-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.reportTitle}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      Claimed by {c.claimantUsername} ({c.claimantEmail}) on {new Date(c.createdDate).toLocaleDateString()}
                    </div>
                  </div>

                  <Link to="/admin/claims" className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.65rem' }}>
                    Process
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--slate-100)' }}>
            <h2 className="title-md" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} style={{ color: 'var(--blue-600)' }} />
              <span>Recent Report Activity</span>
            </h2>
            <Link to="/admin/reports" style={{ fontSize: '0.825rem', color: 'var(--blue-600)', fontWeight: 700 }}>
              Manage All
            </Link>
          </div>

          {stats?.recentReports?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
              No reports filed yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {stats?.recentReports?.map((r) => (
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
                      <strong style={{ fontSize: '0.9rem', color: 'var(--navy-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.title}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'flex', gap: '0.75rem' }}>
                      <span><MapPin size={12} /> {r.locationName}</span>
                      <span><Calendar size={12} /> {new Date(r.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Link to={`/items/${r.reportID}`} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.65rem' }}>
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
