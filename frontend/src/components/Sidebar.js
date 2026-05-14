import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: '▣' },
  { to: '/alumni', label: 'Alumni Directory', icon: '◉' },
  { to: '/events', label: 'Events', icon: '◈' },
  { to: '/jobs', label: 'Job Board', icon: '◎' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2"/>
            <path d="M10 28 Q20 8 30 28" stroke="currentColor" strokeWidth="2.5" fill="none"/>
            <circle cx="20" cy="14" r="4" fill="currentColor"/>
          </svg>
        </div>
        <span>AlumniHub</span>
      </div>

      <nav className="sb-nav">
        {nav.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}>
            <span className="sb-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sb-footer">
        <div className="sb-user">
          <div className="sb-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="sb-info">
            <div className="sb-name">{user?.name}</div>
            <div className="sb-role">{user?.role}</div>
          </div>
        </div>
        <button className="sb-logout" onClick={handleLogout}>Sign Out</button>
      </div>
    </aside>
  );
}
