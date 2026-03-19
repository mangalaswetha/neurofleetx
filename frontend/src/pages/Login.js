import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ROLE_THEMES = {
  ADMIN:         { color: '#38bdf8', bg: 'rgba(56,189,248,0.08)',   label: 'Admin Portal',        icon: '⬡' },
  CUSTOMER:      { color: '#c482ff', bg: 'rgba(196,130,255,0.08)',  label: 'Customer Portal',     icon: '◈' },
  DRIVER:        { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',   label: 'Driver Portal',       icon: '◎' },
  FLEET_MANAGER: { color: '#fb923c', bg: 'rgba(251,146,60,0.08)',   label: 'Fleet Manager Portal',icon: '◇' },
};

const DEMO_USERS = [
  { email:'admin@neurofleetx.com',   password:'admin123',   role:'ADMIN',         name:'Super Admin' },
  { email:'customer@neurofleetx.com',password:'cust123',    role:'CUSTOMER',      name:'Jane Customer' },
  { email:'driver@neurofleetx.com',  password:'driver123',  role:'DRIVER',        name:'Raj Driver' },
  { email:'manager@neurofleetx.com', password:'fleet123',   role:'FLEET_MANAGER', name:'Fleet Manager' },
];

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [hoveredRole, setHoveredRole] = useState(null);
  const navigate = useNavigate();

  const ROLE_ROUTES = { ADMIN:'/admin', CUSTOMER:'/customer', DRIVER:'/driver', FLEET_MANAGER:'/fleet' };

  const doLogin = async (e) => {
    e?.preventDefault();
    setLoading(true); setError('');
    // Try backend first
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email, password }, { timeout: 3000 });
      storeAndRedirect(res.data.token, res.data.role, res.data.name, res.data.id);
      return;
    } catch {}
    // Fallback: demo users
    const demo = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demo) {
      storeAndRedirect('demo-token-' + Date.now(), demo.role, demo.name, Math.floor(Math.random()*1000));
    } else {
      setError('Invalid credentials. Try a demo account below.');
    }
    setLoading(false);
  };

  const storeAndRedirect = (token, role, name, id) => {
    localStorage.setItem('token', token);
    localStorage.setItem('nfx_token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    localStorage.setItem('userId', id || Math.floor(Math.random()*1000));
    navigate(ROLE_ROUTES[role] || '/login');
  };

  const quickLogin = (user) => {
    setEmail(user.email); setPassword(user.password);
    setTimeout(() => {
      storeAndRedirect('demo-token-' + Date.now(), user.role, user.name, Math.floor(Math.random()*1000));
    }, 300);
  };

  const theme = ROLE_THEMES[hoveredRole] || { color:'#38bdf8', label:'', icon:'' };

  return (
    <div style={{ minHeight:'100vh', background:'#060912', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', position:'relative', overflow:'hidden' }}>
      {/* Background grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
      {/* Glow orbs */}
      <div style={{ position:'absolute', top:'20%', left:'15%', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(56,189,248,0.04)', filter:'blur(60px)' }} />
      <div style={{ position:'absolute', bottom:'20%', right:'15%', width:'250px', height:'250px', borderRadius:'50%', background:'rgba(196,130,255,0.04)', filter:'blur(60px)' }} />

      <div style={{ position:'relative', width:'100%', maxWidth:'460px' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'2.8rem', fontWeight:'800', letterSpacing:'-0.02em', lineHeight:1 }}>
            <span style={{ color:'#fff' }}>NEURO</span>
            <span style={{ color: theme.color, transition:'color 0.3s' }}>FLEET</span>
            <span style={{ color:'#fff' }}>X</span>
          </div>
          <div style={{ color:'#334155', fontSize:'0.8rem', letterSpacing:'0.25em', marginTop:'6px', fontWeight:'500' }}>
            AI-DRIVEN URBAN MOBILITY
          </div>
        </div>

        {/* Card */}
        <div style={{ background:'rgba(13,20,36,0.9)', border:'1px solid rgba(56,189,248,0.1)', borderRadius:'20px', padding:'2.5rem', backdropFilter:'blur(20px)' }}>
          <form onSubmit={doLogin} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            <div>
              <label style={{ color:'#94a3b8', fontSize:'0.78rem', fontWeight:'500', display:'block', marginBottom:'8px', letterSpacing:'0.05em' }}>EMAIL ADDRESS</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="your@email.com"
                style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(56,189,248,0.15)', borderRadius:'10px', padding:'0.8rem 1.1rem', color:'#e2e8f0', fontSize:'0.95rem', outline:'none', transition:'border-color 0.2s', fontFamily:'DM Sans,sans-serif' }} />
            </div>
            <div>
              <label style={{ color:'#94a3b8', fontSize:'0.78rem', fontWeight:'500', display:'block', marginBottom:'8px', letterSpacing:'0.05em' }}>PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(56,189,248,0.15)', borderRadius:'10px', padding:'0.8rem 1.1rem', color:'#e2e8f0', fontSize:'0.95rem', outline:'none', fontFamily:'DM Sans,sans-serif' }} />
            </div>
            {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'8px', padding:'0.65rem 1rem', color:'#fca5a5', fontSize:'0.82rem' }}>{error}</div>}
            <button type="submit" disabled={loading}
              style={{ background:'linear-gradient(135deg,#38bdf8,#818cf8)', color:'#060912', border:'none', padding:'0.9rem', borderRadius:'10px', fontWeight:'800', cursor:'pointer', fontSize:'1rem', fontFamily:'Syne,sans-serif', letterSpacing:'0.05em', transition:'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'SIGNING IN...' : 'SIGN IN →'}
            </button>
          </form>

          <div style={{ marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color:'#475569', fontSize:'0.75rem', letterSpacing:'0.08em', marginBottom:'1rem', textAlign:'center' }}>QUICK ACCESS — DEMO ACCOUNTS</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
              {DEMO_USERS.map(user => {
                const t = ROLE_THEMES[user.role];
                return (
                  <button key={user.role} onClick={() => quickLogin(user)}
                    onMouseEnter={() => setHoveredRole(user.role)}
                    onMouseLeave={() => setHoveredRole(null)}
                    style={{ background:`rgba(${t.color==='#38bdf8'?'56,189,248':t.color==='#c482ff'?'196,130,255':t.color==='#4ade80'?'74,222,128':'251,146,60'},0.06)`, border:`1px solid rgba(${t.color==='#38bdf8'?'56,189,248':t.color==='#c482ff'?'196,130,255':t.color==='#4ade80'?'74,222,128':'251,146,60'},0.2)`, borderRadius:'8px', padding:'0.65rem 0.75rem', cursor:'pointer', transition:'all 0.2s', textAlign:'left' }}>
                    <div style={{ color: t.color, fontSize:'0.72rem', fontWeight:'700', letterSpacing:'0.08em', fontFamily:'Syne,sans-serif' }}>{t.icon} {user.role.replace('_',' ')}</div>
                    <div style={{ color:'#64748b', fontSize:'0.68rem', marginTop:'2px' }}>{user.email}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p style={{ textAlign:'center', marginTop:'1.5rem', color:'#334155', fontSize:'0.82rem' }}>
          No account? <Link to="/register" style={{ color:'#38bdf8', fontWeight:'600' }}>Create one →</Link>
        </p>
      </div>
    </div>
  );
}