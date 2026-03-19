import React from 'react';
import { useBooking } from '../../context/BookingContext';

export default function DriverTrips() {
  const { getBookingsForDriver } = useBooking();
  const driverId = localStorage.getItem('userId');
  const trips = getBookingsForDriver(driverId);
  const SC = { ACCEPTED:'#c482ff', IN_PROGRESS:'#4ade80', COMPLETED:'#64748b', CANCELLED:'#f87171', PENDING:'#facc15' };

  return (
    <div style={{ padding:'2rem', background:'#050f08', minHeight:'100vh', color:'#e8fdf0' }}>
      <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.9rem', fontWeight:'800', color:'#fff', marginBottom:'0.5rem' }}>
        My Trips
      </h1>
      <p style={{ color:'#4d7a5e', fontSize:'0.82rem', marginBottom:'2rem' }}>
        {trips.length} total trips
      </p>

      {trips.length === 0 && (
        <div style={{ textAlign:'center', padding:'4rem', color:'#4d7a5e', background:'rgba(74,222,128,0.03)', borderRadius:'14px', border:'1px solid rgba(74,222,128,0.08)' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📋</div>
          <p>No trips yet. Accept trip requests from the dashboard.</p>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        {trips.map(b => (
          <div key={b.id} style={{ background:'rgba(74,222,128,0.04)', border:`1px solid ${SC[b.status]||'#4ade80'}18`, borderRadius:'14px', padding:'1.25rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.9rem', fontWeight:'700', color:'#4ade80' }}>{b.id}</div>
              <span style={{ background:`${SC[b.status]}15`, color:SC[b.status], padding:'3px 10px', borderRadius:'99px', fontSize:'0.7rem', fontWeight:'700' }}>
                {b.status}
              </span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              {[['Customer',b.customerName],['Vehicle',b.vehicleName],['From',b.pickup],['To',b.dropoff],['Date',b.date],['Fare',`₹${b.price}`]].map(([l,v]) => (
                <div key={l}>
                  <div style={{ color:'#4d7a5e', fontSize:'0.7rem', marginBottom:'2px' }}>{l}</div>
                  <div style={{ color:'#e8fdf0', fontSize:'0.82rem', fontWeight:'500' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}