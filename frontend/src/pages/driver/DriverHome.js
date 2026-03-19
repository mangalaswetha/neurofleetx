import React, { useState, useEffect, useRef } from 'react';
import { useBooking } from '../../context/BookingContext';

// WhatsApp-style chat — my messages RIGHT, customer LEFT
function ChatBox({ booking }) {
  const { sendMessage, getChat, tick } = useBooking();
  const myId   = localStorage.getItem('userId');
  const myName = localStorage.getItem('name') || 'Driver';
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState([]);
  const endRef = useRef(null);

  useEffect(() => { setMsgs(getChat(booking.id)); }, [tick, booking.id]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);

  const send = () => {
    const t = text.trim(); if (!t) return;
    sendMessage(booking.id, myId, myName, 'DRIVER', t);
    setText('');
  };

  return (
    <div style={{marginTop:'1rem',background:'rgba(0,0,0,0.4)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:'16px',overflow:'hidden'}}>
      <div style={{padding:'10px 14px',background:'rgba(74,222,128,0.08)',borderBottom:'1px solid rgba(74,222,128,0.15)',display:'flex',alignItems:'center',gap:'8px'}}>
        <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#4ade80',boxShadow:'0 0 6px #4ade80'}}/>
        <span style={{fontSize:'0.78rem',color:'#4ade80',fontWeight:'700',fontFamily:'Syne,sans-serif'}}>
          💬 CHAT · {(booking.customerName||'Customer').toUpperCase()}
        </span>
        <span style={{marginLeft:'auto',fontSize:'0.65rem',color:'#475569'}}>{msgs.length} msg · saved</span>
      </div>

      <div style={{height:'240px',overflowY:'auto',padding:'12px',display:'flex',flexDirection:'column',gap:'6px'}}>
        {msgs.length===0&&(
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'6px',color:'#475569'}}>
            <div style={{fontSize:'1.8rem'}}>💬</div><p style={{fontSize:'0.78rem'}}>No messages yet</p>
          </div>
        )}
        {msgs.map(msg => {
          const isMe = String(msg.senderId)===String(myId);
          return (
            <div key={msg.id} style={{display:'flex',flexDirection:'column',alignItems:isMe?'flex-end':'flex-start'}}>
              <div style={{fontSize:'0.62rem',fontWeight:'700',color:isMe?'#4ade80':'#c482ff',marginBottom:'2px',padding:isMe?'0 4px 0 0':'0 0 0 4px'}}>
                {isMe ? '🚗 You' : `👤 ${msg.senderName}`}
              </div>
              <div style={{
                maxWidth:'74%',
                background: isMe?'linear-gradient(135deg,rgba(74,222,128,0.35),rgba(34,197,94,0.2))':'rgba(255,255,255,0.08)',
                border:`1px solid ${isMe?'rgba(74,222,128,0.4)':'rgba(255,255,255,0.12)'}`,
                borderRadius: isMe?'14px 14px 3px 14px':'14px 14px 14px 3px',
                padding:'8px 12px',
              }}>
                <p style={{fontSize:'0.88rem',color:'#e8fdf0',margin:0,lineHeight:1.4}}>{msg.text}</p>
                <p style={{fontSize:'0.6rem',color:'rgba(255,255,255,0.3)',margin:'4px 0 0',textAlign:isMe?'right':'left'}}>
                  {new Date(msg.time).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef}/>
      </div>

      <div style={{display:'flex',gap:'8px',padding:'10px 12px',borderTop:'1px solid rgba(74,222,128,0.12)',background:'rgba(0,0,0,0.2)'}}>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder="Message customer..."
          style={{flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:'99px',padding:'9px 16px',color:'#e8fdf0',fontSize:'0.88rem',outline:'none'}}/>
        <button onClick={send} style={{background:'linear-gradient(135deg,#4ade80,#22c55e)',color:'#050f08',border:'none',padding:'9px 18px',borderRadius:'99px',cursor:'pointer',fontWeight:'800',fontSize:'0.85rem',fontFamily:'Syne,sans-serif'}}>Send ↑</button>
      </div>
    </div>
  );
}

const VEHICLES_LIST = ['Toyota Camry · TN02CD5678','Honda City · TN04GH3456','Ford Transit · TN03EF9012'];
const LOCS = ['Anna Nagar','T. Nagar','Adyar','Velachery','OMR','Tambaram','Guindy','Mylapore','Nungambakkam','Egmore'];

export default function DriverHome() {
  const { tick, getPendingBookings, acceptBooking, startTrip, completeTrip, getBookingsForDriver, setDriverOnline, setDriverOffline } = useBooking();
  const driverId   = localStorage.getItem('userId');
  const driverName = localStorage.getItem('name') || 'Driver';
  const driverPhone= '9876543210';

  const [isOnline,  setIsOnline]  = useState(()=>!!localStorage.getItem('nfx_driver_online'));
  const [location,  setLocation]  = useState(()=>localStorage.getItem('nfx_driver_loc')||'');
  const [vehicle,   setVehicle]   = useState(()=>localStorage.getItem('nfx_driver_veh')||'');
  const [showSetup, setShowSetup] = useState(()=>!localStorage.getItem('nfx_driver_online'));
  const [pending,   setPending]   = useState([]);
  const [myTrips,   setMyTrips]   = useState([]);
  const [openChat,  setOpenChat]  = useState(null);

  // Re-read from localStorage every second via tick
  useEffect(() => {
    setPending(getPendingBookings());
    setMyTrips(getBookingsForDriver(driverId));
  }, [tick, driverId]);

  // Restore online status after login
  useEffect(() => {
    if (localStorage.getItem('nfx_driver_online') && location && vehicle) {
      setDriverOnline(driverId, driverName, location, vehicle.split('·')[0].trim(), driverPhone);
    }
  }, []);

  const activeTrip     = myTrips.find(b=>b.status==='ACCEPTED'||b.status==='IN_PROGRESS');
  const completedTrips = myTrips.filter(b=>b.status==='COMPLETED');
  const earnings       = completedTrips.reduce((s,b)=>s+(b.price||0),0);

  const goOnline = () => {
    if (!location||!vehicle) return;
    localStorage.setItem('nfx_driver_online','1');
    localStorage.setItem('nfx_driver_loc', location);
    localStorage.setItem('nfx_driver_veh', vehicle);
    setDriverOnline(driverId, driverName, location, vehicle.split('·')[0].trim(), driverPhone);
    setIsOnline(true); setShowSetup(false);
  };

  const goOffline = () => {
    localStorage.removeItem('nfx_driver_online');
    setDriverOffline(driverId);
    setIsOnline(false); setShowSetup(true);
  };

  return (
    <div style={{padding:'2rem',background:'#050f08',minHeight:'100vh',color:'#e8fdf0'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2rem'}}>
        <div>
          <p style={{color:'#4d7a5e',fontSize:'0.82rem'}}>Welcome back,</p>
          <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'2rem',fontWeight:'800',color:'#fff'}}>{driverName.split(' ')[0]} <span style={{color:'#4ade80'}}>🚗</span></h1>
        </div>
        <button onClick={isOnline?goOffline:goOnline}
          style={{background:isOnline?'rgba(248,113,113,0.15)':'rgba(74,222,128,0.15)',border:`1px solid ${isOnline?'rgba(248,113,113,0.3)':'rgba(74,222,128,0.3)'}`,color:isOnline?'#f87171':'#4ade80',padding:'8px 20px',borderRadius:'99px',cursor:'pointer',fontWeight:'700',fontSize:'0.85rem',fontFamily:'Syne,sans-serif'}}>
          {isOnline?'● ONLINE':'○ OFFLINE'}
        </button>
      </div>

      {showSetup&&(
        <div style={{background:'rgba(74,222,128,0.06)',border:'1px solid rgba(74,222,128,0.15)',borderRadius:'16px',padding:'1.5rem',marginBottom:'1.5rem'}}>
          <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:'700',color:'#4ade80',marginBottom:'1.25rem'}}>Set Your Availability</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
            <div>
              <label style={{color:'#4d7a5e',fontSize:'0.75rem',fontWeight:'600',display:'block',marginBottom:'6px',letterSpacing:'0.08em'}}>📍 YOUR LOCATION</label>
              <select value={location} onChange={e=>setLocation(e.target.value)}
                style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:'10px',padding:'0.8rem',color:'#e8fdf0',fontSize:'0.9rem',outline:'none'}}>
                <option value="">Select area</option>
                {LOCS.map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{color:'#4d7a5e',fontSize:'0.75rem',fontWeight:'600',display:'block',marginBottom:'6px',letterSpacing:'0.08em'}}>🚗 YOUR VEHICLE</label>
              <select value={vehicle} onChange={e=>setVehicle(e.target.value)}
                style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:'10px',padding:'0.8rem',color:'#e8fdf0',fontSize:'0.9rem',outline:'none'}}>
                <option value="">Select vehicle</option>
                {VEHICLES_LIST.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <button onClick={goOnline} disabled={!location||!vehicle}
            style={{background:(location&&vehicle)?'linear-gradient(135deg,#4ade80,#22c55e)':'rgba(255,255,255,0.05)',color:(location&&vehicle)?'#050f08':'#475569',border:'none',padding:'0.85rem 2rem',borderRadius:'10px',fontWeight:'800',cursor:(location&&vehicle)?'pointer':'not-allowed',fontSize:'1rem',fontFamily:'Syne,sans-serif'}}>
            GO ONLINE →
          </button>
        </div>
      )}

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'1.5rem'}}>
        {[['Trips Done',completedTrips.length,'#4ade80'],['Earnings',`₹${earnings}`,'#facc15'],['New Requests',pending.length,'#c482ff'],['Rating','4.8 ★','#fb923c']].map(([l,v,c])=>(
          <div key={l} style={{background:`${c}06`,border:`1px solid ${c}18`,borderRadius:'12px',padding:'1rem',textAlign:'center'}}>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.5rem',fontWeight:'800',color:c}}>{v}</div>
            <div style={{color:'#4d7a5e',fontSize:'0.72rem',marginTop:'3px'}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Active trip */}
      {activeTrip&&(
        <div style={{background:'rgba(74,222,128,0.08)',border:'2px solid rgba(74,222,128,0.3)',borderRadius:'16px',padding:'1.5rem',marginBottom:'1.5rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
            <h2 style={{fontFamily:'Syne,sans-serif',fontSize:'1.1rem',fontWeight:'800',color:'#4ade80'}}>
              {activeTrip.status==='ACCEPTED'?'🟡 HEADING TO PICKUP':'🟢 TRIP IN PROGRESS'}
            </h2>
            <span style={{background:'rgba(74,222,128,0.15)',color:'#4ade80',padding:'4px 12px',borderRadius:'99px',fontSize:'0.72rem',fontWeight:'700'}}>
              {activeTrip.status.replace('_',' ')}
            </span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.9rem',marginBottom:'1.25rem'}}>
            {[['Customer',activeTrip.customerName],['Phone',activeTrip.customerPhone],['Vehicle',activeTrip.vehicleName],['Booking',activeTrip.id],['From',activeTrip.pickup],['To',activeTrip.dropoff],['Date',activeTrip.date],['Fare',`₹${activeTrip.price}`]].map(([l,v])=>(
              <div key={l}>
                <div style={{color:'#4d7a5e',fontSize:'0.7rem',marginBottom:'2px'}}>{l}</div>
                <div style={{color:'#e8fdf0',fontSize:'0.85rem',fontWeight:'500'}}>
                  {l==='Phone'?<a href={`tel:${v}`} style={{color:'#4ade80',textDecoration:'none'}}>📞 {v}</a>:v}
                </div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'10px',marginBottom:'0.75rem'}}>
            {activeTrip.status==='ACCEPTED'&&(
              <button onClick={()=>startTrip(activeTrip.id)}
                style={{flex:1,background:'linear-gradient(135deg,#4ade80,#22c55e)',color:'#050f08',border:'none',padding:'0.85rem',borderRadius:'10px',fontWeight:'800',cursor:'pointer',fontSize:'1rem',fontFamily:'Syne,sans-serif'}}>
                ▶ START TRIP
              </button>
            )}
            {activeTrip.status==='IN_PROGRESS'&&(
              <button onClick={()=>completeTrip(activeTrip.id)}
                style={{flex:1,background:'linear-gradient(135deg,#facc15,#f59e0b)',color:'#050f08',border:'none',padding:'0.85rem',borderRadius:'10px',fontWeight:'800',cursor:'pointer',fontSize:'1rem',fontFamily:'Syne,sans-serif'}}>
                ✓ COMPLETE TRIP — ₹{activeTrip.price}
              </button>
            )}
          </div>
          <button onClick={()=>setOpenChat(openChat===activeTrip.id?null:activeTrip.id)}
            style={{background:openChat===activeTrip.id?'rgba(74,222,128,0.2)':'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.25)',color:'#4ade80',padding:'7px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'0.82rem',fontWeight:'700',fontFamily:'Syne,sans-serif'}}>
            {openChat===activeTrip.id?'✕ Close Chat':'💬 Chat with Customer'}
          </button>
          {openChat===activeTrip.id&&<ChatBox booking={activeTrip}/>}
        </div>
      )}

      {/* Pending */}
      {isOnline&&!activeTrip&&(
        <div>
          <h2 style={{fontFamily:'Syne,sans-serif',fontSize:'1.1rem',fontWeight:'700',color:'#e8fdf0',marginBottom:'1rem'}}>
            🔔 Incoming Requests ({pending.length})
          </h2>
          {pending.length===0?(
            <div style={{background:'rgba(74,222,128,0.03)',border:'1px solid rgba(74,222,128,0.08)',borderRadius:'14px',padding:'2.5rem',textAlign:'center',color:'#4d7a5e'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>⏳</div>
              <p style={{fontWeight:'500'}}>Waiting for requests near <strong style={{color:'#4ade80'}}>{location}</strong></p>
              <p style={{fontSize:'0.78rem',marginTop:'6px',opacity:0.7}}>Customer bookings appear instantly in real time</p>
            </div>
          ):pending.map(b=>(
            <div key={b.id} style={{background:'rgba(74,222,128,0.06)',border:'1px solid rgba(74,222,128,0.18)',borderRadius:'14px',padding:'1.25rem',marginBottom:'10px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div style={{flex:1}}>
                  <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.85rem',fontWeight:'700',color:'#4ade80',marginBottom:'6px'}}>{b.id}</div>
                  <div style={{fontWeight:'600',color:'#fff',marginBottom:'8px',fontSize:'1rem'}}>👤 {b.customerName}</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
                    {[['📍 Pickup',b.pickup],['🏁 Drop',b.dropoff],['📅 Date',b.date],['🕐 Time',b.time],['🚗 Vehicle',b.vehicleName]].map(([l,v])=>(
                      <div key={l}><span style={{color:'#4d7a5e',fontSize:'0.72rem'}}>{l}: </span><span style={{color:'#e8fdf0',fontSize:'0.78rem',fontWeight:'500'}}>{v}</span></div>
                    ))}
                  </div>
                </div>
                <div style={{textAlign:'right',paddingLeft:'1rem'}}>
                  <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.6rem',fontWeight:'800',color:'#facc15',marginBottom:'10px'}}>₹{b.price}</div>
                  <button onClick={()=>acceptBooking(b.id,driverId,driverName,driverPhone)}
                    style={{background:'linear-gradient(135deg,#4ade80,#22c55e)',color:'#050f08',border:'none',padding:'10px 22px',borderRadius:'8px',fontWeight:'800',cursor:'pointer',fontSize:'0.95rem',fontFamily:'Syne,sans-serif',display:'block',width:'100%',marginBottom:'6px'}}>
                    ACCEPT
                  </button>
                  <button style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',color:'#f87171',padding:'7px 22px',borderRadius:'8px',cursor:'pointer',fontSize:'0.82rem',width:'100%'}}>
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isOnline&&(
        <div style={{textAlign:'center',padding:'3rem',color:'#4d7a5e',background:'rgba(74,222,128,0.03)',borderRadius:'14px',border:'1px solid rgba(74,222,128,0.08)'}}>
          <div style={{fontSize:'3rem',marginBottom:'1rem'}}>💤</div>
          <p style={{fontWeight:'500'}}>You are offline. Go online to receive trip requests.</p>
        </div>
      )}
    </div>
  );
}