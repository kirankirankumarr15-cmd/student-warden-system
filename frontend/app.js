// ── Globals from CDN React / Axios / Socket.io ────────────────────────────
const { useState, useEffect, useRef, useCallback } = React;
const API_BASE = `${window.location.origin}/api`;

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setToken={setToken} />
      <div className="flex-1 overflow-y-auto flex flex-col">
        <header className="sticky top-0 z-10 glass-card border-b bg-white/80 backdrop-blur-md px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h1>
                <div className="h-4 w-px bg-slate-200 mx-2"></div>
                <div className="text-xs font-semibold text-slate-500 bg-slate-100 py-1 px-3 rounded-full flex items-center shadow-sm">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    Live System Active
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-slate-600 bg-white border border-slate-200 py-2 px-4 rounded-xl flex items-center shadow-sm">
                    <i className="fa-solid fa-hotel mr-2 text-indigo-500"></i>
                    Hostel Block A
                </div>
                <button className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200">
                    <i className="fa-solid fa-bell"></i>
                </button>
            </div>
        </header>
        <main className="flex-1 p-8 animate-fade-in">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'register' && <RegisterStudent />}
          {activeTab === 'students' && <StudentsList />}
          {activeTab === 'scanner' && <QRScanner />}
          {activeTab === 'attendance' && <AttendanceTable />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'settings' && <Settings />}
        </main>
        <footer className="px-8 py-4 text-center text-xs text-slate-400 border-t bg-white">
            &copy; 2026 Warden Alert System &bull; Intelligent Hostel Management
        </footer>
      </div>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, setToken }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'scanner', label: 'Gate Access', icon: 'fa-qrcode' },
    { id: 'attendance', label: 'Daily Logs', icon: 'fa-list-check' },
    { id: 'register', label: 'Add Resident', icon: 'fa-user-plus' },
    { id: 'students', label: 'Directory', icon: 'fa-address-book' },
    { id: 'reports', label: 'Reports', icon: 'fa-chart-column' },
    { id: 'settings', label: 'Configurations', icon: 'fa-sliders' }
  ];

  return (
    <div className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl relative z-20">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-indigo rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <i className="fa-solid fa-shield-halved text-xl"></i>
            </div>
            <div>
                <h2 className="text-xl font-bold tracking-tight">WARDEN</h2>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest -mt-1">Control Center</p>
            </div>
        </div>
      </div>
      
      <div className="flex-1 px-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`sidebar-item w-full flex items-center px-4 py-3.5 rounded-xl transition-all group ${activeTab === item.id ? 'active bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors ${activeTab === item.id ? 'bg-indigo-600/20' : 'group-hover:bg-white/10'}`}>
                <i className={`fa-solid ${item.icon} text-sm`}></i>
            </div>
            <span className="font-semibold text-sm">{item.label}</span>
            {activeTab === item.id && <i className="fa-solid fa-chevron-right ml-auto text-[10px] opacity-50"></i>}
          </button>
        ))}
      </div>
      
      <div className="p-6">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <i className="fa-solid fa-user-tie text-indigo-400 text-xs"></i>
                </div>
                <div>
                    <p className="text-xs font-bold text-white">Chief Warden</p>
                    <p className="text-[10px] text-slate-500">Online Now</p>
                </div>
            </div>
            <button
                onClick={() => { localStorage.removeItem('token'); setToken(''); }}
                className="w-full flex items-center justify-center px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded-xl text-xs font-bold border border-red-500/20"
            >
                <i className="fa-solid fa-power-off mr-2"></i> Log Out System
            </button>
        </div>
      </div>
    </div>
  );
}

