const express = require('express');
const cors = require('cors'); //cross origin resource state
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'alumni_secret_2024';
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Initialize DB
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const init = {
      users: [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@alumni.com',
          password: bcrypt.hashSync('admin123', 10),
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ],
      alumni: [
        { id: 1, name: 'Priya Sharma', email: 'priya@example.com', batch: '2018', branch: 'Computer Science', company: 'Google', location: 'Hyderabad', phone: '9876543210', linkedin: 'linkedin.com/in/priya', status: 'employed', avatar: 'PS' },
        { id: 2, name: 'Rahul Verma', email: 'rahul@example.com', batch: '2019', branch: 'Electronics', company: 'Microsoft', location: 'Bangalore', phone: '9876543211', linkedin: 'linkedin.com/in/rahul', status: 'employed', avatar: 'RV' },
        { id: 3, name: 'Ananya Patel', email: 'ananya@example.com', batch: '2020', branch: 'Mechanical', company: 'ISRO', location: 'Chennai', phone: '9876543212', linkedin: 'linkedin.com/in/ananya', status: 'employed', avatar: 'AP' },
        { id: 4, name: 'Karan Singh', email: 'karan@example.com', batch: '2017', branch: 'Civil', company: 'L&T', location: 'Mumbai', phone: '9876543213', linkedin: 'linkedin.com/in/karan', status: 'employed', avatar: 'KS' },
        { id: 5, name: 'Neha Gupta', email: 'neha@example.com', batch: '2021', branch: 'Computer Science', company: 'Amazon', location: 'Pune', phone: '9876543214', linkedin: 'linkedin.com/in/neha', status: 'employed', avatar: 'NG' },
        { id: 6, name: 'Arjun Mehta', email: 'arjun@example.com', batch: '2016', branch: 'IT', company: 'TCS', location: 'Delhi', phone: '9876543215', linkedin: 'linkedin.com/in/arjun', status: 'self-employed', avatar: 'AM' },
        { id: 7, name: 'medicharla k satya phanindra', email: 'mkanish2004@gmail.com', batch: '2015', branch: 'cse', company: 'Google', location: 'Hyderabad', phone: '8143539080', linkedin: 'linkedin.com/in/M K satya phanindra', status: 'employee', avatar: 'AM' }
      ],
      events: [
        { id: 1, title: 'Annual Alumni Meet 2024', date: '2024-12-15', location: 'Campus Auditorium', description: 'Yearly gathering of alumni', registrations: 145 },
        { id: 2, title: 'Tech Talk: AI in Industry', date: '2024-11-20', location: 'Online (Zoom)', description: 'Webinar by alumni working in AI', registrations: 89 },
        { id: 3, title: 'Career Guidance Workshop', date: '2024-10-05', location: 'Seminar Hall', description: 'Workshop for final year students', registrations: 210 },
      ],
      jobs: [
        { id: 1, title: 'Software Engineer', company: 'Infosys', location: 'Hyderabad', type: 'Full-time', postedBy: 'Priya Sharma', date: '2024-10-01', description: 'Looking for experienced SWE.' },
        { id: 2, title: 'Data Analyst', company: 'Wipro', location: 'Bangalore', type: 'Full-time', postedBy: 'Rahul Verma', date: '2024-10-05', description: 'Data analyst with 2+ years experience.' },
        { id: 3, title: 'Product Manager', company: 'Startup XYZ', location: 'Remote', type: 'Full-time', postedBy: 'Arjun Mehta', date: '2024-10-10', description: 'PM role at a fast-growing startup.' },
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// AUTH ROUTES
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post('/api/register', (req, res) => {
  const { name, email, password, role = 'alumni' } = req.body;
  const db = readDB();
  if (db.users.find(u => u.email === email))
    return res.status(400).json({ message: 'Email already exists' });
  const newUser = { id: Date.now(), name, email, password: bcrypt.hashSync(password, 10), role, createdAt: new Date().toISOString() };
  db.users.push(newUser);
  writeDB(db);
  const token = jwt.sign({ id: newUser.id, email, role, name }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: newUser.id, name, email, role } });
});

// ALUMNI ROUTES
app.get('/api/alumni', auth, (req, res) => {
  const db = readDB();
  res.json(db.alumni);
});

app.post('/api/alumni', auth, (req, res) => {
  const db = readDB();
  const newAlum = { id: Date.now(), ...req.body, avatar: req.body.name.split(' ').map(n => n[0]).join('').toUpperCase() };
  db.alumni.push(newAlum);
  writeDB(db);
  res.json(newAlum);
});

app.put('/api/alumni/:id', auth, (req, res) => {
  const db = readDB();
  const idx = db.alumni.findIndex(a => a.id == req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.alumni[idx] = { ...db.alumni[idx], ...req.body };
  writeDB(db);
  res.json(db.alumni[idx]);
});

app.delete('/api/alumni/:id', auth, (req, res) => {
  const db = readDB();
  db.alumni = db.alumni.filter(a => a.id != req.params.id);
  writeDB(db);
  res.json({ message: 'Deleted' });
});

// EVENTS ROUTES
app.get('/api/events', auth, (req, res) => {
  res.json(readDB().events);
});

app.post('/api/events', auth, (req, res) => {
  const db = readDB();
  const ev = { id: Date.now(), ...req.body, registrations: 0 };
  db.events.push(ev);
  writeDB(db);
  res.json(ev);
});

app.delete('/api/events/:id', auth, (req, res) => {
  const db = readDB();
  db.events = db.events.filter(e => e.id != req.params.id);
  writeDB(db);
  res.json({ message: 'Deleted' });
});

// JOBS ROUTES
app.get('/api/jobs', auth, (req, res) => {
  res.json(readDB().jobs);
});

app.post('/api/jobs', auth, (req, res) => {
  const db = readDB();
  const job = { id: Date.now(), ...req.body, date: new Date().toISOString().split('T')[0] };
  db.jobs.push(job);
  writeDB(db);
  res.json(job);
});

app.delete('/api/jobs/:id', auth, (req, res) => {
  const db = readDB();
  db.jobs = db.jobs.filter(j => j.id != req.params.id);
  writeDB(db);
  res.json({ message: 'Deleted' });
});

// STATS
app.get('/api/stats', auth, (req, res) => {
  const db = readDB();
  const batches = [...new Set(db.alumni.map(a => a.batch))].length;
  res.json({
    totalAlumni: db.alumni.length,
    totalEvents: db.events.length,
    totalJobs: db.jobs.length,
    batches,
    employed: db.alumni.filter(a => a.status === 'employed').length,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
