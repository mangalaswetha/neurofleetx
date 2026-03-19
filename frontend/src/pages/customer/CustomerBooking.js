import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

const VEHICLES = [
  { id:1, name:'Tesla Model 3',  type:'EV',    seats:5, isEv:true,  rating:4.9, price:12, badge:'AI Pick', badgeColor:'#c482ff', fuel:85  },
  { id:2, name:'Toyota Camry',   type:'SEDAN', seats:5, isEv:false, rating:4.7, price:8,  badge:'Popular',  badgeColor:'#38bdf8', fuel:72  },
  { id:3, name:'Honda City',     type:'SEDAN', seats:5, isEv:false, rating:4.8, price:7,  badge:null,       badgeColor:'',        fuel:91  },
  { id:4, name:'BYD e6 MPV',     type:'EV',    seats:6, isEv:true,  rating:4.9, price:14, badge:'Eco',      badgeColor:'#4ade80', fuel:100 },
  { id:5, name:'Mahindra XUV',   type:'SUV',   seats:7, isEv:false, rating:4.6, price:10, badge:null,       badgeColor:'',        fuel:68  },
];

const CHENNAI_PLACES = ['Anna Nagar','T. Nagar','Adyar','Velachery','OMR','Tambaram','Guindy','Mylapore','Nungambakkam','Egmore','Perambur','Kodambakkam'];