function Login({ setToken }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123'); // Updated to common test pwd
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setError('Invalid system credentials. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen login-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-dark rounded-[2.5rem] shadow-2xl p-10 border border-white/10 relative overflow-hidden animate-fade-in">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-indigo mb-6 shadow-xl shadow-indigo-500/40 animate-pulse-soft">
            <i className="fa-solid fa-shield-halved text-3xl text-white"></i>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">System Login</h2>
          <p className="text-indigo-300 font-medium">Hostel Management Control</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-center text-xs font-bold animate-shake">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5 ml-1">Terminal ID</label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium" 
                  placeholder="Enter username" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5 ml-1">Access Key</label>
              <div className="relative">
                <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium"
                  placeholder="Enter password" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 px-6 gradient-indigo text-white rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] focus:outline-none font-bold transition-all flex items-center justify-center gap-3">
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-right-to-bracket"></i>}
            {loading ? 'Authenticating...' : 'Establish Connection'}
          </button>
        </form>
        
        <div className="mt-8 text-center relative z-10">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Secure TLS 1.3 Encryption Active</p>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, insideCount: 0, outsideCount: 0 });
  const [recent, setRecent] = useState([]);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/attendance/stats`);
      setStats(res.data);
    } catch(e) { console.error(e) }
  };

  const fetchRecent = async () => {
    try {
      const res = await axios.get(`${API_BASE}/attendance`);
      setRecent(res.data.slice(0, 8));
    } catch(e) { console.error(e) }
  }

  useEffect(() => {
    fetchStats();
    fetchRecent();

    const socket = io('http://localhost:5000');
    socket.on('attendanceUpdate', (newRecord) => {
      fetchStats();
      setRecent(prev => [newRecord, ...prev.slice(0, 7)]);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (canvasRef.current && chartRef.current) {
        chartRef.current.data.datasets[0].data = [stats.insideCount, stats.outsideCount];
        chartRef.current.update();
    } else if (canvasRef.current && typeof Chart !== 'undefined') {
        const ctx = canvasRef.current.getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Inside', 'Outside'],
                datasets: [{
                    data: [stats.insideCount, stats.outsideCount],
                    backgroundColor: ['#10b981', '#f43f5e'],
                    hoverBackgroundColor: ['#059669', '#e11d48'],
                    borderWidth: 0,
                    borderRadius: 10,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
  }, [stats]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Total Residents" value={stats.totalStudents} icon="fa-users" color="gradient-indigo" trend="+2 this week" />
        <StatCard title="Currently Inside" value={stats.insideCount} icon="fa-door-closed" color="gradient-emerald" trend="Normal" />
        <StatCard title="Currently Outside" value={stats.outsideCount} icon="fa-person-walking-arrow-right" color="gradient-rose" trend="Check curfew" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm p-8 border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <i className="fa-solid fa-chart-pie text-8xl"></i>
            </div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 self-start">Occupancy Ratio</h3>
            <div className="h-64 w-full relative flex items-center justify-center">
                <canvas ref={canvasRef}></canvas>
                <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-slate-900">{Math.round((stats.insideCount / stats.totalStudents || 0) * 100)}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In-House</span>
                </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-bold text-emerald-800">Inside</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-xl border border-rose-100">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="text-xs font-bold text-rose-800">Outside</span>
                </div>
            </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Live Activity Log</h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-black uppercase tracking-widest">Real-time</span>
          </div>
          <div className="divide-y divide-slate-50 flex-1">
            {recent.map((r, i) => (
              <div key={r._id} className="flex justify-between items-center p-5 hover:bg-slate-50 transition-all group">
                <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-sm transition-transform group-hover:scale-110 ${r.status==='IN'?'bg-emerald-100 text-emerald-600':'bg-rose-100 text-rose-600'}`}>
                        <i className={`fa-solid ${r.status==='IN'?'fa-right-to-bracket':'fa-right-from-bracket'} text-lg`}></i>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{r.student?.studentName || 'System Event'}</p>
                        <p className="text-xs text-slate-400 font-medium">ID: {r.student?.studentId || 'N/A'}</p>
                    </div>
                </div>
                <div className="text-right">
                  <div className={`px-4 py-1.5 inline-flex text-[10px] font-black rounded-xl border tracking-widest ${r.status==='IN'?'bg-emerald-50 text-emerald-700 border-emerald-100':'bg-rose-50 text-rose-700 border-rose-100'}`}>
                    {r.status}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center justify-end">
                    <i className="fa-regular fa-clock mr-1"></i> {new Date(r.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            {recent.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                    <i className="fa-solid fa-radar text-4xl mb-4 opacity-20"></i>
                    <p className="text-sm font-bold uppercase tracking-widest opacity-50">Monitoring Gate Activity...</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }) {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm p-1 border border-slate-100 stat-card">
        <div className="p-7">
            <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
                    <i className={`fa-solid ${icon} text-2xl`}></i>
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-tighter">{trend}</span>
            </div>
            <dt className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</dt>
            <dd className="text-4xl font-black text-slate-900 tracking-tight">{value}</dd>
        </div>
    </div>
  );
}

