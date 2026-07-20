// src/pages/CompanyDetail.jsx
// Shows full details of ONE company. Opened when a user clicks a CompanyCard.

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(true);
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

    async function fetchQuestions() {
      try {
        const res = await api.get(`/companies/${id}/questions`);
        setQuestions(res.data);
      } catch (err) {
        setQuestions([]);
      } finally {
        setQuestionsLoading(false);
      }
    }

    fetchCompany();
    fetchQuestions();
  }, [id]);

const tierColors = { high: '#1B7A43', medium: '#B8860B', low: '#6B7280' };

 const difficultyColors = {
  EASY: '#15803D',
  MEDIUM: '#C2790B',
  HARD: '#C0392B',
};
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
          <h3>Real Interview Questions Asked at {company.name}</h3>
          {questionsLoading && <p className="status-text">Loading questions...</p>}
          {!questionsLoading && questions.length === 0 && (
            <p className="status-text">No specific questions found for this company yet.</p>
          )}
          {!questionsLoading && questions.length > 0 && (
            <div className="questions-list">
              {questions.map((q) => (
                <a
                  key={q._id}
                  href={q.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="question-row"
                >
                  <span
                    className="difficulty-badge"
                    style={{ backgroundColor: difficultyColors[q.difficulty] || '#8A8A8A' }}
                  >
                    {q.difficulty || 'N/A'}
                  </span>
                  <span className="question-title">{q.title}</span>
                  {q.topics.length > 0 && (
                    <span className="question-topics">{q.topics.join(', ')}</span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>

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