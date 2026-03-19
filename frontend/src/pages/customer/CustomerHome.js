import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

export default function CustomerHome() {
  const navigate = useNavigate();
  const { getBookingsForCustomer, bookings } = useBooking();
  const userId   = localStorage.getItem('userId');
  const name     = localStorage.getItem('name') || 'Customer';
  const [myRides, setMyRides] = useState([]);

  useEffect(() => {
    setMyRides(getBookingsForCustomer(userId));
  }, [bookings, userId, getBookingsForCustomer]);

  const activeRide  = myRides.find(b => b.status==='ACCEPTED'||b.status==='IN_PROGRESS');
  const pendingRide = myRides.find(b => b.status==='PENDING');
  const completed   = myRides.filter(b => b.status==='COMPLETED');
  const totalSpent  = myRides.reduce((s,b)=>s+(b.price||0),0);

  const BC = { PENDING:'#facc15', ACCEPTED:'#c482ff', IN_PROGRESS:'#4ade80', COMPLETED:'#64748b', CANCELLED:'#f87171' };

  return (
    <div style={{ padding:'2rem', background:'#09060f', minHeight:'100vh', color:'#f1e8ff' }}>
      <div style={{ marginBottom:'2rem' }}>
        <p style={{ color:'#7c6b9e', fontSize:'0.82rem' }}>Good {new Date().getHours()<12?'morning':'afternoon'},</p>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'2rem', fontWeight:'800', color:'#fff' }}>
          {name.split(' ')[0]} <span style={{ color:'#c482ff' }}>👋</span>
        </h1>
      </div>

      {/* ACTIVE RIDE BANNER */}
      {activeRide && (
        <div onClick={() => navigate('/customer/rides')}
          style={{ background:'rgba(74,222,128,0.08)', border:'2px solid rgba(74,222,128,0.3)', borderRadius:'14px', padding:'1.25rem', marginBottom:'1.5rem', cursor:'pointer' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
            <span style={{ fontFamily:'Syne,sans-serif', fontWeight:'800', color:'#4ade80', fontSize:'1rem' }}>
              {activeRide.status==='ACCEPTED' ? '✓ Driver On The Way!' : '🚗 Ride In Progress'}
            </span>
            <span style={{ background:'rgba(74,222,128,0.15)', color:'#4ade80', padding:'4px 12px', borderRadius:'99px', fontSize:'0.72rem', fontWeight:'700' }}>
              {activeRide.status.replace('_',' ')}
            </span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            <div>
              <div style={{ color:'#4d7a5e', fontSize:'0.7rem' }}>Driver</div>
              <div style={{ color:'#fff', fontSize:'0.88rem', fontWeight:'600' }}>{activeRide.driverName}</div>
            </div>
            <div>
              <div style={{ color:'#4d7a5e', fontSize:'0.7rem' }}>Phone</div>
              <a href={`tel:${activeRide.driverPhone}`} style={{ color:'#4ade80', fontSize:'0.88rem', fontWeight:'600', textDecoration:'none' }} onClick={e=>e.stopPropagation()}>
                📞 {activeRide.driverPhone}
              </a>
            </div>
            <div>
              <div style={{ color:'#4d7a5e', fontSize:'0.7rem' }}>From</div>
              <div style={{ color:'#e2e8f0', fontSize:'0.82rem' }}>{activeRide.pickup}</div>
            </div>
            <div>
              <div style={{ color:'#4d7a5e', fontSize:'0.7rem' }}>To</div>
              <div style={{ color:'#e2e8f0', fontSize:'0.82rem' }}>{activeRide.dropoff}</div>
            </div>
          </div>
          <div style={{ marginTop:'10px', color:'#4ade80', fontSize:'0.78rem', textAlign:'right' }}>
            Tap to open ride details & chat →
          </div>
        </div>
      )}

      {/* PENDING RIDE BANNER */}
      {!activeRide && pendingRide && (
        <div onClick={() => navigate('/customer/rides')}
          style={{ background:'rgba(250,204,21,0.06)', border:'1px solid rgba(250,204,21,0.25)', borderRadius:'14px', padding:'1.25rem', marginBottom:'1.5rem', cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#facc15', animation:'pulse 1.5s infinite' }} />
            <div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', color:'#facc15' }}>Waiting for Driver</div>
              <div style={{ fontSize:'0.78rem', color:'#7c6b9e', marginTop:'2px' }}>{pendingRide.id} · {pendingRide.pickup} → {pendingRide.dropoff}</div>
            </div>
            <span style={{ marginLeft:'auto', color:'#facc15', fontSize:'0.82rem' }}>→</span>
          </div>
        </div>
      )}

      {/* Book CTA */}
      <div style={{ background:'linear-gradient(135deg,rgba(196,130,255,0.15),rgba(244,114,182,0.1))', border:'1px solid rgba(196,130,255,0.2)', borderRadius:'20px', padding:'2rem', marginBottom:'1.5rem', cursor:'pointer' }}
        onClick={() => navigate('/customer/book')}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.5rem', fontWeight:'800', color:'#fff', marginBottom:'0.5rem' }}>Book a Ride</h2>
        <p style={{ color:'#7c6b9e', fontSize:'0.85rem', marginBottom:'1.5rem' }}>AI-powered vehicle matching · Chennai</p>
        <button style={{ background:'linear-gradient(135deg,#c482ff,#f472b6)', color:'#09060f', border:'none', padding:'0.75rem 2rem', borderRadius:'10px', fontWeight:'800', cursor:'pointer', fontSize:'0.95rem', fontFamily:'Syne,sans-serif' }}>
          BOOK NOW →
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'1.5rem' }}>
        {[['Total Rides',myRides.length,'#c482ff'],['Completed',completed.length,'#4ade80'],['Total Spent',`₹${totalSpent}`,'#f472b6']].map(([l,v,c])=>(
          <div key={l} style={{ background:`${c}08`, border:`1px solid ${c}18`, borderRadius:'14px', padding:'1rem', textAlign:'center' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.8rem', fontWeight:'800', color:c }}>{v}</div>
            <div style={{ color:'#7c6b9e', fontSize:'0.72rem', marginTop:'3px' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Recent rides */}
      {myRides.length > 0 && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
            <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:'1rem', fontWeight:'700', color:'#e2e8f0' }}>Recent Rides</h3>
            <button onClick={() => navigate('/customer/rides')} style={{ background:'transparent', border:'none', color:'#c482ff', cursor:'pointer', fontSize:'0.8rem' }}>View all →</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {myRides.slice(0,4).map(b => (
              <div key={b.id} style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${BC[b.status]}18`, borderRadius:'12px', padding:'0.9rem', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}
                onClick={() => navigate('/customer/rides')}>
                <div>
                  <div style={{ fontSize:'0.85rem', fontWeight:'500', color:'#e2e8f0', marginBottom:'3px' }}>{b.pickup} → {b.dropoff}</div>
                  <div style={{ fontSize:'0.72rem', color:'#475569' }}>{b.vehicleName} · {b.date}</div>
                  {b.driverName && <div style={{ fontSize:'0.7rem', color:'#4ade80', marginTop:'2px' }}>Driver: {b.driverName}</div>}
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'Syne,sans-serif', color:'#c482ff', fontWeight:'700', marginBottom:'4px' }}>₹{b.price}</div>
                  <span style={{ background:`${BC[b.status]}15`, color:BC[b.status], padding:'2px 8px', borderRadius:'99px', fontSize:'0.65rem', fontWeight:'600' }}>
                    {b.status.replace('_',' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}