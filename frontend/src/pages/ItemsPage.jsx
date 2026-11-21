import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Tag, 
  MapPin, 
  Calendar, 
  X, 
  RotateCcw,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';
import { reportsApi } from '../api/reportsApi';
import { categoriesApi, locationsApi } from '../api/commonApi';
import { ItemCard } from '../components/ItemCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const ItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from URL params if present
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [categoryID, setCategoryID] = useState(searchParams.get('categoryID') || '');
  const [locationID, setLocationID] = useState(searchParams.get('locationID') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [fromDate, setFromDate] = useState(searchParams.get('fromDate') || '');
  const [toDate, setToDate] = useState(searchParams.get('toDate') || '');

  // Load categories and locations on mount
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [cats, locs] = await Promise.all([
          categoriesApi.getAll(),
          locationsApi.getAll(),
        ]);
        setCategories(cats);
        setLocations(locs);
      } catch (err) {
        console.error('Failed to load filter dropdowns:', err);
      }
    };
    loadDropdowns();
  }, []);

  // Fetch reports based on current filters
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (type && type !== 'All') params.type = type;
      if (categoryID) params.categoryID = Number(categoryID);
      if (locationID) params.locationID = Number(locationID);
      if (status && status !== 'All') params.status = status;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const data = await reportsApi.getAll(params);
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  }, [search, type, categoryID, locationID, status, fromDate, toDate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleResetFilters = () => {
    setSearch('');
    setType('All');
    setCategoryID('');
    setLocationID('');
    setStatus('All');
    setFromDate('');
    setToDate('');
    setSearchParams({});
  };

  const hasActiveFilters = search || type !== 'All' || categoryID || locationID || status !== 'All' || fromDate || toDate;

  return (
    <div style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <div className="container">
        
        {/* Header Title & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <h1 className="title-lg" style={{ color: 'var(--navy-900)' }}>
              Campus Lost & Found Directory
            </h1>
            <p className="subtitle">
              Search, filter, and track reports submitted across the entire campus.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/report-lost" className="btn btn-secondary btn-sm" style={{ border: '1px solid var(--lost-border)', color: 'var(--lost-text)', backgroundColor: 'var(--lost-bg)', fontWeight: 700 }}>
              <PlusCircle size={15} />
              Report Lost Item
            </Link>
            <Link to="/report-found" className="btn btn-secondary btn-sm" style={{ border: '1px solid var(--found-border)', color: 'var(--found-text)', backgroundColor: 'var(--found-bg)', fontWeight: 700 }}>
              <CheckCircle2 size={15} />
              Report Found Item
            </Link>
          </div>
        </div>

        {/* Filter Panel Card */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          
          {/* Top Row: Search input + Type pills */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search by keywords, model, color, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Type toggle buttons */}
            <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--slate-100)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
              {['All', 'Lost', 'Found'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: type === t ? '#ffffff' : 'transparent',
                    color: type === t ? 'var(--navy-900)' : 'var(--slate-600)',
                    boxShadow: type === t ? 'var(--shadow-sm)' : 'none',
                    fontWeight: 700,
                  }}
                >
                  {t === 'All' ? 'All Types' : t === 'Lost' ? 'Lost Items' : 'Found Items'}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Filter Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            
            {/* Category Dropdown */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>
                Category
              </label>
              <select
                className="form-select"
                value={categoryID}
                onChange={(e) => setCategoryID(e.target.value)}
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.categoryID} value={c.categoryID}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Dropdown */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>
                Campus Location
              </label>
              <select
                className="form-select"
                value={locationID}
                onChange={(e) => setLocationID(e.target.value)}
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              >
                <option value="">All Locations</option>
                {locations.map((l) => (
                  <option key={l.locationID} value={l.locationID}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>
                Report Status
              </label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Claimed">Claimed / Returned</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>
                From Date
              </label>
              <input
                type="date"
                className="form-input"
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-ghost btn-sm"
                  style={{ color: '#ef4444', fontWeight: 700, padding: '0.55rem' }}
                >
                  <RotateCcw size={14} />
                  <span>Reset Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--slate-600)', fontSize: '0.9rem' }}>
          <div>
            Showing <strong style={{ color: 'var(--navy-900)' }}>{reports.length}</strong> items
          </div>
          {hasActiveFilters && (
            <span style={{ fontSize: '0.8rem', color: 'var(--blue-600)', fontWeight: 600 }}>
              Filters Applied
            </span>
          )}
        </div>

        {/* Content Grid */}
        {loading ? (
          <LoadingSpinner text="Searching campus items..." />
        ) : reports.length === 0 ? (
          <EmptyState
            title="No lost or found items match your criteria"
            description="Try removing some filters, checking your spelling, or report a new lost/found item."
            actionText="Clear All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid-cards">
            {reports.map((report) => (
              <ItemCard key={report.reportID} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
