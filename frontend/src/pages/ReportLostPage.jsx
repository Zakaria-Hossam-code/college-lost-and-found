import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, AlertCircle, Loader2, Calendar, MapPin, Tag } from 'lucide-react';
import { reportsApi } from '../api/reportsApi';
import { categoriesApi, locationsApi } from '../api/commonApi';
import { useNotification } from '../context/NotificationContext';

export const ReportLostPage = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [locationID, setLocationID] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [cats, locs] = await Promise.all([
          categoriesApi.getAll(),
          locationsApi.getAll(),
        ]);
        setCategories(cats);
        setLocations(locs);
        if (cats.length > 0) setCategoryID(cats[0].categoryID);
        if (locs.length > 0) setLocationID(locs[0].locationID);
      } catch (err) {
        console.error('Failed to load categories/locations:', err);
      } finally {
        setLoadingDropdowns(false);
      }
    };
    fetchDropdowns();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const res = await reportsApi.uploadPhoto(file);
      setPhotoUrl(res.url);
      showToast('Photo uploaded successfully', 'success');
    } catch (err) {
      setError('Image upload failed. Please try a different photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !categoryID || !locationID || !date) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const report = await reportsApi.create({
        title: title.trim(),
        description: description.trim(),
        type: 'Lost',
        categoryID: Number(categoryID),
        locationID: Number(locationID),
        date: new Date(date).toISOString(),
        photo: photoUrl || null,
      });

      showToast('Lost item reported successfully! We will alert you if a match is found.', 'success');
      navigate(`/items/${report.reportID}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3rem 1.25rem 5rem' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)', backgroundColor: '#ffffff' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--slate-100)' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--lost-bg)',
                color: 'var(--lost-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlusCircle size={26} />
            </div>
            <div>
              <h1 className="title-md" style={{ color: 'var(--navy-900)' }}>
                Report a Lost Item
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                Provide detailed attributes to help campus finders recognize your property
              </p>
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                Item Name / Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Apple AirPods Pro 2 in White Case"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category and Location in 2 Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Category <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  className="form-select"
                  value={categoryID}
                  onChange={(e) => setCategoryID(e.target.value)}
                  disabled={loadingDropdowns}
                  required
                >
                  {categories.map((c) => (
                    <option key={c.categoryID} value={c.categoryID}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Approximate Location Lost <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  className="form-select"
                  value={locationID}
                  onChange={(e) => setLocationID(e.target.value)}
                  disabled={loadingDropdowns}
                  required
                >
                  {locations.map((l) => (
                    <option key={l.locationID} value={l.locationID}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Lost */}
            <div className="form-group">
              <label className="form-label">
                Date Lost <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Item Description & Distinguishing Traits <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Describe brand, color, stickers, scratches, case color, lock screen, keychain tags, or where you remember leaving it..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Photo Upload or URL */}
            <div className="form-group">
              <label className="form-label">Item Photo (Optional but Recommended)</label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Paste image URL or upload file..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  style={{ flex: 1 }}
                />
                <label className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.65rem 1.15rem' }}>
                  <Upload size={16} />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              {uploading && (
                <span style={{ fontSize: '0.75rem', color: 'var(--blue-600)', marginTop: '0.35rem', display: 'block' }}>
                  Uploading image to server...
                </span>
              )}
              {photoUrl && (
                <div style={{ marginTop: '0.75rem' }}>
                  <img
                    src={photoUrl}
                    alt="Preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || uploading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Submitting Report...</span>
                </>
              ) : (
                'Submit Lost Item Report'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
