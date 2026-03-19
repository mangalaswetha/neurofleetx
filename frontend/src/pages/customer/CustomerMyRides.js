import React, { useState, useEffect, useRef } from 'react';
import { useBooking } from '../../context/BookingContext';

// WhatsApp-style chat — my messages RIGHT, theirs LEFT
function ChatBox({ booking }) {
  const { sendMessage, getChat, tick } = useBooking();
  const myId   = localStorage.getItem('userId');
  const myName = localStorage.getItem('name') || 'Customer';
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState([]);
  const endRef = useRef(null);

  useEffect(() => { setMsgs(getChat(booking.id)); }, [tick, booking.id]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);

  const send = () => {
    const t = text.trim(); if (!t) return;
    sendMessage(booking.id, myId, myName, 'CUSTOMER', t);
    setText('');
  };

  return (
    <div style={{marginTop:'1rem',background:'rgba(0,0,0,0.4)',border:'1px solid rgba(196,130,255,0.2)',borderRadius:'16px',overflow:'hidden'}}>
      <div style={{padding:'10px 14px',background:'rgba(196,130,255,0.08)',borderBottom:'1px solid rgba(196,130,255,0.15)',display:'flex',alignItems:'center',gap:'8px'}}>
        <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#4ade80',boxShadow:'0 0 6px #4ade80'}}/>
        <span style={{fontSize:'0.78rem',color:'#c482ff',fontWeight:'700',fontFamily:'Syne,sans-serif'}}>
          💬 CHAT · {(booking.driverName||'Driver').toUpperCase()}
        </span>
        <span style={{marginLeft:'auto',fontSize:'0.65rem',color:'#475569'}}>{msgs.length} msg</span>
      </div>

      <div style={{height:'240px',overflowY:'auto',padding:'12px',display:'flex',flexDirection:'column',gap:'6px'}}>
        {msgs.length===0&&(
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'6px',color:'#475569'}}>
            <div style={{fontSize:'1.8rem'}}>💬</div><p style={{fontSize:'0.78rem'}}>Say hello!</p>
          </div>
        )}
        {msgs.map(msg => {
          const isMe = String(msg.senderId)===String(myId);
          return (
            <div key={msg.id} style={{display:'flex',flexDirection:'column',alignItems:isMe?'flex-end':'flex-start'}}>
              <div style={{fontSize:'0.62rem',fontWeight:'700',color:isMe?'#c482ff':'#4ade80',marginBottom:'2px',padding:isMe?'0 4px 0 0':'0 0 0 4px'}}>
                {isMe ? '👤 You' : `🚗 ${msg.senderName}`}
              </div>
              <div style={{
                maxWidth:'74%',
                background: isMe?'linear-gradient(135deg,rgba(196,130,255,0.35),rgba(244,114,182,0.2))':'rgba(255,255,255,0.08)',
                border:`1px solid ${isMe?'rgba(196,130,255,0.4)':'rgba(255,255,255,0.12)'}`,
                borderRadius: isMe?'14px 14px 3px 14px':'14px 14px 14px 3px',
                padding:'8px 12px',
              }}>
                <p style={{fontSize:'0.88rem',color:'#f1e8ff',margin:0,lineHeight:1.4}}>{msg.text}</p>
                <p style={{fontSize:'0.6rem',color:'rgba(255,255,255,0.3)',margin:'4px 0 0',textAlign:isMe?'right':'left'}}>
                  {new Date(msg.time).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef}/>
      </div>

      <div style={{display:'flex',gap:'8px',padding:'10px 12px',borderTop:'1px solid rgba(196,130,255,0.12)',background:'rgba(0,0,0,0.2)'}}>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder="Message driver..."
          style={{flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(196,130,255,0.2)',borderRadius:'99px',padding:'9px 16px',color:'#f1e8ff',fontSize:'0.88rem',outline:'none'}}/>
        <button onClick={send} style={{background:'linear-gradient(135deg,#c482ff,#f472b6)',color:'#09060f',border:'none',padding:'9px 18px',borderRadius:'99px',cursor:'pointer',fontWeight:'800',fontSize:'0.85rem',fontFamily:'Syne,sans-serif'}}>Send ↑</button>
      </div>
    </div>
  );
}

const BC = {PENDING:'#facc15',ACCEPTED:'#c482ff',IN_PROGRESS:'#4ade80',COMPLETED:'#94a3b8',CANCELLED:'#f87171'};

export default function CustomerMyRides() {
  const { getBookingsForCustomer, cancelBooking, tick } = useBooking();
  const userId = localStorage.getItem('userId');
  const [rides,    setRides]    = useState([]);
  const [openChat, setOpenChat] = useState(null);
  const [filter,   setFilter]   = useState('ALL');

  // tick = re-read from localStorage every second — NEVER stale
  useEffect(() => {
    const all = getBookingsForCustomer(userId);
    setRides(all);
  }, [tick, userId]);

  const filtered = filter==='ALL' ? rides : rides.filter(r=>r.status===filter);

  return (
    <div style={{padding:'2rem',background:'#09060f',minHeight:'100vh',color:'#f1e8ff'}}>
      <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'1.9rem',fontWeight:'800',color:'#fff',marginBottom:'0.25rem'}}>My Rides</h1>
      <p style={{color:'#7c6b9e',fontSize:'0.82rem',marginBottom:'1.5rem'}}>
        {rides.length} total · ✓ all data saved permanently
      </p>

      {/* Filters */}
      <div style={{display:'flex',gap:'8px',marginBottom:'1.5rem',flexWrap:'wrap'}}>
        {['ALL','PENDING','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{padding:'5px 14px',borderRadius:'99px',border:`1px solid ${filter===f?(BC[f]||'#c482ff'):'rgba(196,130,255,0.15)'}`,background:filter===f?`${BC[f]||'#c482ff'}15`:'transparent',color:filter===f?(BC[f]||'#c482ff'):'#64748b',cursor:'pointer',fontSize:'0.75rem',fontWeight:'600',transition:'all 0.15s'}}>
            {f.replace('_',' ')} ({(f==='ALL'?rides:rides.filter(r=>r.status===f)).length})
          </button>
        ))}
      </div>

      {filtered.length===0&&(
        <div style={{textAlign:'center',padding:'4rem',color:'#475569',background:'rgba(196,130,255,0.03)',borderRadius:'14px',border:'1px solid rgba(196,130,255,0.08)'}}>
          <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🚗</div>
          <p>No rides in this category.</p>
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        {filtered.map(b=>(
          <div key={b.id} style={{background:'rgba(196,130,255,0.04)',border:`1.5px solid ${BC[b.status]||'#c482ff'}22`,borderRadius:'18px',padding:'1.5rem'}}>
            {/* Header */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem'}}>
              <div>
                <div style={{fontFamily:'Syne,sans-serif',fontSize:'1rem',fontWeight:'800',color:'#c482ff'}}>{b.id}</div>
                <div style={{fontSize:'0.7rem',color:'#7c6b9e',marginTop:'2px'}}>{new Date(b.createdAt).toLocaleString()}</div>
              </div>
              <span style={{background:`${BC[b.status]}15`,color:BC[b.status],padding:'5px 14px',borderRadius:'99px',fontSize:'0.75rem',fontWeight:'800',fontFamily:'Syne,sans-serif'}}>
                {b.status.replace('_',' ')}
              </span>
            </div>

            {/* Details */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'1rem'}}>
              {[['📍 From',b.pickup],['🏁 To',b.dropoff],['🚗 Vehicle',b.vehicleName],['📅 Date & Time',`${b.date} ${b.time}`],['💰 Fare',`₹${b.price}`]].map(([l,v])=>(
                <div key={l}>
                  <div style={{color:'#7c6b9e',fontSize:'0.7rem',marginBottom:'2px'}}>{l}</div>
                  <div style={{color:'#e2e8f0',fontSize:'0.85rem',fontWeight:'500'}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Status panels */}
            {b.status==='PENDING'&&(
              <div style={{background:'rgba(250,204,21,0.08)',border:'1px solid rgba(250,204,21,0.2)',borderRadius:'10px',padding:'12px 14px',marginBottom:'0.75rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#facc15'}}/>
                  <span style={{color:'#facc15',fontSize:'0.85rem',fontWeight:'600'}}>Waiting for a driver to accept...</span>
                </div>
                <p style={{color:'#664d00',fontSize:'0.75rem',marginTop:'4px'}}>Visible to all online drivers right now</p>
              </div>
            )}

            {(b.status==='ACCEPTED'||b.status==='IN_PROGRESS')&&b.driverName&&(
              <div style={{background:'rgba(74,222,128,0.08)',border:'1px solid rgba(74,222,128,0.25)',borderRadius:'12px',padding:'14px',marginBottom:'0.75rem'}}>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:'800',color:'#4ade80',fontSize:'0.92rem',marginBottom:'10px'}}>
                  {b.status==='ACCEPTED'?'✓ Driver Accepted — On The Way!':'🚗 Ride In Progress'}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                  <div><div style={{color:'#4d7a5e',fontSize:'0.7rem'}}>Driver</div><div style={{color:'#fff',fontSize:'0.92rem',fontWeight:'700'}}>{b.driverName}</div></div>
                  <div><div style={{color:'#4d7a5e',fontSize:'0.7rem'}}>Phone</div><a href={`tel:${b.driverPhone}`} style={{color:'#4ade80',fontSize:'0.92rem',fontWeight:'700',textDecoration:'none'}}>📞 {b.driverPhone}</a></div>
                </div>
              </div>
            )}

            {b.status==='COMPLETED'&&(
              <div style={{background:'rgba(100,116,139,0.08)',border:'1px solid rgba(100,116,139,0.2)',borderRadius:'10px',padding:'10px 14px',marginBottom:'0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{color:'#94a3b8',fontSize:'0.85rem',fontWeight:'600'}}>✅ Trip Completed</div>
                  {b.driverName&&<div style={{color:'#64748b',fontSize:'0.75rem',marginTop:'2px'}}>Driver: {b.driverName} · 📞 {b.driverPhone}</div>}
                </div>
                <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.2rem',fontWeight:'800',color:'#c482ff'}}>₹{b.price}</div>
              </div>
            )}

            {b.status==='CANCELLED'&&(
              <div style={{background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:'10px',padding:'10px 14px',marginBottom:'0.75rem'}}>
                <span style={{color:'#f87171',fontSize:'0.82rem'}}>✕ Booking Cancelled</span>
              </div>
            )}

            {/* Actions */}
            <div style={{display:'flex',gap:'8px'}}>
              {b.status==='PENDING'&&(
                <button onClick={()=>cancelBooking(b.id)}
                  style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',color:'#f87171',padding:'7px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'0.8rem',fontWeight:'600'}}>
                  Cancel Booking
                </button>
              )}
              {(b.status==='ACCEPTED'||b.status==='IN_PROGRESS')&&(
                <button onClick={()=>setOpenChat(openChat===b.id?null:b.id)}
                  style={{background:openChat===b.id?'rgba(196,130,255,0.2)':'rgba(196,130,255,0.1)',border:'1px solid rgba(196,130,255,0.3)',color:'#c482ff',padding:'7px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'0.82rem',fontWeight:'700',fontFamily:'Syne,sans-serif'}}>
                  {openChat===b.id?'✕ Close Chat':'💬 Chat with Driver'}
                </button>
              )}
            </div>

            {openChat===b.id&&(b.status==='ACCEPTED'||b.status==='IN_PROGRESS')&&<ChatBox booking={b}/>}
          </div>
        ))}
      </div>
    </div>
  );
}