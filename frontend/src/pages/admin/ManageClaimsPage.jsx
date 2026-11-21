import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  X, 
  Loader2,
  User,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { claimsApi } from '../../api/claimsApi';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';

export const ManageClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const { showToast } = useNotification();

  // Review & Process Modal state
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [processAction, setProcessAction] = useState(null); // 'Approve' or 'Reject'
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    try {
      const data = await claimsApi.getAll(statusFilter === 'All' ? '' : statusFilter);
      setClaims(data);
    } catch (err) {
      console.error('Failed to load claims:', err);
      showToast('Error loading claims.', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, showToast]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleOpenProcessModal = (claim, action) => {
    setSelectedClaim(claim);
    setProcessAction(action);
    setAdminNotes(action === 'Approve' ? 'Proof of ownership verified. Item ready for pickup at Lost & Found desk.' : '');
  };

  const handleProcessSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClaim || !processAction) return;

    if (processAction === 'Reject' && !adminNotes.trim()) {
      showToast('Please provide a reason for rejecting the claim.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const updated = await claimsApi.processClaim(selectedClaim.claimID, {
        status: processAction === 'Approve' ? 'Approved' : 'Rejected',
        adminNotes: adminNotes.trim(),
      });

      showToast(`Claim has been ${processAction === 'Approve' ? 'approved' : 'rejected'}. Claimant notified.`, 'success');
      setSelectedClaim(null);
      setProcessAction(null);
      fetchClaims();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to process claim.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title-lg" style={{ color: 'var(--navy-900)' }}>
            Manage Ownership Claims
          </h1>
          <p className="subtitle">
            Verify student proof of ownership, inspect evidence, approve verified claims, and manage return handovers.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', backgroundColor: 'var(--slate-100)', padding: '0.3rem', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className="btn btn-sm"
            style={{
              backgroundColor: statusFilter === status ? '#ffffff' : 'transparent',
              color: statusFilter === status ? 'var(--navy-900)' : 'var(--slate-600)',
              boxShadow: statusFilter === status ? 'var(--shadow-sm)' : 'none',
              fontWeight: 700,
            }}
          >
            {status === 'All' ? 'All Claims' : `${status} Claims`}
          </button>
        ))}
      </div>

      {/* Claims List / Table */}
      <div className="card" style={{ backgroundColor: '#ffffff', overflowX: 'auto' }}>
        {loading ? (
          <LoadingSpinner text="Fetching claims..." />
        ) : claims.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--slate-400)' }}>
            No ownership claims match the selected filter.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-600)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Item</th>
                <th style={{ padding: '0.85rem 1rem' }}>Claimant Details</th>
                <th style={{ padding: '0.85rem 1rem' }}>Proof Provided</th>
                <th style={{ padding: '0.85rem 1rem' }}>Date Submitted</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => {
                const isPending = c.status === 'Pending';
                return (
                  <tr key={c.claimID} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {c.reportPhoto ? (
                          <img src={c.reportPhoto} alt={c.reportTitle} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        ) : (
                          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-400)' }}>
                            <FileText size={18} />
                          </div>
                        )}
                        <div>
                          <strong style={{ color: 'var(--navy-900)', display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.reportTitle}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Report #{c.reportID}</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{c.claimantUsername}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{c.claimantEmail}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{c.claimantPhone}</div>
                    </td>

                    <td style={{ padding: '1rem', maxWidth: '280px' }}>
                      <p style={{ fontSize: '0.825rem', color: 'var(--slate-700)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {c.proof}
                      </p>
                      {c.photo && (
                        <a href={c.photo} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--blue-600)', fontWeight: 600 }}>
                          Attachment Included ↗
                        </a>
                      )}
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>
                      {new Date(c.createdDate).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '1rem' }}>
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
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      {isPending ? (
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenProcessModal(c, 'Approve')}
                            className="btn btn-sm btn-success"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenProcessModal(c, 'Reject')}
                            className="btn btn-sm btn-danger"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', fontStyle: 'italic' }}>
                          Processed on {c.processedAt ? new Date(c.processedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Approve / Reject Modal */}
      {selectedClaim && processAction && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {processAction === 'Approve' ? (
                  <CheckCircle2 size={22} style={{ color: '#059669' }} />
                ) : (
                  <XCircle size={22} style={{ color: '#dc2626' }} />
                )}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {processAction === 'Approve' ? 'Approve Ownership Claim' : 'Reject Ownership Claim'}
                </h3>
              </div>
              <button type="button" onClick={() => setSelectedClaim(null)} className="btn btn-ghost" style={{ padding: '0.35rem' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProcessSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--slate-200)', fontSize: '0.85rem' }}>
                <div style={{ marginBottom: '0.4rem' }}>
                  <strong>Item:</strong> {selectedClaim.reportTitle}
                </div>
                <div style={{ marginBottom: '0.4rem' }}>
                  <strong>Claimant:</strong> {selectedClaim.claimantUsername} ({selectedClaim.claimantEmail})
                </div>
                <div>
                  <strong>Proof Provided:</strong>
                  <p style={{ marginTop: '0.2rem', color: 'var(--slate-700)', fontStyle: 'italic' }}>
                    "{selectedClaim.proof}"
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {processAction === 'Approve' ? 'Handover Notes / Instructions for Owner' : 'Rejection Reason'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={
                    processAction === 'Approve'
                      ? 'e.g. Please bring your physical student ID to Student Union Suite 102...'
                      : 'e.g. Provided description and serial number do not match the physical device...'
                  }
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)' }}>
                <button type="button" onClick={() => setSelectedClaim(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`btn ${processAction === 'Approve' ? 'btn-success' : 'btn-danger'}`}
                >
                  {submitting ? 'Processing...' : `Confirm ${processAction}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
