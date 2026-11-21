import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Archive, 
  Tag, 
  MapPin, 
  ArrowLeft 
} from 'lucide-react';

export const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div style={{ padding: '0.5rem 0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--navy-800)' }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--blue-400)', fontWeight: 700, letterSpacing: '0.05em' }}>
          Administration
        </span>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Control Center</h2>
      </div>

      <NavLink
        to="/admin/dashboard"
        end
        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/admin/reports"
        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
      >
        <FileText size={18} />
        <span>Manage Reports</span>
      </NavLink>

      <NavLink
        to="/admin/claims"
        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
      >
        <CheckSquare size={18} />
        <span>Manage Claims</span>
      </NavLink>

      <NavLink
        to="/admin/unclaimed"
        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
      >
        <Archive size={18} />
        <span>Unclaimed Items</span>
      </NavLink>

      <div style={{ margin: '1rem 0 0.5rem', padding: '0 0.75rem', fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700 }}>
        Master Data
      </div>

      <NavLink
        to="/admin/categories"
        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
      >
        <Tag size={18} />
        <span>Categories</span>
      </NavLink>

      <NavLink
        to="/admin/locations"
        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
      >
        <MapPin size={18} />
        <span>Locations</span>
      </NavLink>

      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--navy-800)' }}>
        <NavLink
          to="/"
          className="admin-nav-item"
          style={{ color: 'var(--slate-400)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Main Site</span>
        </NavLink>
      </div>
    </aside>
  );
};
