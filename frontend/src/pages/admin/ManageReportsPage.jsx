import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  X, 
  Check, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { reportsApi } from '../../api/reportsApi';
import { categoriesApi, locationsApi } from '../../api/commonApi';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';

export const ManageReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();

  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');
  const [categoryID, setCategoryID] = useState('');

  // Edit Modal State
  const [editingReport, setEditingReport] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: '',
    categoryID: '',
    locationID: '',
    date: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchDropdowns = async () => {
    try {
      const [cats, locs] = await Promise.all([
        categoriesApi.getAll(),
        locationsApi.getAll(),
      ]);
      setCategories(cats);
      setLocations(locs);
    } catch (err) {
      console.error('Failed to load categories/locations:', err);
    }
  };

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (type !== 'All') params.type = type;
      if (status !== 'All') params.status = status;
      if (categoryID) params.categoryID = Number(categoryID);

      const data = await reportsApi.getAll(params);
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      showToast('Error loading reports.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, type, status, categoryID, showToast]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete report "${title}"?`)) return;
    try {
      await reportsApi.delete(id);
      setReports((prev) => prev.filter((r) => r.reportID !== id));
      showToast('Report deleted successfully.', 'success');
    } catch (err) {
      showToast('Failed to delete report.', 'error');
    }
  };

  const openEditModal = (r) => {
    setEditingReport(r);
    setEditForm({
      title: r.title,
      description: r.description,
      status: r.status,
      categoryID: r.categoryID,
      locationID: r.locationID,
      date: new Date(r.date).toISOString().split('T')[0],
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const updated = await reportsApi.update(editingReport.reportID, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        status: editForm.status,
        categoryID: Number(editForm.categoryID),
        locationID: Number(editForm.locationID),
        date: new Date(editForm.date).toISOString(),
        photo: editingReport.photo,
      });

      setReports((prev) =>
        prev.map((r) => (r.reportID === updated.reportID ? updated : r))
      );
      showToast('Report updated successfully.', 'success');
      setEditingReport(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update report.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-lg" style={{ color: 'var(--navy-900)' }}>
          Manage Lost & Found Reports
        </h1>
        <p className="subtitle">
          Search, audit, edit metadata, update status, and remove inappropriate submissions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.3rem' }}
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          </div>

          <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="All">All Types (Lost & Found)</option>
            <option value="Lost">Lost Property</option>
            <option value="Found">Found Property</option>
          </select>

          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Claimed">Claimed</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select className="form-select" value={categoryID} onChange={(e) => setCategoryID(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryID} value={c.categoryID}>
                {c.name}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ backgroundColor: '#ffffff', overflowX: 'auto' }}>
        {loading ? (
          <LoadingSpinner text="Fetching reports..." />
        ) : reports.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>
            No reports match the selected filters.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-600)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Item</th>
                <th style={{ padding: '0.85rem 1rem' }}>Type</th>
                <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Reporter</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.reportID} style={{ borderBottom: '1px solid var(--slate-100)', transition: 'background 0.1s' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {r.photo ? (
                        <img src={r.photo} alt={r.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-400)' }}>
                          <FileText size={18} />
                        </div>
                      )}
                      <div>
                        <strong style={{ color: 'var(--navy-900)', display: 'block', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.title}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>ID #{r.reportID}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${r.type?.toLowerCase() === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                      {r.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>{r.categoryName}</td>
                  <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>{r.locationName}</td>
                  <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>{new Date(r.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${r.status?.toLowerCase() === 'claimed' ? 'badge-approved' : 'badge-active'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>
                    <div>{r.username}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{r.userEmail}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <Link to={`/items/${r.reportID}`} className="btn btn-ghost btn-sm" title="View Public Page">
                        <ExternalLink size={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(r)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--blue-600)' }}
                        title="Edit Report"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.reportID, r.title)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#ef4444' }}
                        title="Delete Report"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editingReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                Edit Report #{editingReport.reportID}
              </h3>
              <button type="button" onClick={() => setEditingReport(null)} className="btn btn-ghost" style={{ padding: '0.35rem' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="PendingClaim">Pending Claim</option>
                    <option value="Claimed">Claimed</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={editForm.categoryID}
                    onChange={(e) => setEditForm({ ...editForm, categoryID: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.categoryID} value={c.categoryID}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <select
                    className="form-select"
                    value={editForm.locationID}
                    onChange={(e) => setEditForm({ ...editForm, locationID: e.target.value })}
                  >
                    {locations.map((l) => (
                      <option key={l.locationID} value={l.locationID}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)' }}>
                <button type="button" onClick={() => setEditingReport(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={savingEdit} className="btn btn-primary">
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
