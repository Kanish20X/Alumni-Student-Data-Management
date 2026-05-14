import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Alumni.css';

const BRANCHES = ['All', 'Computer Science', 'IT', 'Electronics', 'Mechanical', 'Civil'];
const BATCHES = ['All', '2016', '2017', '2018', '2019', '2020', '2021'];

export default function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('All');
  const [batch, setBatch] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', batch: '', branch: '', company: '', location: '', phone: '', linkedin: '', status: 'employed' });

  const fetch = () => axios.get('/api/alumni').then(r => setAlumni(r.data));
  useEffect(() => { fetch(); }, []);

  useEffect(() => {
    let d = alumni;
    if (search) d = d.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase()));
    if (branch !== 'All') d = d.filter(a => a.branch === branch);
    if (batch !== 'All') d = d.filter(a => a.batch === batch);
    setFiltered(d);
  }, [alumni, search, branch, batch]);

  const openAdd = () => { setEditItem(null); setForm({ name: '', email: '', batch: '', branch: '', company: '', location: '', phone: '', linkedin: '', status: 'employed' }); setShowModal(true); };
  const openEdit = (a) => { setEditItem(a); setForm(a); setShowModal(true); };

  const save = async () => {
    if (editItem) await axios.put(`/api/alumni/${editItem.id}`, form);
    else await axios.post('/api/alumni', form);
    setShowModal(false); fetch();
  };

  const del = async (id) => {
    if (window.confirm('Delete this alumni?')) { await axios.delete(`/api/alumni/${id}`); fetch(); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Alumni Directory</h1><p>{filtered.length} alumni found</p></div>
        <button className="btn-add" onClick={openAdd}>+ Add Alumni</button>
      </div>

      <div className="filters">
        <input className="search-input" placeholder="🔍  Search by name or company..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-sel" value={branch} onChange={e => setBranch(e.target.value)}>
          {BRANCHES.map(b => <option key={b}>{b}</option>)}
        </select>
        <select className="filter-sel" value={batch} onChange={e => setBatch(e.target.value)}>
          {BATCHES.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div className="alumni-grid">
        {filtered.map(a => (
          <div key={a.id} className="alum-card">
            <div className="ac-top">
              <div className="ac-avatar">{a.avatar}</div>
              <div className="ac-badge">{a.status}</div>
            </div>
            <div className="ac-name">{a.name}</div>
            <div className="ac-branch">{a.branch} · {a.batch}</div>
            <div className="ac-divider" />
            <div className="ac-detail"><span>🏢</span>{a.company}</div>
            <div className="ac-detail"><span>📍</span>{a.location}</div>
            <div className="ac-detail"><span>📧</span>{a.email}</div>
            <div className="ac-actions">
              <button className="btn-edit" onClick={() => openEdit(a)}>Edit</button>
              <button className="btn-del" onClick={() => del(a.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editItem ? 'Edit Alumni' : 'Add Alumni'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-form">
              {[['name','Full Name'], ['email','Email'], ['batch','Batch Year'], ['company','Company'], ['location','Location'], ['phone','Phone'], ['linkedin','LinkedIn URL']].map(([k,l]) => (
                <div key={k} className="field">
                  <label>{l}</label>
                  <input value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} placeholder={l} />
                </div>
              ))}
              <div className="field">
                <label>Branch</label>
                <select value={form.branch} onChange={e => setForm({...form, branch: e.target.value})}>
                  {BRANCHES.slice(1).map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="studying">Studying</option>
                  <option value="looking">Looking for job</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={save}>{editItem ? 'Update' : 'Add'} Alumni</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
