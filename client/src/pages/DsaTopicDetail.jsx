// src/pages/DsaTopicDetail.jsx
// Shows frequently asked question TYPES for one DSA topic.
// Opened when a user clicks a DSA tag on a Company card or detail page.

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function DsaTopicDetail() {
  const { name } = useParams(); // e.g. "Arrays"
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTopic() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/dsatopics/${encodeURIComponent(name)}`);
        setTopic(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'No info found for this topic yet');
      } finally {
        setLoading(false);
      }
    }
    fetchTopic();
  }, [name]);

  if (loading) return <p className="status-text">Loading...</p>;

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-card">
        <h1>{name}</h1>

        {error ? (
          <p className="status-text" style={{ textAlign: 'left', padding: '1rem 0' }}>
            {error} — we haven't added prep info for this topic yet.
          </p>
        ) : (
          <>
           <p className="detail-desc">{topic.description}</p>

            {topic.commonQuestionTypes?.length > 0 && (
              <div className="detail-section">
                <h3>Frequently Asked Question Types</h3>
                <ul className="question-list">
                  {topic.commonQuestionTypes.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {topic.sampleQuestions?.length > 0 && (
              <div className="detail-section">
                <h3>Real Questions Asked (from open interview datasets)</h3>
                <ul className="question-list">
                  {topic.sampleQuestions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
