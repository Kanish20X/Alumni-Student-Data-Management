import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const fillDemo = () => setForm({ name: '', email: 'admin@alumni.com', password: 'admin123' });

  return (
    <div className="login-root">
      <div className="login-bg">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="grid-lines" />
      </div>

      <div className="login-left">
        <div className="brand">
          <div className="brand-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 28 Q20 8 30 28" stroke="currentColor" strokeWidth="2.5" fill="none"/>
              <circle cx="20" cy="14" r="4" fill="currentColor"/>
            </svg>
          </div>
          <span className="brand-name">AlumniHub</span>
        </div>
        <div className="hero-text">
          <h1>Connecting<br /><span className="accent">Generations</span><br />of Excellence</h1>
          <p>A centralized platform to discover, connect, and collaborate with alumni from your institution.</p>
        </div>
        <div className="stats-row">
          <div className="stat"><div className="stat-num">6+</div><div className="stat-label">Alumni</div></div>
          <div className="stat"><div className="stat-num">3+</div><div className="stat-label">Events</div></div>
          <div className="stat"><div className="stat-num">3+</div><div className="stat-label">Jobs Posted</div></div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="card-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Sign in to your account' : 'Join the alumni network'}</p>
          </div>

          <div className="tab-switch">
            <button className={isLogin ? 'active' : ''} onClick={() => { setIsLogin(true); setError(''); }}>Sign In</button>
            <button className={!isLogin ? 'active' : ''} onClick={() => { setIsLogin(false); setError(''); }}>Register</button>
          </div>

          <form onSubmit={submit} className="login-form">
            {!isLogin && (
              <div className="field">
                <label>Full Name</label>
                <input name="name" type="text" placeholder="John Doe" value={form.name} onChange={handle} required />
              </div>
            )}
            <div className="field">
              <label>Email Address</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
            {isLogin && (
              <button type="button" className="btn-demo" onClick={fillDemo}>
                Use Demo Credentials
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
