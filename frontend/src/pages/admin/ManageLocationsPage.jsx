import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { locationsApi } from '../../api/commonApi';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';

export const ManageLocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLocationName, setNewLocationName] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const { showToast } = useNotification();

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await locationsApi.getAll();
      setLocations(data);
    } catch (err) {
      showToast('Error loading campus locations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newLocationName.trim()) return;

    setCreating(true);
    try {
      await locationsApi.create({ name: newLocationName.trim() });
      showToast('Location created successfully.', 'success');
      setNewLocationName('');
      fetchLocations();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create location.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleStartEdit = (loc) => {
    setEditingId(loc.locationID);
    setEditName(loc.name);
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await locationsApi.update(id, { name: editName.trim() });
      showToast('Location updated successfully.', 'success');
      setEditingId(null);
      fetchLocations();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update location.', 'error');
    }
  };

  const handleDelete = async (id, name, reportsCount) => {
    if (reportsCount > 0) {
      showToast(`Cannot delete location "${name}" because ${reportsCount} reports are currently assigned to it.`, 'error');
      return;
    }
    if (!window.confirm(`Delete location "${name}"?`)) return;

    try {
      await locationsApi.delete(id);
      showToast('Location deleted successfully.', 'success');
      setLocations((prev) => prev.filter((l) => l.locationID !== id));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete location.', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-lg" style={{ color: 'var(--navy-900)' }}>
          Manage Campus Locations
        </h1>
        <p className="subtitle">
          Configure university buildings, dining halls, libraries, parking structures, and outdoor grounds.
        </p>
      </div>

      {/* Add New Location Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
          Add New Campus Location
        </h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Biomedical Sciences Hall (3rd Floor)..."
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={creating} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={16} />
            <span>{creating ? 'Adding...' : 'Add Location'}</span>
          </button>
        </form>
      </div>

      {/* Locations List */}
      <div className="card" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
        {loading ? (
          <LoadingSpinner text="Loading campus locations..." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-600)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Location Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Associated Reports</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((l) => (
                <tr key={l.locationID} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    {editingId === l.locationID ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(l.locationID)}
                          className="btn btn-sm btn-success"
                          style={{ padding: '0.35rem 0.6rem' }}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="btn btn-sm btn-ghost"
                          style={{ padding: '0.35rem 0.6rem' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={15} style={{ color: 'var(--blue-600)' }} />
                        <strong style={{ color: 'var(--navy-900)' }}>{l.name}</strong>
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-active">{l.reportsCount} items</span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(l)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--blue-600)', padding: '0.4rem' }}
                        title="Edit Location Name"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(l.locationID, l.name, l.reportsCount)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#ef4444', padding: '0.4rem' }}
                        title="Delete Location"
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
    </div>
  );
};
