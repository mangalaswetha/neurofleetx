import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const items = [
  { path:'/booking',         label:'Book a Ride',  icon:'🚗' },
  { path:'/booking/history', label:'My Bookings',  icon:'📋' },
];

export default function CustomerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem('name') || 'Customer';

  return (
    <div style={{ background:'#120a1f', borderRight:'1px solid rgba(168,85,247,0.15)', display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <div style={{ padding:'1.5rem 1.25rem', borderBottom:'1px solid rgba(168,85,247,0.15)' }}>
        <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:'1.3rem', fontWeight:'700', color:'#a855f7' }}>⚡ NEUROFLEETX</div>
        <div style={{ fontSize:'0.65rem', color:'#a855f7', marginTop:'3px', letterSpacing:'0.08em', fontWeight:'600' }}>CUSTOMER PORTAL</div>
      </div>
      <nav style={{ padding:'1rem 0', flex:1 }}>
        {items.map(item => {
          const active = location.pathname === item.path;
          return (
            <div key={item.path} onClick={() => navigate(item.path)} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'0.65rem 1.25rem', cursor:'pointer', fontSize:'0.82rem', color:active?'#a855f7':'#64748b', background:active?'rgba(168,85,247,0.08)':'transparent', borderLeft:`2px solid ${active?'#a855f7':'transparent'}`, transition:'all 0.2s' }}>
              <span style={{ fontSize:'14px' }}>{item.icon}</span>{item.label}
            </div>
          );
        })}
      </nav>
      <div style={{ padding:'1rem 1.25rem', borderTop:'1px solid rgba(168,85,247,0.15)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'0.75rem' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(168,85,247,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', color:'#a855f7', fontWeight:'700' }}>{name.charAt(0)}</div>
          <div><div style={{ fontSize:'0.78rem', color:'#94a3b8' }}>{name}</div><div style={{ fontSize:'0.65rem', color:'#a855f7' }}>CUSTOMER</div></div>
        </div>
        <button onClick={() => { localStorage.clear(); window.location='/login'; }} style={{ width:'100%', background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.2)', color:'#a855f7', padding:'6px', borderRadius:'6px', cursor:'pointer', fontSize:'0.75rem' }}>Logout</button>
      </div>
    </div>
  );
}