import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';

export default function AdminBookings() {
  const { getAllBookings, cancelBooking } = useBooking();
  const [filter, setFilter] = useState('ALL');
  const bookings = getAllBookings();

  const SC = { PENDING:'#facc15', ACCEPTED:'#38bdf8', IN_PROGRESS:'#4ade80', COMPLETED:'#64748b', CANCELLED:'#f87171' };
  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div style={{ padding:'2rem', background:'#080f1e', minHeight:'100vh', color:'#e2e8f0' }}>
      <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.9rem', fontWeight:'800', marginBottom:'0.5rem' }}>All Bookings</h1>
      <p style={{ color:'#475569', fontSize:'0.82rem', marginBottom:'2rem' }}>Real-time booking management</p>

      {/* Filters */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {['ALL','PENDING','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:'6px 16px', borderRadius:'99px', border:'1px solid', cursor:'pointer', fontSize:'0.78rem', fontWeight:'600', fontFamily:'Syne,sans-serif', borderColor: filter===f?(SC[f]||'#38bdf8'):'rgba(255,255,255,0.1)', background: filter===f?`${SC[f]||'#38bdf8'}15`:'transparent', color: filter===f?(SC[f]||'#38bdf8'):'#64748b', transition:'all 0.15s' }}>
            {f.replace('_',' ')} {f!=='ALL' && `(${bookings.filter(b=>b.status===f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'4rem', color:'#475569' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📋</div>
          <p>No bookings found</p>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {filtered.map(b => (
          <div key={b.id} style={{ background:'rgba(56,189,248,0.03)', border:`1px solid ${SC[b.status]}20`, borderRadius:'14px', padding:'1.25rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:'1rem', alignItems:'center' }}>
              <div>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1rem', fontWeight:'700', color:'#38bdf8' }}>{b.id}</div>
                <div style={{ fontSize:'0.7rem', color:'#475569', marginTop:'2px' }}>{new Date(b.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize:'0.88rem', fontWeight:'500', color:'#e2e8f0', marginBottom:'4px' }}>
                  👤 {b.customerName} → {b.vehicleName}
                </div>
                <div style={{ fontSize:'0.78rem', color:'#64748b' }}>
                  📍 {b.pickup} → {b.dropoff}
                </div>
                {b.driverName && (
                  <div style={{ fontSize:'0.75rem', color:'#4ade80', marginTop:'3px' }}>🚗 Driver: {b.driverName}</div>
                )}
                <div style={{ fontSize:'0.75rem', color:'#475569', marginTop:'3px' }}>
                  📅 {b.date} {b.time && `at ${b.time}`}
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.3rem', fontWeight:'800', color:'#c482ff' }}>₹{b.price}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px', alignItems:'flex-end' }}>
                <span style={{ background:`${SC[b.status]}15`, color:SC[b.status], padding:'4px 12px', borderRadius:'99px', fontSize:'0.72rem', fontWeight:'600', whiteSpace:'nowrap' }}>
                  {b.status.replace('_',' ')}
                </span>
                {b.status === 'PENDING' && (
                  <button onClick={() => cancelBooking(b.id)}
                    style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', color:'#f87171', padding:'3px 10px', borderRadius:'6px', cursor:'pointer', fontSize:'0.72rem' }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}