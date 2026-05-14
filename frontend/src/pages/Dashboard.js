import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    axios.get('/api/stats').then(r => setStats(r.data));
    axios.get('/api/alumni').then(r => setAlumni(r.data.slice(0, 4)));
  }, []);

  const cards = stats ? [
    { label: 'Total Alumni', value: stats.totalAlumni, color: '#3b82f6', icon: '◉' },
    { label: 'Events', value: stats.totalEvents, color: '#8b5cf6', icon: '◈' },
    { label: 'Jobs Posted', value: stats.totalJobs, color: '#06b6d4', icon: '◎' },
    { label: 'Batches', value: stats.batches, color: '#10b981', icon: '▣' },
  ] : [];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Here's what's happening in the alumni network</p>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map(c => (
          <div key={c.label} className="stat-card" style={{ '--accent': c.color }}>
            <div className="sc-icon" style={{ color: c.color }}>{c.icon}</div>
            <div className="sc-value">{c.value}</div>
            <div className="sc-label">{c.label}</div>
            <div className="sc-glow" />
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Recent Alumni</h3>
          </div>
          <div className="alumni-list">
            {alumni.map(a => (
              <div key={a.id} className="alumni-row">
                <div className="alum-avatar">{a.avatar}</div>
                <div className="alum-info">
                  <div className="alum-name">{a.name}</div>
                  <div className="alum-meta">{a.branch} · Batch {a.batch}</div>
                </div>
                <div className="alum-company">{a.company}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h3>Quick Overview</h3></div>
          <div className="overview-items">
            <div className="ov-item">
              <span className="ov-dot" style={{ background: '#3b82f6' }} />
              <span className="ov-label">Employed Alumni</span>
              <span className="ov-val">{stats?.employed}</span>
            </div>
            <div className="ov-item">
              <span className="ov-dot" style={{ background: '#8b5cf6' }} />
              <span className="ov-label">Total Events</span>
              <span className="ov-val">{stats?.totalEvents}</span>
            </div>
            <div className="ov-item">
              <span className="ov-dot" style={{ background: '#06b6d4' }} />
              <span className="ov-label">Active Jobs</span>
              <span className="ov-val">{stats?.totalJobs}</span>
            </div>
            <div className="ov-item">
              <span className="ov-dot" style={{ background: '#10b981' }} />
              <span className="ov-label">Batches Represented</span>
              <span className="ov-val">{stats?.batches}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
