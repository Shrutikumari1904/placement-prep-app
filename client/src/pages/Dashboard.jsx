// src/pages/Dashboard.jsx
// The main page after login: search bar + tier filter tabs + list of company cards.

import { useEffect, useState } from 'react';
import api from '../api/axios';
import CompanyCard from '../components/CompanyCard';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('all'); // 'all' | 'high' | 'medium' | 'low'
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  // Runs whenever `search` or `tier` changes — fetches matching companies from the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanies();
    }, 300); // small delay so we don't fire a request on every single keystroke

    return () => clearTimeout(timer);
  }, [search, tier]);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (tier !== 'all') params.tier = tier;

      const res = await api.get('/companies', { params });
      setCompanies(res.data);
    } catch (err) {
      console.error('Failed to fetch companies', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>PlacementPrep</h2>
        <div className="navbar-right">
          <span>Hi, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <input
          className="search-bar"
          placeholder="Search company, DSA topic, or project type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="tier-tabs">
          {['all', 'high', 'medium', 'low'].map((t) => (
            <button
              key={t}
              className={`tier-tab ${tier === t ? 'active' : ''}`}
              onClick={() => setTier(t)}
            >
              {t === 'all' ? 'All Companies' : `${t.charAt(0).toUpperCase() + t.slice(1)} Paying`}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="status-text">Loading...</p>
        ) : companies.length === 0 ? (
          <p className="status-text">No companies found.</p>
        ) : (
          <div className="company-grid">
            {companies.map((c) => (
              <CompanyCard key={c._id} company={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
