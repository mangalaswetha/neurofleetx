import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const items = [
  { path:'/driver',        label:'My Trips',    icon:'🚦' },
  { path:'/driver/routes', label:'Navigation',  icon:'🗺' },
];

export default function DriverSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem('name') || 'Driver';

  return (
    <div style={{ background:'#0a1a0a', borderRight:'1px solid rgba(0,255,136,0.15)', display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <div style={{ padding:'1.5rem 1.25rem', borderBottom:'1px solid rgba(0,255,136,0.15)' }}>
        <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:'1.3rem', fontWeight:'700', color:'#00ff88' }}>⚡ NEUROFLEETX</div>
        <div style={{ fontSize:'0.65rem', color:'#00ff88', marginTop:'3px', letterSpacing:'0.08em', fontWeight:'600' }}>DRIVER PORTAL</div>
      </div>
      <nav style={{ padding:'1rem 0', flex:1 }}>
        {items.map(item => {
          const active = location.pathname === item.path;
          return (
            <div key={item.path} onClick={() => navigate(item.path)} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'0.65rem 1.25rem', cursor:'pointer', fontSize:'0.82rem', color:active?'#00ff88':'#64748b', background:active?'rgba(0,255,136,0.06)':'transparent', borderLeft:`2px solid ${active?'#00ff88':'transparent'}`, transition:'all 0.2s' }}>
              <span style={{ fontSize:'14px' }}>{item.icon}</span>{item.label}
            </div>
          );
        })}
      </nav>
      <div style={{ padding:'1rem 1.25rem', borderTop:'1px solid rgba(0,255,136,0.15)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'0.75rem' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(0,255,136,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', color:'#00ff88', fontWeight:'700' }}>{name.charAt(0)}</div>
          <div><div style={{ fontSize:'0.78rem', color:'#94a3b8' }}>{name}</div><div style={{ fontSize:'0.65rem', color:'#00ff88' }}>DRIVER</div></div>
        </div>
        <button onClick={() => { localStorage.clear(); window.location='/login'; }} style={{ width:'100%', background:'rgba(0,255,136,0.1)', border:'1px solid rgba(0,255,136,0.2)', color:'#00ff88', padding:'6px', borderRadius:'6px', cursor:'pointer', fontSize:'0.75rem' }}>Logout</button>
      </div>
    </div>
  );
}