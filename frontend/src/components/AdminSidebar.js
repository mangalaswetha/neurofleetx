import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path:'/admin',       label:'Dashboard',    icon:'⊞' },
  { path:'/fleet',       label:'Fleet',        icon:'🚗' },
  { path:'/routes',      label:'Route AI',     icon:'🗺' },
  { path:'/maintenance', label:'Maintenance',  icon:'🔧' },
  { path:'/booking',     label:'Bookings',     icon:'📅' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem('name') || 'User';
  const role = localStorage.getItem('role') || 'USER';

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ background:'#080c18', borderRight:'1px solid rgba(0,212,255,0.1)', display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <div style={{ padding:'1.5rem 1.25rem', borderBottom:'1px solid rgba(0,212,255,0.1)' }}>
        <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:'1.4rem', fontWeight:'700', color:'#00d4ff', letterSpacing:'0.08em' }}>⚡ NEUROFLEETX</div>
        <div style={{ fontSize:'0.65rem', color:'#475569', letterSpacing:'0.05em', marginTop:'2px' }}>AI URBAN MOBILITY</div>
      </div>

      <nav style={{ padding:'1rem 0', flex:1 }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <div key={item.path} onClick={() => navigate(item.path)}
              style={{ display:'flex', alignItems:'center', gap:'10px', padding:'0.65rem 1.25rem', cursor:'pointer', fontSize:'0.82rem', color: active ? '#00d4ff' : '#64748b', background: active ? 'rgba(0,212,255,0.06)' : 'transparent', borderLeft:`2px solid ${active ? '#00d4ff' : 'transparent'}`, transition:'all 0.2s' }}>
              <span style={{ fontSize:'14px' }}>{item.icon}</span>
              {item.label}
            </div>
          );
        })}
      </nav>

      <div style={{ padding:'1rem 1.25rem', borderTop:'1px solid rgba(0,212,255,0.1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'0.75rem' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(0,212,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', color:'#00d4ff', fontWeight:'600' }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:'0.78rem', color:'#94a3b8' }}>{name}</div>
            <div style={{ fontSize:'0.65rem', color:'#475569' }}>{role}</div>
          </div>
        </div>
        <button onClick={logout}
          style={{ width:'100%', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', padding:'6px', borderRadius:'6px', cursor:'pointer', fontSize:'0.75rem' }}>
          Logout
        </button>
      </div>
    </div>
  );
}