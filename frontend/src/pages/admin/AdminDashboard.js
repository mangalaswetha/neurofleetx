import React, { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';

const VEHICLES = [
  {id:1,name:'Tesla Model 3', plate:'TN01AB1234',type:'EV',   status:'AVAILABLE',  fuel:85, isEv:true },
  {id:2,name:'Toyota Camry',  plate:'TN02CD5678',type:'SEDAN',status:'IN_USE',     fuel:72, isEv:false},
  {id:3,name:'Ford Transit',  plate:'TN03EF9012',type:'TRUCK',status:'MAINTENANCE',fuel:45, isEv:false},
  {id:4,name:'Honda City',    plate:'TN04GH3456',type:'SEDAN',status:'AVAILABLE',  fuel:91, isEv:false},
  {id:5,name:'BYD e6 MPV',    plate:'TN05IJ7890',type:'EV',   status:'AVAILABLE',  fuel:100,isEv:true },
];
const SC  = {AVAILABLE:'#4ade80',IN_USE:'#facc15',MAINTENANCE:'#f87171',IDLE:'#94a3b8'};
const BC  = {PENDING:'#facc15',ACCEPTED:'#38bdf8',IN_PROGRESS:'#4ade80',COMPLETED:'#94a3b8',CANCELLED:'#f87171'};

export default function AdminDashboard() {
  const { tick, getAllBookings, getLiveBookings } = useBooking();
  const [all,  setAll]  = useState([]);
  const [live, setLive] = useState([]);
  const [time, setTime] = useState(new Date());
  const [tab,  setTab]  = useState('ALL');

  useEffect(() => {
    setAll(getAllBookings());
    setLive(getLiveBookings());
  }, [tick]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pending   = all.filter(b=>b.status==='PENDING');
  const completed = all.filter(b=>b.status==='COMPLETED');
  const revenue   = completed.reduce((s,b)=>s+(b.price||0),0);
  const tabData   = tab==='ALL'?all : tab==='LIVE'?live : tab==='PENDING'?pending : tab==='COMPLETED'?completed : all.filter(b=>b.status===tab);

  const Card = ({children,style})=><div style={{background:'rgba(56,189,248,0.04)',border:'1px solid rgba(56,189,248,0.1)',borderRadius:'14px',padding:'1.25rem',...style}}>{children}</div>;

  return (
    <div style={{padding:'2rem',background:'#080f1e',minHeight:'100vh',color:'#e2e8f0'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2rem'}}>
        <div>
          <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'1.9rem',fontWeight:'800',color:'#fff'}}>Fleet Command</h1>
          <p style={{color:'#475569',fontSize:'0.82rem',marginTop:'4px'}}>All data persists permanently · Chennai</p>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.4rem',fontWeight:'700',color:'#38bdf8'}}>{time.toLocaleTimeString()}</div>
          <div style={{color:'#475569',fontSize:'0.75rem'}}>{time.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'10px',marginBottom:'1.5rem'}}>
        {[['Fleet',VEHICLES.length,'#38bdf8','🚗'],['Live',live.length,'#4ade80','🟢'],['Pending',pending.length,'#facc15','⏳'],['Completed',completed.length,'#94a3b8','✓'],['Revenue',`₹${revenue}`,'#c482ff','₹']].map(([l,v,c,i])=>(
          <Card key={l}>
            <div style={{fontSize:'1.3rem',marginBottom:'4px'}}>{i}</div>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.8rem',fontWeight:'800',color:c,lineHeight:1}}>{v}</div>
            <div style={{color:'#64748b',fontSize:'0.72rem',marginTop:'4px'}}>{l}</div>
          </Card>
        ))}
      </div>

      {/* Live Rides Banner */}
      {live.length>0&&(
        <Card style={{marginBottom:'1.25rem',border:'1px solid rgba(74,222,128,0.25)'}}>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.78rem',fontWeight:'700',color:'#4ade80',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>
            🟢 LIVE RIDES ({live.length})
          </div>
          {live.map(b=>(
            <div key={b.id} style={{background:'rgba(74,222,128,0.06)',border:'1px solid rgba(74,222,128,0.15)',borderRadius:'10px',padding:'1rem',marginBottom:'8px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <span style={{fontFamily:'Syne,sans-serif',fontWeight:'700',color:'#4ade80'}}>{b.id}</span>
                <span style={{background:`${BC[b.status]}15`,color:BC[b.status],padding:'2px 10px',borderRadius:'99px',fontSize:'0.68rem',fontWeight:'700'}}>{b.status.replace('_',' ')}</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px'}}>
                <div><div style={{color:'#64748b',fontSize:'0.65rem'}}>Customer</div><div style={{color:'#e2e8f0',fontSize:'0.82rem',fontWeight:'500'}}>{b.customerName}</div><div style={{color:'#38bdf8',fontSize:'0.7rem'}}>📞 {b.customerPhone}</div></div>
                <div><div style={{color:'#64748b',fontSize:'0.65rem'}}>Driver</div><div style={{color:'#e2e8f0',fontSize:'0.82rem',fontWeight:'500'}}>{b.driverName||'—'}</div><div style={{color:'#4ade80',fontSize:'0.7rem'}}>{b.driverPhone?`📞 ${b.driverPhone}`:''}</div></div>
                <div><div style={{color:'#64748b',fontSize:'0.65rem'}}>Route</div><div style={{color:'#e2e8f0',fontSize:'0.78rem'}}>{b.pickup}</div><div style={{color:'#94a3b8',fontSize:'0.7rem'}}>→ {b.dropoff}</div></div>
                <div><div style={{color:'#64748b',fontSize:'0.65rem'}}>Vehicle · Fare</div><div style={{color:'#e2e8f0',fontSize:'0.78rem'}}>{b.vehicleName}</div><div style={{color:'#c482ff',fontWeight:'700',fontSize:'0.82rem'}}>₹{b.price}</div></div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Main grid */}
      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:'1.25rem'}}>
        {/* Bookings table */}
        <Card>
          {/* Filter tabs */}
          <div style={{display:'flex',gap:'6px',marginBottom:'1rem',flexWrap:'wrap'}}>
            {['ALL','PENDING','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED'].map(f=>(
              <button key={f} onClick={()=>setTab(f)}
                style={{padding:'4px 12px',borderRadius:'99px',border:`1px solid ${tab===f?(BC[f]||'#38bdf8'):'rgba(56,189,248,0.15)'}`,background:tab===f?`${BC[f]||'#38bdf8'}15`:'transparent',color:tab===f?(BC[f]||'#38bdf8'):'#64748b',cursor:'pointer',fontSize:'0.72rem',fontWeight:'600',transition:'all 0.15s'}}>
                {f.replace('_',' ')} ({(f==='ALL'?all:all.filter(b=>b.status===f)).length})
              </button>
            ))}
          </div>

          <div style={{maxHeight:'380px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'8px'}}>
            {tabData.length===0&&<p style={{color:'#475569',fontSize:'0.82rem',textAlign:'center',padding:'2rem'}}>No bookings</p>}
            {tabData.map(b=>(
              <div key={b.id} style={{padding:'0.85rem',background:'rgba(255,255,255,0.02)',borderRadius:'10px',border:`1px solid ${BC[b.status]||'#38bdf8'}18`}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                  <span style={{fontFamily:'Syne,sans-serif',fontSize:'0.85rem',fontWeight:'700',color:'#38bdf8'}}>{b.id}</span>
                  <span style={{background:`${BC[b.status]}15`,color:BC[b.status],padding:'2px 8px',borderRadius:'99px',fontSize:'0.65rem',fontWeight:'600'}}>{b.status.replace('_',' ')}</span>
                </div>
                <div style={{fontSize:'0.8rem',color:'#e2e8f0',marginBottom:'3px'}}>👤 {b.customerName} <span style={{color:'#475569'}}>→</span> 🚗 {b.vehicleName}</div>
                <div style={{fontSize:'0.72rem',color:'#475569',marginBottom:'3px'}}>📍 {b.pickup} → {b.dropoff}</div>
                {b.driverName&&<div style={{fontSize:'0.72rem',color:'#4ade80'}}>🚦 {b.driverName} · 📞 {b.driverPhone}</div>}
                <div style={{display:'flex',justifyContent:'space-between',marginTop:'4px'}}>
                  <span style={{fontSize:'0.68rem',color:'#334155'}}>{new Date(b.createdAt).toLocaleString()}</span>
                  <span style={{fontFamily:'Syne,sans-serif',fontSize:'0.85rem',fontWeight:'700',color:'#c482ff'}}>₹{b.price}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Fleet */}
        <Card>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.78rem',fontWeight:'700',color:'#64748b',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>FLEET STATUS</div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'1.25rem'}}>
            {VEHICLES.map(v=>(
              <div key={v.id} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px',background:'rgba(255,255,255,0.02)',borderRadius:'8px'}}>
                <div style={{width:'7px',height:'7px',borderRadius:'50%',background:SC[v.status],flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:'0.82rem',color:'#e2e8f0',fontWeight:'500'}}>{v.name}</div>
                  <div style={{fontSize:'0.68rem',color:'#475569'}}>{v.plate}</div>
                </div>
                <div style={{width:'55px'}}>
                  <div style={{height:'4px',background:'rgba(255,255,255,0.06)',borderRadius:'2px'}}>
                    <div style={{width:`${v.fuel}%`,height:'100%',background:v.fuel>50?'#4ade80':'#f87171',borderRadius:'2px'}}/>
                  </div>
                  <div style={{fontSize:'0.62rem',color:'#475569',textAlign:'right',marginTop:'2px'}}>{v.fuel}%</div>
                </div>
                <span style={{background:`${SC[v.status]}15`,color:SC[v.status],padding:'2px 7px',borderRadius:'99px',fontSize:'0.62rem',fontWeight:'600',whiteSpace:'nowrap'}}>{v.status.replace('_',' ')}</span>
              </div>
            ))}
          </div>
          {/* Stats */}
          <div style={{borderTop:'1px solid rgba(56,189,248,0.08)',paddingTop:'1rem'}}>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.78rem',fontWeight:'700',color:'#64748b',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>SUMMARY</div>
            {[['Total Bookings',all.length,'#38bdf8'],['Pending',pending.length,'#facc15'],['Completed',completed.length,'#94a3b8'],['Total Revenue',`₹${revenue}`,'#c482ff']].map(([l,v,c])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <span style={{fontSize:'0.78rem',color:'#64748b'}}>{l}</span>
                <span style={{fontFamily:'Syne,sans-serif',fontSize:'1rem',fontWeight:'700',color:c}}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}