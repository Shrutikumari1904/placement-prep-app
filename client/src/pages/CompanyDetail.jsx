// src/pages/CompanyDetail.jsx
// Shows full details of ONE company. Opened when a user clicks a CompanyCard.

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CompanyDetail() {
  const { id } = useParams();       // reads the :id from the URL, e.g. /company/64f...
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await api.get(`/companies/${id}`);
        setCompany(res.data);
      } catch (err) {
        setError('Company not found');
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, [id]);

  const tierColors = { high: '#1B7A43', medium: '#B8860B', low: '#8A8A8A' };

  if (loading) return <p className="status-text">Loading...</p>;
  if (error) return <p className="status-text">{error}</p>;

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-card">
        <div className="detail-header">
          <h1>{company.name}</h1>
          <span
            className="tier-badge"
            style={{ backgroundColor: tierColors[company.payTier] }}
          >
            {company.payTier.toUpperCase()} • {company.avgPackageLPA} LPA
          </span>
        </div>

        <p className="detail-desc">{company.description}</p>

        <div className="detail-section">
          <h3>DSA Topics to Prepare <span className="hint-text">(click a topic for common question types)</span></h3>
          <div className="tag-group">
            {company.dsaTopics.map((t) => (
              <span
                className="tag tag-clickable"
                key={t}
                onClick={() => navigate(`/dsa/${encodeURIComponent(t)}`)}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <h3>Projects They Value</h3>
          <div className="tag-group">
            {company.projectTypes.map((p) => (
              <span className="tag tag-alt" key={p}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
