import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

export default function DriverLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getPendingBookings } = useBooking();
  const name = localStorage.getItem('name') || 'Driver';
  const pending = getPendingBookings().length;
  const roleColor = '#4ade80';

  const items = [
    { path:'/driver',       label:'Dashboard', icon:'🚦', badge: pending },
    { path:'/driver/trips', label:'My Trips',  icon:'📋' },
    { path:'/driver/map',   label:'Navigation',icon:'🗺' },
  ];

  return (
    <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'100vh', fontFamily:'DM Sans,sans-serif' }}>
      <aside style={{ background:'#050f08', borderRight:`1px solid ${roleColor}18`, display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'1.75rem 1.5rem 1.25rem', borderBottom:`1px solid ${roleColor}15` }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.5rem', fontWeight:'800' }}>
            <span style={{ color:'#fff' }}>NFX</span><span style={{ color:roleColor }}>.</span>
          </div>
          <div style={{ fontSize:'0.65rem', color:roleColor, letterSpacing:'0.2em', marginTop:'3px', fontWeight:'600' }}>DRIVER PORTAL</div>
        </div>
        <nav style={{ padding:'1rem 0.75rem', flex:1, display:'flex', flexDirection:'column', gap:'2px' }}>
          {items.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ display:'flex', alignItems:'center', gap:'10px', padding:'0.7rem 0.9rem', borderRadius:'10px', border:'none', cursor:'pointer', width:'100%', textAlign:'left', background: isActive?`${roleColor}15`:'transparent', position:'relative' }}>
                <span style={{ fontSize:'16px' }}>{item.icon}</span>
                <span style={{ fontSize:'0.85rem', fontWeight:isActive?'600':'400', color:isActive?'#fff':'#64748b', fontFamily:'DM Sans,sans-serif' }}>{item.label}</span>
                {item.badge > 0 && <span style={{ marginLeft:'auto', background:'#ef4444', color:'#fff', borderRadius:'99px', fontSize:'0.65rem', fontWeight:'700', padding:'1px 7px' }}>{item.badge}</span>}
                {isActive && <div style={{ position:'absolute', left:0, top:'25%', bottom:'25%', width:'3px', borderRadius:'0 2px 2px 0', background:roleColor }} />}
              </button>
            );
          })}
        </nav>
        <div style={{ padding:'1rem 0.75rem', borderTop:`1px solid ${roleColor}15` }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'0.6rem 0.9rem', borderRadius:'10px', background:`${roleColor}08`, marginBottom:'0.5rem' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:`${roleColor}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', color:roleColor, fontWeight:'800', fontFamily:'Syne,sans-serif' }}>{name[0]}</div>
            <div>
              <div style={{ fontSize:'0.82rem', fontWeight:'500', color:'#e2e8f0' }}>{name}</div>
              <div style={{ fontSize:'0.65rem', color:roleColor }}>DRIVER</div>
            </div>
          </div>
          <button onClick={() => { localStorage.clear(); window.location='/login'; }}
            style={{ width:'100%', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)', color:'#f87171', padding:'0.6rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.8rem' }}>
            Sign Out
          </button>
        </div>
      </aside>
      <main style={{ overflowY:'auto', minHeight:'100vh' }}>{children}</main>
    </div>
  );
}