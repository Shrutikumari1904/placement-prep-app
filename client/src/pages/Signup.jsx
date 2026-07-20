// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); // stops the page from reloading (default HTML form behavior)
    setError('');
    try {
      await signup(name, email, password);
      navigate('/dashboard'); // redirect after successful signup
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {error && <p className="error-text">{error}</p>}

        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Sign Up</button>

        <p className="switch-text">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}
