import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

const NAV = [
  { path:'/admin',             label:'Dashboard',     icon:'⊞' },
  { path:'/admin/bookings',    label:'Bookings',      icon:'📋', badge:true },
  { path:'/admin/tracking',    label:'Live Tracking', icon:'📡' },
  { path:'/admin/maintenance', label:'Predictive AI', icon:'🤖' },
  { path:'/admin/routes',      label:'Route AI',      icon:'🗺' },
  { path:'/admin/analytics',   label:'Analytics',     icon:'📊' },
  { path:'/admin/fleet',       label:'Fleet',         icon:'🚗' },
];

export default function AdminLayout({ children }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { tick, getPendingBookings } = useBooking();
  const [pending, setPending] = useState(0);
  const name = localStorage.getItem('name') || 'Admin';
  const rc   = '#38bdf8';

  React.useEffect(()=>{ setPending(getPendingBookings().length); },[tick]);

  return (
    <div style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'100vh',fontFamily:'DM Sans,sans-serif'}}>
      <aside style={{background:'#0a1020',borderRight:`1px solid ${rc}18`,display:'flex',flexDirection:'column'}}>
        <div style={{padding:'1.5rem 1.25rem 1.25rem',borderBottom:`1px solid ${rc}15`}}>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.4rem',fontWeight:'800'}}>
            <span style={{color:'#fff'}}>NFX</span><span style={{color:rc}}>.</span>
          </div>
          <div style={{fontSize:'0.62rem',color:rc,letterSpacing:'0.2em',marginTop:'3px',fontWeight:'600'}}>ADMIN PORTAL</div>
        </div>
        <nav style={{padding:'1rem 0.75rem',flex:1,display:'flex',flexDirection:'column',gap:'2px'}}>
          {NAV.map(item=>{
            const isActive = location.pathname===item.path;
            return (
              <button key={item.path} onClick={()=>navigate(item.path)}
                style={{display:'flex',alignItems:'center',gap:'10px',padding:'0.65rem 0.9rem',borderRadius:'10px',border:'none',cursor:'pointer',width:'100%',textAlign:'left',background:isActive?`${rc}15`:'transparent',position:'relative'}}>
                <span style={{fontSize:'15px'}}>{item.icon}</span>
                <span style={{fontSize:'0.83rem',fontWeight:isActive?'600':'400',color:isActive?'#fff':'#64748b',fontFamily:'DM Sans,sans-serif'}}>{item.label}</span>
                {item.badge&&pending>0&&<span style={{marginLeft:'auto',background:'#ef4444',color:'#fff',borderRadius:'99px',fontSize:'0.62rem',fontWeight:'700',padding:'1px 6px'}}>{pending}</span>}
                {isActive&&<div style={{position:'absolute',left:0,top:'25%',bottom:'25%',width:'3px',borderRadius:'0 2px 2px 0',background:rc}}/>}
              </button>
            );
          })}
        </nav>
        <div style={{padding:'1rem 0.75rem',borderTop:`1px solid ${rc}15`}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'0.6rem 0.9rem',borderRadius:'10px',background:`${rc}08`,marginBottom:'0.5rem'}}>
            <div style={{width:'30px',height:'30px',borderRadius:'50%',background:`${rc}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.82rem',color:rc,fontWeight:'800',fontFamily:'Syne,sans-serif'}}>{name[0]}</div>
            <div>
              <div style={{fontSize:'0.8rem',fontWeight:'500',color:'#e2e8f0'}}>{name}</div>
              <div style={{fontSize:'0.62rem',color:rc}}>ADMIN</div>
            </div>
          </div>
          <button onClick={()=>{localStorage.clear();window.location='/login';}}
            style={{width:'100%',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.15)',color:'#f87171',padding:'0.6rem',borderRadius:'8px',cursor:'pointer',fontSize:'0.78rem'}}>
            Sign Out
          </button>
        </div>
      </aside>
      <main style={{background:'#080f1e',overflowY:'auto',minHeight:'100vh'}}>{children}</main>
    </div>
  );
}