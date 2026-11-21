import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Archive, 
  Clock, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Tag
} from 'lucide-react';
import { reportsApi } from '../../api/reportsApi';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';

export const UnclaimedItemsPage = () => {
  const [unclaimed, setUnclaimed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daysOld, setDaysOld] = useState(14);
  const { showToast } = useNotification();

  const fetchUnclaimed = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reportsApi.getUnclaimed(daysOld);
      setUnclaimed(data);
    } catch (err) {
      console.error('Failed to load unclaimed items:', err);
      showToast('Error loading unclaimed inventory.', 'error');
    } finally {
      setLoading(false);
    }
  }, [daysOld, showToast]);

  useEffect(() => {
    fetchUnclaimed();
  }, [fetchUnclaimed]);

  const handleResolveDisposition = async (id, title) => {
    if (!window.confirm(`Mark "${title}" as Resolved/Archived (e.g. donated or campus surplus)?`)) return;
    try {
      const report = unclaimed.find((u) => u.reportID === id);
      if (!report) return;

      await reportsApi.update(id, {
        title: report.title,
        description: report.description,
        status: 'Resolved',
        categoryID: report.categoryID,
        locationID: report.locationID,
        date: report.date,
        photo: report.photo,
      });

      setUnclaimed((prev) => prev.filter((u) => u.reportID !== id));
      showToast(`Item "${title}" marked as Resolved.`, 'success');
    } catch (err) {
      showToast('Failed to update item disposition.', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 className="title-lg" style={{ color: 'var(--navy-900)' }}>
            Manage Unclaimed Inventory
          </h1>
          <p className="subtitle">
            Monitor found items that have remained in university custody without verified claims beyond statutory retention periods.
          </p>
        </div>

        {/* Retention Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--slate-100)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-md)' }}>
          <Clock size={16} style={{ color: 'var(--slate-500)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-700)' }}>Retention Age:</span>
          <select
            value={daysOld}
            onChange={(e) => setDaysOld(Number(e.target.value))}
            className="form-select"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
          >
            <option value={7}>&gt; 7 Days</option>
            <option value={14}>&gt; 14 Days (Standard)</option>
            <option value={30}>&gt; 30 Days (Surplus Ready)</option>
            <option value={60}>&gt; 60 Days (Disposal/Donation)</option>
          </select>
        </div>
      </div>

      {/* Info Alert */}
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#1e40af',
          fontSize: '0.875rem',
        }}
      >
        <AlertTriangle size={20} style={{ flexShrink: 0, color: '#3b82f6' }} />
        <span>
          University policy mandates holding found items for at least 30 calendar days before forwarding to campus surplus, charity donation, or official disposal.
        </span>
      </div>

      {/* List */}
      <div className="card" style={{ backgroundColor: '#ffffff', overflowX: 'auto' }}>
        {loading ? (
          <LoadingSpinner text="Scanning unclaimed inventory..." />
        ) : unclaimed.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--slate-400)' }}>
            No unclaimed items found matching the {daysOld}-day retention threshold.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-600)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Property</th>
                <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem' }}>Storage Custody Location</th>
                <th style={{ padding: '0.85rem 1rem' }}>Date Logged</th>
                <th style={{ padding: '0.85rem 1rem' }}>Days in Storage</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Disposition Action</th>
              </tr>
            </thead>
            <tbody>
              {unclaimed.map((item) => {
                const daysStored = Math.floor((new Date() - new Date(item.date)) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={item.reportID} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {item.photo && (
                          <img src={item.photo} alt={item.title} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        )}
                        <div>
                          <strong style={{ color: 'var(--navy-900)' }}>{item.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', display: 'block' }}>ID #{item.reportID}</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>{item.categoryName}</td>
                    <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>{item.locationName}</td>
                    <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>{new Date(item.date).toLocaleDateString()}</td>
                    
                    <td style={{ padding: '1rem' }}>
                      <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                        {daysStored} days
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Link to={`/items/${item.reportID}`} className="btn btn-ghost btn-sm" title="View Report">
                          <ExternalLink size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleResolveDisposition(item.reportID, item.title)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.8rem', color: 'var(--blue-600)' }}
                        >
                          Mark Donated/Resolved
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
