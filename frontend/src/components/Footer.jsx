import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--navy-950)', color: 'var(--slate-400)', borderTop: '1px solid var(--navy-800)', marginTop: '4rem' }}>
      <div className="container" style={{ padding: '3.5rem 1.25rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Column 1: Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div className="brand-badge" style={{ padding: '0.35rem' }}>
                <Search size={18} strokeWidth={2.75} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Campus<span style={{ color: 'var(--blue-400)' }}>Find</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--slate-400)' }}>
              The official centralized Lost & Found management system for university students, faculty, and administrative staff. Reuniting owners with lost belongings safely.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/items" style={{ color: 'var(--slate-300)', transition: 'color 0.15s' }}>
                  Browse All Lost & Found
                </Link>
              </li>
              <li>
                <Link to="/report-lost" style={{ color: 'var(--slate-300)', transition: 'color 0.15s' }}>
                  Report a Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report-found" style={{ color: 'var(--slate-300)', transition: 'color 0.15s' }}>
                  Report a Found Item
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--slate-300)', transition: 'color 0.15s' }}>
                  Student & Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Campus Office Contact */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Lost & Found Office
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: 'var(--blue-400)', flexShrink: 0, marginTop: '2px' }} />
                <span>Student Union Center, Suite 102 (Campus Security Desk)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} style={{ color: 'var(--blue-400)', flexShrink: 0 }} />
                <span>+1 (555) 019-9000</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: 'var(--blue-400)', flexShrink: 0 }} />
                <span>lostandfound@college.edu</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: 'var(--blue-400)', flexShrink: 0 }} />
                <span>Mon – Fri: 8:00 AM – 5:00 PM</span>
              </div>
            </div>
          </div>

          {/* Column 4: Verification Policy */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Claim Verification
            </h4>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <ShieldCheck size={28} style={{ color: 'var(--blue-400)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--slate-400)' }}>
                All claims require verification of proof (serial numbers, distinguishing details, receipts, or valid photo ID) before items are released by campus administration.
              </p>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid var(--navy-800)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem' }}>
          <div>
            © {new Date().getFullYear()} College Lost & Found Management System. Built for Software Engineering Course.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--slate-400)' }}>
            <span>Security Policy</span>
            <span>Terms of Service</span>
            <span>Privacy Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