export default function CustomerBooking() {
  const { createBooking } = useBooking();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [confirmed, setConfirmed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pickupSug, setPickupSug] = useState([]);
  const [dropSug, setDropSug] = useState([]);

  const todayStr = new Date().toISOString().split('T')[0];
  const dist = pickup && dropoff ? (Math.random() * 15 + 3).toFixed(1) : null;

  const filteredV = filter === 'ALL' ? VEHICLES : VEHICLES.filter(v => v.type === filter || (filter === 'EV' && v.isEv));

  const confirm = async () => {
    if (!pickup || !dropoff || !date || !time || !selected) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const booking = createBooking(
      localStorage.getItem('userId'),
      localStorage.getItem('name'),
      selected.id, selected.name,
      pickup, dropoff, date, time
    );
    setConfirmed(booking);
    setLoading(false);
    setStep(4);
  };

  return (
    <div style={{ padding:'2rem', background:'#09060f', minHeight:'100vh', color:'#f1e8ff' }}>
      <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.9rem', fontWeight:'800', marginBottom:'0.5rem', color:'#fff' }}>Book Your Ride</h1>
      <p style={{ color:'#7c6b9e', fontSize:'0.82rem', marginBottom:'2rem' }}>AI-powered vehicle matching · Chennai</p>

      {/* Progress */}
      <div style={{ display:'flex', alignItems:'center', gap:'0', marginBottom:'2rem' }}>
        {['Location','Vehicle','Confirm','Done'].map((label, i) => {
          const num = i+1; const done = step>num; const active = step===num;
          return (
            <React.Fragment key={num}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background: done?'#c482ff':active?'rgba(196,130,255,0.2)':'rgba(255,255,255,0.05)', border:`2px solid ${done||active?'#c482ff':'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:'700', color: done||active?'#c482ff':'#475569', fontFamily:'Syne,sans-serif' }}>
                  {done ? '✓' : num}
                </div>
                <span style={{ fontSize:'0.68rem', color: active?'#c482ff':'#475569', whiteSpace:'nowrap' }}>{label}</span>
              </div>
              {i < 3 && <div style={{ flex:1, height:'1px', background: step>i+1?'rgba(196,130,255,0.4)':'rgba(255,255,255,0.06)', margin:'0 6px', marginBottom:'20px' }} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 1 — Location */}
      {step === 1 && (
        <div style={{ maxWidth:'580px' }}>
          <div style={{ background:'rgba(196,130,255,0.06)', border:'1px solid rgba(196,130,255,0.15)', borderRadius:'16px', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ position:'relative' }}>
              <label style={{ color:'#7c6b9e', fontSize:'0.75rem', fontWeight:'600', display:'block', marginBottom:'8px', letterSpacing:'0.08em' }}>📍 PICKUP LOCATION</label>
              <input value={pickup} onChange={e => { setPickup(e.target.value); setPickupSug(CHENNAI_PLACES.filter(p => p.toLowerCase().includes(e.target.value.toLowerCase()) && e.target.value)); }}
                placeholder="Enter pickup area..."
                style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(196,130,255,0.2)', borderRadius:'10px', padding:'0.85rem 1rem', color:'#f1e8ff', fontSize:'0.95rem', outline:'none' }} />
              {pickupSug.length > 0 && (
                <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#1a1130', border:'1px solid rgba(196,130,255,0.2)', borderRadius:'10px', zIndex:10, overflow:'hidden', marginTop:'4px' }}>
                  {pickupSug.slice(0,5).map(s => (
                    <div key={s} onClick={() => { setPickup(s); setPickupSug([]); }} style={{ padding:'0.65rem 1rem', cursor:'pointer', color:'#c482ff', fontSize:'0.85rem', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{s}, Chennai</div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position:'relative' }}>
              <label style={{ color:'#7c6b9e', fontSize:'0.75rem', fontWeight:'600', display:'block', marginBottom:'8px', letterSpacing:'0.08em' }}>🏁 DROP LOCATION</label>
              <input value={dropoff} onChange={e => { setDropoff(e.target.value); setDropSug(CHENNAI_PLACES.filter(p => p.toLowerCase().includes(e.target.value.toLowerCase()) && e.target.value)); }}
                placeholder="Enter destination..."
                style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(196,130,255,0.2)', borderRadius:'10px', padding:'0.85rem 1rem', color:'#f1e8ff', fontSize:'0.95rem', outline:'none' }} />
              {dropSug.length > 0 && (
                <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#1a1130', border:'1px solid rgba(196,130,255,0.2)', borderRadius:'10px', zIndex:10, overflow:'hidden', marginTop:'4px' }}>
                  {dropSug.slice(0,5).map(s => (
                    <div key={s} onClick={() => { setDropoff(s); setDropSug([]); }} style={{ padding:'0.65rem 1rem', cursor:'pointer', color:'#c482ff', fontSize:'0.85rem', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{s}, Chennai</div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div>
                <label style={{ color:'#7c6b9e', fontSize:'0.75rem', fontWeight:'600', display:'block', marginBottom:'8px', letterSpacing:'0.08em' }}>📅 DATE</label>
                <input type="date" value={date} min={todayStr} onChange={e => setDate(e.target.value)}
                  style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(196,130,255,0.2)', borderRadius:'10px', padding:'0.85rem', color:'#f1e8ff', fontSize:'0.9rem', outline:'none' }} />
              </div>
              <div>
                <label style={{ color:'#7c6b9e', fontSize:'0.75rem', fontWeight:'600', display:'block', marginBottom:'8px', letterSpacing:'0.08em' }}>🕐 TIME</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)}
                  style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(196,130,255,0.2)', borderRadius:'10px', padding:'0.85rem', color:'#f1e8ff', fontSize:'0.9rem', outline:'none' }} />
              </div>
            </div>
            <button onClick={() => (pickup && dropoff && date && time) && setStep(2)} disabled={!pickup||!dropoff||!date||!time}
              style={{ background: (pickup&&dropoff&&date&&time)?'linear-gradient(135deg,#c482ff,#f472b6)':'rgba(255,255,255,0.05)', color:(pickup&&dropoff&&date&&time)?'#09060f':'#475569', border:'none', padding:'0.9rem', borderRadius:'10px', fontWeight:'800', cursor:(pickup&&dropoff&&date&&time)?'pointer':'not-allowed', fontSize:'1rem', fontFamily:'Syne,sans-serif' }}>
              FIND VEHICLES →
            </button>
          </div>
          {/* Quick picks */}
          <div style={{ marginTop:'1.5rem' }}>
            <p style={{ color:'#475569', fontSize:'0.75rem', letterSpacing:'0.08em', marginBottom:'0.75rem' }}>POPULAR ROUTES</p>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {[['Anna Nagar','T. Nagar'],['Adyar','Airport'],['Velachery','OMR'],['Tambaram','Guindy']].map(([f,t]) => (
                <button key={f+t} onClick={() => { setPickup(f); setDropoff(t); }}
                  style={{ background:'rgba(196,130,255,0.06)', border:'1px solid rgba(196,130,255,0.15)', borderRadius:'99px', padding:'5px 14px', cursor:'pointer', color:'#7c6b9e', fontSize:'0.78rem' }}>
                  {f} → {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — Vehicle Selection */}
      {step === 2 && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
            <div>
              <p style={{ color:'#7c6b9e', fontSize:'0.82rem' }}>📍 {pickup} → {dropoff}</p>
              <p style={{ color:'#7c6b9e', fontSize:'0.78rem' }}>📅 {date} at {time}</p>
            </div>
            <button onClick={() => setStep(1)} style={{ background:'transparent', border:'1px solid rgba(196,130,255,0.2)', color:'#c482ff', padding:'5px 14px', borderRadius:'8px', cursor:'pointer', fontSize:'0.78rem' }}>← Change</button>
          </div>

          <div style={{ display:'flex', gap:'8px', marginBottom:'1.5rem', flexWrap:'wrap' }}>
            {['ALL','SEDAN','SUV','EV'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding:'5px 16px', borderRadius:'99px', border:`1px solid ${filter===f?'#c482ff':'rgba(196,130,255,0.15)'}`, background: filter===f?'rgba(196,130,255,0.12)':'transparent', color: filter===f?'#c482ff':'#64748b', cursor:'pointer', fontSize:'0.78rem', fontWeight:'600' }}>
                {f}
              </button>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'12px', marginBottom:'1.5rem' }}>
            {filteredV.map(v => {
              const isSelected = selected?.id === v.id;
              const tripPrice = dist ? Math.round(+dist * v.price) : null;
              return (
                <div key={v.id} onClick={() => setSelected(v)}
                  style={{ background: isSelected?'rgba(196,130,255,0.1)':'rgba(255,255,255,0.03)', border:`1.5px solid ${isSelected?'#c482ff':'rgba(196,130,255,0.1)'}`, borderRadius:'14px', padding:'1.25rem', cursor:'pointer', transition:'all 0.2s', position:'relative' }}>
                  {v.badge && <div style={{ position:'absolute', top:'10px', right:'10px', background:`${v.badgeColor}20`, color:v.badgeColor, fontSize:'0.65rem', fontWeight:'700', padding:'2px 8px', borderRadius:'99px', fontFamily:'Syne,sans-serif' }}>{v.badge}</div>}
                  {isSelected && <div style={{ position:'absolute', top:'10px', left:'10px', background:'#c482ff', color:'#09060f', fontSize:'0.65rem', fontWeight:'800', padding:'2px 8px', borderRadius:'99px', fontFamily:'Syne,sans-serif' }}>SELECTED</div>}
                  <div style={{ marginTop: (v.badge||isSelected)?'1.2rem':'0' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                      <span style={{ fontSize:'1.5rem' }}>{v.isEv?'⚡':'🚗'}</span>
                      <div>
                        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:'700', color:'#f1e8ff', fontSize:'0.95rem' }}>{v.name}</div>
                        <div style={{ fontSize:'0.72rem', color:'#7c6b9e' }}>{v.type} · {v.seats} seats · ⭐ {v.rating}</div>
                      </div>
                    </div>
                    <div style={{ height:'4px', background:'rgba(255,255,255,0.06)', borderRadius:'2px', margin:'10px 0' }}>
                      <div style={{ width:`${v.fuel}%`, height:'100%', background: v.isEv?'#c482ff':'#4ade80', borderRadius:'2px' }} />
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:'0.75rem', color:'#7c6b9e' }}>₹{v.price}/km</span>
                      {tripPrice && <span style={{ fontFamily:'Syne,sans-serif', fontSize:'1.2rem', fontWeight:'800', color:'#c482ff' }}>₹{tripPrice}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selected && (
            <button onClick={() => setStep(3)}
              style={{ background:'linear-gradient(135deg,#c482ff,#f472b6)', color:'#09060f', border:'none', padding:'0.9rem 2.5rem', borderRadius:'12px', fontWeight:'800', cursor:'pointer', fontSize:'1rem', fontFamily:'Syne,sans-serif' }}>
              CONTINUE WITH {selected.name.toUpperCase()} →
            </button>
          )}
        </div>
      )}

      {/* STEP 3 — Confirm */}
      {step === 3 && (
        <div style={{ maxWidth:'500px' }}>
          <div style={{ background:'rgba(196,130,255,0.06)', border:'1px solid rgba(196,130,255,0.15)', borderRadius:'16px', padding:'1.75rem', marginBottom:'1rem' }}>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.2rem', fontWeight:'800', color:'#c482ff', marginBottom:'1.5rem' }}>Trip Summary</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {[['📍 From', pickup],['🏁 To', dropoff],['🚗 Vehicle', selected?.name],['📅 Date', date],['🕐 Time', time],['📏 Distance', `~${dist} km`],['💰 Fare', `₹${dist?Math.round(+dist*selected?.price):0}`]].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color:'#7c6b9e', fontSize:'0.85rem' }}>{l}</span>
                  <span style={{ color:'#f1e8ff', fontSize:'0.85rem', fontWeight:'500' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={() => setStep(2)} style={{ background:'transparent', border:'1px solid rgba(196,130,255,0.2)', color:'#7c6b9e', padding:'0.85rem 1.5rem', borderRadius:'10px', cursor:'pointer', fontSize:'0.9rem' }}>← Back</button>
            <button onClick={confirm} disabled={loading}
              style={{ flex:1, background: loading?'rgba(196,130,255,0.2)':'linear-gradient(135deg,#c482ff,#f472b6)', color:'#09060f', border:'none', padding:'0.85rem', borderRadius:'10px', fontWeight:'800', cursor:'pointer', fontSize:'1rem', fontFamily:'Syne,sans-serif' }}>
              {loading ? '⏳ FINDING DRIVER...' : '🚗 CONFIRM BOOKING →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — Confirmed */}
      {step === 4 && confirmed && (
        <div style={{ maxWidth:'460px' }}>
          <div style={{ background:'rgba(196,130,255,0.06)', border:'1px solid rgba(196,130,255,0.2)', borderRadius:'20px', padding:'2.5rem', textAlign:'center' }}>
            <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'rgba(196,130,255,0.15)', border:'2px solid #c482ff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', margin:'0 auto 1.25rem' }}>🎉</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.6rem', fontWeight:'800', color:'#c482ff', marginBottom:'0.5rem' }}>BOOKING CONFIRMED!</h2>
            <p style={{ color:'#7c6b9e', fontSize:'0.85rem', marginBottom:'2rem' }}>Your request is sent to nearby drivers</p>
            <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'12px', padding:'1.25rem', textAlign:'left', marginBottom:'1.5rem' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', fontWeight:'700', color:'#c482ff', marginBottom:'1rem' }}>{confirmed.id}</div>
              {[['Vehicle', confirmed.vehicleName],['From', confirmed.pickup],['To', confirmed.dropoff],['Date', confirmed.date],['Time', confirmed.time],['Fare', `₹${confirmed.price}`]].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color:'#7c6b9e', fontSize:'0.8rem' }}>{l}</span>
                  <span style={{ color:'#f1e8ff', fontSize:'0.8rem', fontWeight:'500' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(250,204,21,0.08)', border:'1px solid rgba(250,204,21,0.2)', borderRadius:'10px', padding:'0.75rem', marginBottom:'1.25rem', color:'#facc15', fontSize:'0.82rem' }}>
              ⏳ Waiting for a driver to accept your request...
            </div>
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={() => navigate('/customer/rides')}
                style={{ flex:1, background:'rgba(196,130,255,0.15)', border:'1px solid rgba(196,130,255,0.25)', color:'#c482ff', padding:'0.75rem', borderRadius:'10px', cursor:'pointer', fontSize:'0.9rem', fontWeight:'600' }}>
                Track Ride
              </button>
              <button onClick={() => { setStep(1); setSelected(null); setPickup(''); setDropoff(''); setDate(''); setTime(''); }}
                style={{ flex:1, background:'linear-gradient(135deg,#c482ff,#f472b6)', color:'#09060f', border:'none', padding:'0.75rem', borderRadius:'10px', cursor:'pointer', fontWeight:'800', fontSize:'0.9rem', fontFamily:'Syne,sans-serif' }}>
                Book Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}