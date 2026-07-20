// src/components/CompanyCard.jsx
// A reusable "card" that displays one company's info.
// Used inside Dashboard.jsx — one card per company.
// Clicking it navigates to /company/:id (see CompanyDetail.jsx)

import { useNavigate } from 'react-router-dom';

export default function CompanyCard({ company }) {
  const navigate = useNavigate();
  const tierColors = {
    high: '#1B7A43',
    medium: '#B8860B',
    low: '#8A8A8A',
  };

  return (
    <div
      className="company-card company-card-clickable"
      onClick={() => navigate(`/company/${company._id}`)}
    >
      <div className="company-card-header">
        <h3>{company.name}</h3>
        <span
          className="tier-badge"
          style={{ backgroundColor: tierColors[company.payTier] }}
        >
          {company.payTier.toUpperCase()} • {company.avgPackageLPA} LPA
        </span>
      </div>

      <p className="company-desc">{company.description}</p>

      <div className="tag-group">
        <span className="tag-label">DSA Focus:</span>
        {company.dsaTopics.map((topic) => (
          <span
            className="tag tag-clickable"
            key={topic}
            onClick={(e) => {
              e.stopPropagation(); // prevents the card's own click (navigate to company) from firing
              navigate(`/dsa/${encodeURIComponent(topic)}`);
            }}
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="tag-group">
        <span className="tag-label">Projects:</span>
        {company.projectTypes.map((p) => (
          <span className="tag tag-alt" key={p}>{p}</span>
        ))}
      </div>
    </div>
  );
}
