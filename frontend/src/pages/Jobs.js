import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Jobs.css';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', location: '', type: 'Full-time', description: '' });
  const { user } = useAuth();

  const fetch = () => axios.get('/api/jobs').then(r => setJobs(r.data));
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    await axios.post('/api/jobs', { ...form, postedBy: user?.name });
    setShowModal(false);
    setForm({ title: '', company: '', location: '', type: 'Full-time', description: '' });
    fetch();
  };

  const del = async (id) => {
    if (window.confirm('Remove this job?')) { await axios.delete(`/api/jobs/${id}`); fetch(); }
  };

  const typeColor = (t) => ({
    'Full-time': { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.2)' },
    'Part-time': { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
    'Remote': { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
    'Internship': { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
  })[t] || {};

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Job Board</h1><p>Opportunities shared by alumni</p></div>
        <button className="btn-add" onClick={() => setShowModal(true)}>+ Post Job</button>
      </div>

      <div className="jobs-list">
        {jobs.map(j => {
          const tc = typeColor(j.type);
          return (
            <div key={j.id} className="job-card">
              <div className="jc-left">
                <div className="jc-company-logo">{j.company[0]}</div>
              </div>
              <div className="jc-body">
                <div className="jc-top">
                  <h3 className="jc-title">{j.title}</h3>
                  <span className="jc-badge" style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>{j.type}</span>
                </div>
                <div className="jc-meta">
                  <span>🏢 {j.company}</span>
                  <span>📍 {j.location}</span>
                  <span>👤 Posted by {j.postedBy}</span>
                  <span>📅 {j.date}</span>
                </div>
                <p className="jc-desc">{j.description}</p>
              </div>
              <div className="jc-actions">
                <button className="btn-apply">Apply</button>
                <button className="btn-del-sm" onClick={() => del(j.id)}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Post a Job</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {[['title','Job Title'], ['company','Company'], ['location','Location']].map(([k,l]) => (
                <div key={k} className="field">
                  <label>{l}</label>
                  <input value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} placeholder={l} />
                </div>
              ))}
              <div className="field">
                <label>Job Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  {['Full-time', 'Part-time', 'Remote', 'Internship'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Role description..." rows={3} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={save}>Post Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
