import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  PackageSearch, 
  MapPin, 
  Clock, 
  CheckCircle2,
  Users
} from 'lucide-react';
import { reportsApi } from '../api/reportsApi';
import { ItemCard } from '../components/ItemCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All'); // 'All', 'Lost', 'Found'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await reportsApi.getAll();
        setRecentReports(data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching recent items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/items');
    }
  };

  const filteredReports = recentReports.filter((r) => {
    if (typeFilter === 'All') return true;
    return r.type?.toLowerCase() === typeFilter.toLowerCase();
  });

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 60%, var(--navy-800) 100%)',
          color: '#ffffff',
          padding: '4.5rem 1.25rem 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '850px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '0.35rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: 'var(--blue-400)',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={14} /> Official Campus Lost & Found System
          </div>

          <h1
            className="title-xl"
            style={{
              color: '#ffffff',
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem',
              lineHeight: 1.15,
            }}
          >
            Never Lose What Matters <br />
            <span style={{ color: 'var(--blue-400)' }}>On Our Campus.</span>
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--slate-300)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: '680px',
              margin: '0 auto 2.5rem',
            }}
          >
            Report missing student IDs, laptops, keys, and personal belongings. Search found items, receive automated match alerts, and claim your property with verified administrative handover.
          </p>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearch}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-xl)',
              maxWidth: '620px',
              margin: '0 auto 2rem',
            }}
          >
            <div style={{ paddingLeft: '0.85rem', color: 'var(--slate-400)' }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              className="form-input"
              style={{
                border: 'none',
                boxShadow: 'none',
                fontSize: '1rem',
                color: 'var(--slate-800)',
                padding: '0.5rem 0.25rem',
              }}
              placeholder="Search by item name (e.g., AirPods, Student ID, Wallet)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-accent btn-lg" style={{ padding: '0.75rem 1.75rem' }}>
              Search Items
            </button>
          </form>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/report-lost" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#ffffff', color: 'var(--navy-900)', fontWeight: 700 }}>
              <PlusCircle size={18} style={{ color: '#d97706' }} />
              I Lost Something
            </Link>
            <Link to="/report-found" className="btn btn-secondary btn-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
              <CheckCircle2 size={18} style={{ color: '#34d399' }} />
              I Found Something
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--slate-200)', padding: '1.75rem 1.25rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>94%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>Identified Match Rate</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue-600)' }}>10+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>Campus Buildings Monitored</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>100%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>Admin Verified Handover</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--found-primary)' }}>&lt; 24h</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>Average Claim Processing</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '4.5rem 1.25rem', backgroundColor: 'var(--slate-50)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--blue-600)', letterSpacing: '0.05em' }}>
              Simple 3-Step Process
            </span>
            <h2 className="title-lg" style={{ marginTop: '0.35rem', marginBottom: '0.75rem' }}>
              How Campus Lost & Found Works
            </h2>
            <p className="subtitle">
              A structured and secure lifecycle from the moment an item is misplaced until it is safely back in its owner's hands.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Step 1 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'left', position: 'relative' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--blue-50)',
                  color: 'var(--blue-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <PackageSearch size={26} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--slate-400)' }}>STEP 01</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)', margin: '0.35rem 0 0.5rem' }}>
                Report Lost or Found
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.55 }}>
                Submit a detailed report with category, exact campus location, date, photos, and distinctive traits.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'left', position: 'relative' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--blue-50)',
                  color: 'var(--blue-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Sparkles size={26} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--slate-400)' }}>STEP 02</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)', margin: '0.35rem 0 0.5rem' }}>
                Smart Match & Claim
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.55 }}>
                Our algorithm calculates similarity scores between lost and found items. Owners submit proof to claim their property.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'left', position: 'relative' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--found-bg)',
                  color: 'var(--found-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--slate-400)' }}>STEP 03</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)', margin: '0.35rem 0 0.5rem' }}>
                Admin Verified Pickup
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.55 }}>
                Campus administrators review claims. Once approved, the claimant is notified to collect their item with student ID.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Lost & Found Items */}
      <section style={{ padding: '4.5rem 1.25rem', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--blue-600)', letterSpacing: '0.05em' }}>
                Recent Campus Activity
              </span>
              <h2 className="title-lg" style={{ marginTop: '0.35rem' }}>
                Recently Reported Items
              </h2>
            </div>

            {/* Type Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--slate-100)', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
              {['All', 'Lost', 'Found'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: typeFilter === type ? '#ffffff' : 'transparent',
                    color: typeFilter === type ? 'var(--navy-900)' : 'var(--slate-600)',
                    boxShadow: typeFilter === type ? 'var(--shadow-sm)' : 'none',
                    fontWeight: 700,
                  }}
                >
                  {type === 'All' ? 'All Items' : type === 'Lost' ? 'Lost Items' : 'Found Items'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading recent reports..." />
          ) : filteredReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
              No reports found in this category.
            </div>
          ) : (
            <div className="grid-cards">
              {filteredReports.map((report) => (
                <ItemCard key={report.reportID} report={report} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/items" className="btn btn-primary btn-lg">
              <span>View All Campus Reports</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