function RegisterStudent() {
  const [formData, setFormData] = useState({
    studentName: '', studentId: '', studentEmail: '', studentPhone: '',
    parentName: '', parentEmail: '', parentPhone: ''
  });
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/students/register`, formData);
      setMsg({ type: 'success', text: 'Student registered successfully!' });
      setFormData({ studentName: '', studentId: '', studentEmail: '', studentPhone: '', parentName: '', parentEmail: '', parentPhone: '' });
    } catch(err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Registration failed' });
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4">Register New Student</h2>
      {msg && <div className={`p-4 mb-6 rounded-lg font-medium shadow-sm ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center"><i className="fa-solid fa-user-graduate mr-2 text-indigo-500"></i> Student Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <InputField label="Full Name" name="studentName" value={formData.studentName} setFormData={setFormData} />
            <InputField label="Student ID / Roll No" name="studentId" value={formData.studentId} setFormData={setFormData} />
            <InputField label="Email Address" type="email" name="studentEmail" value={formData.studentEmail} setFormData={setFormData} />
            <InputField label="Phone Number" type="tel" name="studentPhone" value={formData.studentPhone} setFormData={setFormData} />
            </div>
        </div>
        
        <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center"><i className="fa-solid fa-user-shield mr-2 text-indigo-500"></i> Parent/Guardian Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <InputField label="Parent Name" name="parentName" value={formData.parentName} setFormData={setFormData} />
            <InputField label="Parent Email" type="email" name="parentEmail" value={formData.parentEmail} setFormData={setFormData} />
            <InputField label="Parent Phone" type="tel" name="parentPhone" value={formData.parentPhone} setFormData={setFormData} />
            </div>
        </div>
        
        <div className="pt-4">
            <button type="submit" className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center">
            <i className="fa-solid fa-paper-plane mr-2"></i> Register Student & Send Emails
            </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ label, name, type="text", value, setFormData }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      <input type={type} required value={value}
        onChange={e => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-shadow shadow-sm" />
    </div>
  );
}

function StudentsList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [qrStudent, setQrStudent] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/students`).then(res => setStudents(res.data)).catch(console.error);
  }, []);

  const filtered = students.filter(s =>
    s.studentName.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      {qrStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setQrStudent(null)}>
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{qrStudent.studentName}</h3>
            <p className="text-xs text-slate-400 font-mono mb-4">{qrStudent.studentId}</p>
            {qrStudent.qrCode
              ? <img src={qrStudent.qrCode} alt="QR Code" className="mx-auto w-48 h-48 rounded-xl border-4 border-indigo-100" />
              : <div className="w-48 h-48 mx-auto bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm">No QR generated yet</div>
            }
            <p className="text-[10px] text-slate-400 mt-4">Show this QR at the gate scanner</p>
            <button onClick={() => setQrStudent(null)} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">Close</button>
          </div>
        </div>
      )}
      <div className="p-6 border-b border-gray-200 flex flex-wrap gap-3 justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Directory <span className="text-sm font-normal text-slate-400">({filtered.length})</span></h2>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name or ID…"
            className="pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-56" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">QR</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map(s => (
              <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">{s.studentName.charAt(0)}</div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">{s.studentName}</div>
                      <div className="text-xs text-gray-500 bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">{s.studentId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center"><i className="fa-regular fa-envelope w-4"></i> {s.studentEmail}</div>
                  <div className="flex items-center mt-1"><i className="fa-solid fa-phone w-4"></i> {s.studentPhone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium text-gray-900">{s.parentName}</div>
                  <div className="text-xs">{s.parentPhone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => setQrStudent(s)}
                    className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition font-semibold flex items-center gap-1">
                    <i className="fa-solid fa-qrcode"></i> View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No students match your search.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QRScanner() {
  const [scanResult, setScanResult] = useState('');
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    let html5QrcodeScanner;
    
    // Add small delay to ensure DOM is ready
    setTimeout(() => {
        if (!document.getElementById('qr-reader')) return;
        html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
        html5QrcodeScanner.render(async (decodedText) => {
            html5QrcodeScanner.clear();
            setScanResult(decodedText);
            try {
                let parsed = decodedText;
                try {
                parsed = JSON.parse(decodedText).studentId;
                } catch(e) {}
                
                const res = await axios.post(`${API_BASE}/attendance/scan`, { studentId: parsed });
                setMsg({ type: 'success', text: `${res.data.message} - ${res.data.attendance.student.studentName}` });
            } catch(e) {
                setMsg({ type: 'error', text: e.response?.data?.message || 'Scan failed' });
            }
        }, (err) => {
            // ignore constant scanning errors
        });
    }, 100);

    return () => {
      if (html5QrcodeScanner) html5QrcodeScanner.clear().catch(e=>console.log(e));
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Gate Check-in/Check-out Scanner</h2>
            {msg && <div className={`p-4 mb-6 rounded-lg text-center font-bold text-lg ${msg.type === 'success' ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300' : 'bg-rose-100 text-rose-800 border-2 border-rose-300'}`}>{msg.text}</div>}
            
            <div id="qr-reader" className="overflow-hidden rounded-xl border-2 border-indigo-100 shadow-inner bg-slate-50"></div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 mb-4">Or manually enter Student ID if scanner is unavailable:</p>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const id = e.target.manualId.value;
                    try {
                        const res = await axios.post(`${API_BASE}/attendance/scan`, { studentId: id });
                        setMsg({ type: 'success', text: `${res.data.message} - ${res.data.attendance.student.studentName}` });
                        e.target.reset();
                    } catch(err) {
                        setMsg({ type: 'error', text: err.response?.data?.message || 'Manual entry failed' });
                    }
                }} className="flex justify-center max-w-sm mx-auto">
                    <input name="manualId" type="text" placeholder="Student ID" required className="rounded-l-lg border-y border-l border-slate-300 px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full" />
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-r-lg font-medium hover:bg-indigo-700 transition-colors">Submit</button>
                </form>
            </div>
        </div>
    </div>
  );
}

