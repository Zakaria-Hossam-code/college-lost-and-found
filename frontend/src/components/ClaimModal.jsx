import React, { useState } from 'react';
import { X, ShieldCheck, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { claimsApi } from '../api/claimsApi';
import { reportsApi } from '../api/reportsApi';
import { useNotification } from '../context/NotificationContext';

export const ClaimModal = ({ report, isOpen, onClose, onClaimSubmitted }) => {
  const [proof, setProof] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useNotification();

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const res = await reportsApi.uploadPhoto(file);
      setPhotoUrl(res.url);
      showToast('Supporting photo uploaded', 'success');
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proof.trim() || proof.trim().length < 10) {
      setError('Please provide detailed proof of ownership (minimum 10 characters).');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await claimsApi.create({
        reportID: report.reportID,
        proof: proof.trim(),
        photo: photoUrl || null,
      });

      showToast('Ownership claim submitted successfully! An administrator will review your claim.', 'success');
      onClaimSubmitted?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit claim. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--slate-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--slate-50)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ color: 'var(--blue-600)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                Submit Ownership Claim
              </h3>
              <span style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>
                Item: {report.title}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '0.4rem', color: 'var(--slate-400)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div
            style={{
              padding: '0.85rem',
              backgroundColor: 'var(--blue-50)',
              border: '1px solid var(--blue-100)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.825rem',
              color: 'var(--navy-900)',
              lineHeight: 1.45,
            }}
          >
            <strong>Verification Policy:</strong> To prevent false claims, campus administrators verify specific ownership details before releasing found property. Please describe features not obvious from public photos (e.g., serial numbers, stickers, scratches, case contents, or passcode/wallpaper details).
          </div>

          {/* Proof description */}
          <div className="form-group">
            <label className="form-label">
              Proof of Ownership Details <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              className="form-textarea"
              rows={4}
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              placeholder="e.g. The serial number is Apple C02..., or it has a small scratch near the camera, or it was inside a red pouch with keys..."
              required
            />
          </div>

          {/* Supporting photo */}
          <div className="form-group">
            <label className="form-label">Supporting Photo / Receipt (Optional)</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Paste image URL or upload below..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <label className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.65rem 1rem' }}>
                <Upload size={16} />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            {uploading && <span style={{ fontSize: '0.75rem', color: 'var(--blue-600)', marginTop: '0.35rem', display: 'block' }}>Uploading image...</span>}
            {photoUrl && (
              <div style={{ marginTop: '0.75rem' }}>
                <img
                  src={photoUrl}
                  alt="Proof preview"
                  style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="btn btn-primary"
              style={{ minWidth: '140px' }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                'Submit Claim'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
