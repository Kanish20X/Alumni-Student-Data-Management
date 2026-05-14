import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Events.css';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', location: '', description: '' });

  const fetch = () => axios.get('/api/events').then(r => setEvents(r.data));
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    await axios.post('/api/events', form);
    setShowModal(false);
    setForm({ title: '', date: '', location: '', description: '' });
    fetch();
  };

  const del = async (id) => {
    if (window.confirm('Delete this event?')) { await axios.delete(`/api/events/${id}`); fetch(); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Events</h1><p>Alumni meetups, workshops & webinars</p></div>
        <button className="btn-add" onClick={() => setShowModal(true)}>+ Create Event</button>
      </div>

      <div className="events-grid">
        {events.map(ev => (
          <div key={ev.id} className="event-card">
            <div className="ev-date-badge">
              <div className="ev-month">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</div>
              <div className="ev-day">{new Date(ev.date).getDate()}</div>
            </div>
            <div className="ev-content">
              <h3 className="ev-title">{ev.title}</h3>
              <div className="ev-meta">
                <span>📍 {ev.location}</span>
                <span>👥 {ev.registrations} registered</span>
              </div>
              <p className="ev-desc">{ev.description}</p>
            </div>
            <button className="btn-del-ev" onClick={() => del(ev.id)}>Delete</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Event</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {[['title','Event Title'], ['date','Date'], ['location','Location']].map(([k,l]) => (
                <div key={k} className="field">
                  <label>{l}</label>
                  <input type={k === 'date' ? 'date' : 'text'} value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} placeholder={l} />
                </div>
              ))}
              <div className="field">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Event description..." rows={3} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={save}>Create Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