function AttendanceTable() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
    const socket = io('http://localhost:5000');
    socket.on('attendanceUpdate', (newRecord) => {
      setRecords(prev => [newRecord, ...prev]);
    });
    return () => socket.disconnect();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_BASE}/attendance`);
      setRecords(res.data);
    } catch(e) { console.error(e) }
  };

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-wrap gap-3 justify-between items-center bg-slate-50">
            <h2 className="text-xl font-bold text-gray-800">Attendance Log</h2>
            <div className="flex gap-2">
              <button onClick={fetchRecords} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center bg-white px-3 py-1.5 rounded shadow-sm border border-slate-200">
                  <i className="fa-solid fa-rotate mr-2"></i> Refresh
              </button>
              <button onClick={() => {
                const rows = [['Student Name','Student ID','Status','Time','Late Entry'],
                  ...records.map(r => [r.student?.studentName||'N/A', r.student?.studentId||'', r.status, new Date(r.timestamp).toLocaleString(), r.lateEntry?'Yes':'No'])];
                const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
                const a = document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
                a.download='attendance.csv'; a.click();
              }} className="text-emerald-700 hover:text-emerald-900 text-sm font-medium flex items-center bg-white px-3 py-1.5 rounded shadow-sm border border-slate-200">
                  <i className="fa-solid fa-file-csv mr-2"></i> Export CSV
              </button>
            </div>
        </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Anomalies</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map(r => (
              <tr key={r._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.student?.studentName || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono bg-slate-50">{r.student?.studentId || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${r.status==='IN'?'bg-emerald-100 text-emerald-800 border border-emerald-200':'bg-rose-100 text-rose-800 border border-rose-200'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(r.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {r.lateEntry ? (
                        <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded border border-amber-200 flex items-center w-fit">
                            <i className="fa-solid fa-triangle-exclamation mr-1"></i> Late Entry
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400">-</span>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Settings() {
  const [settings, setSettings] = useState({
    weekdayCheckIn: '06:00', weekdayClosing: '21:00',
    weekendCheckIn: '06:00', weekendClosing: '22:00',
    reminderTime: 15, graceTime: 10
  });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/settings`).then(res => setSettings(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/settings`, settings);
      setMsg({ type: 'success', text: 'Settings updated successfully' });
    } catch(err) {
      setMsg({ type: 'error', text: 'Failed to update settings' });
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-8 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-4 flex items-center">
          <i className="fa-solid fa-sliders text-indigo-500 mr-3"></i> Hostel Configuration
      </h2>
      {msg && <div className={`p-4 mb-6 rounded-lg font-medium shadow-sm ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-700 mb-4 uppercase tracking-wider text-sm"><i className="fa-solid fa-calendar-week mr-2"></i> Weekdays</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Morning Open Time</label>
                    <input type="time" required value={settings.weekdayCheckIn}
                    onChange={e => setSettings({...settings, weekdayCheckIn: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Night Closing Time</label>
                    <input type="time" required value={settings.weekdayClosing}
                    onChange={e => setSettings({...settings, weekdayClosing: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-700 mb-4 uppercase tracking-wider text-sm"><i className="fa-solid fa-calendar-day mr-2"></i> Weekends</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Morning Open Time</label>
                    <input type="time" required value={settings.weekendCheckIn}
                    onChange={e => setSettings({...settings, weekendCheckIn: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Night Closing Time</label>
                    <input type="time" required value={settings.weekendClosing}
                    onChange={e => setSettings({...settings, weekendClosing: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-700 mb-4 uppercase tracking-wider text-sm"><i className="fa-solid fa-clock mr-2"></i> Alerts & Tolerance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Reminder Time (minutes before closing)</label>
                    <input type="number" required value={settings.reminderTime}
                    onChange={e => setSettings({...settings, reminderTime: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Grace Period (minutes allowed after closing)</label>
                    <input type="number" required value={settings.graceTime}
                    onChange={e => setSettings({...settings, graceTime: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>
        </div>
        
        <div className="pt-4">
            <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all font-medium flex items-center">
            <i className="fa-solid fa-save mr-2"></i> Save Configurations
            </button>
        </div>
      </form>
    </div>
  );
}

function Reports() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/attendance`),
      axios.get(`${API_BASE}/students`)
    ]).then(([attRes, stuRes]) => {
      setRecords(attRes.data);
      setStudents(stuRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalScans  = records.length;
  const lateEntries = records.filter(r => r.lateEntry).length;
  const inCount     = records.filter(r => r.status === 'IN').length;
  const outCount    = records.filter(r => r.status === 'OUT').length;

  // Per-student summary
  const perStudent = students.map(s => {
    const mine = records.filter(r => r.student?.studentId === s.studentId);
    const late = mine.filter(r => r.lateEntry).length;
    const last = mine[0];
    return { ...s, scans: mine.length, late, lastStatus: last?.status, lastTime: last?.timestamp };
  }).sort((a,b) => b.scans - a.scans);

  // Today's scans
  const today = new Date().toDateString();
  const todayScans = records.filter(r => new Date(r.timestamp).toDateString() === today).length;

  const StatBox = ({label, value, icon, color}) => (
    <div className={`rounded-2xl p-6 border flex items-center gap-4 ${color}`}>
      <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center text-2xl">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</p>
        <p className="text-3xl font-black">{value}</p>
      </div>
    </div>
  );

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400"><i className="fa-solid fa-circle-notch animate-spin text-3xl"></i></div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatBox label="Total Scans" value={totalScans} icon="fa-barcode" color="bg-indigo-100 text-indigo-800 border-indigo-200" />
        <StatBox label="Today's Scans" value={todayScans} icon="fa-calendar-day" color="bg-sky-100 text-sky-800 border-sky-200" />
        <StatBox label="Late Entries" value={lateEntries} icon="fa-triangle-exclamation" color="bg-amber-100 text-amber-800 border-amber-200" />
        <StatBox label="Check-Ins" value={inCount} icon="fa-right-to-bracket" color="bg-emerald-100 text-emerald-800 border-emerald-200" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Student Activity Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Scans</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Late Entries</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Seen</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {perStudent.map(s => (
                <tr key={s._id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-sm">{s.studentName.charAt(0)}</div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800">{s.studentName}</p>
                        <p className="text-xs text-slate-400 font-mono">{s.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{s.scans}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {s.late > 0
                      ? <span className="px-2 py-1 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded-lg">{s.late} late</span>
                      : <span className="text-xs text-slate-400">—</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {s.lastStatus
                      ? <span className={`px-3 py-1 text-xs font-bold rounded-full border ${s.lastStatus==='IN'?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>{s.lastStatus}</span>
                      : <span className="text-xs text-slate-400">No data</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                    {s.lastTime ? new Date(s.lastTime).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
              {perStudent.length === 0 && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400">No data yet. Register students and scan QR codes to populate reports.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
