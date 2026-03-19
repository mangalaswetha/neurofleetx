import React, { useState } from 'react';

const INIT = [
  { id:1, name:'Tesla Model 3',  plate:'TN01AB1234', type:'EV',    status:'AVAILABLE',   fuel:85,  battery:85, seats:5, mileage:12400, isEv:true  },
  { id:2, name:'Toyota Camry',   plate:'TN02CD5678', type:'SEDAN', status:'IN_USE',      fuel:72,  battery:0,  seats:5, mileage:48200, isEv:false },
  { id:3, name:'Ford Transit',   plate:'TN03EF9012', type:'TRUCK', status:'MAINTENANCE', fuel:45,  battery:0,  seats:3, mileage:91000, isEv:false },
  { id:4, name:'Honda City',     plate:'TN04GH3456', type:'SEDAN', status:'AVAILABLE',   fuel:91,  battery:0,  seats:5, mileage:28500, isEv:false },
  { id:5, name:'BYD e6 MPV',     plate:'TN05IJ7890', type:'EV',    status:'AVAILABLE',   fuel:100, battery:92, seats:6, mileage:8900,  isEv:true  },
];

const SC = { AVAILABLE:'#4ade80', IN_USE:'#facc15', MAINTENANCE:'#f87171', IDLE:'#94a3b8' };

export default function AdminFleet() {
  const [vehicles, setVehicles] = useState(INIT);
  const [showAdd, setShowAdd] = useState(false);
  const [newV, setNewV] = useState({ name:'', plate:'', type:'SEDAN', seats:5 });

  const addVehicle = () => {
    if (!newV.name || !newV.plate) return;
    setVehicles(prev => [...prev, {
      ...newV, id:Date.now(), status:'AVAILABLE',
      fuel:100, battery:0, mileage:0,
      isEv:newV.type==='EV',
    }]);
    setShowAdd(false);
    setNewV({ name:'', plate:'', type:'SEDAN', seats:5 });
  };

  const changeStatus = (id, status) =>
    setVehicles(prev => prev.map(v => v.id === id ? {...v, status} : v));

  return (
    <div style={{ padding:'2rem', background:'#080f1e', minHeight:'100vh', color:'#e2e8f0' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
        <div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.9rem', fontWeight:'800', color:'#fff' }}>Fleet Management</h1>
          <p style={{ color:'#475569', fontSize:'0.82rem', marginTop:'4px' }}>{vehicles.length} vehicles registered</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          style={{ background:'linear-gradient(135deg,#38bdf8,#818cf8)', color:'#060912', border:'none', padding:'0.7rem 1.5rem', borderRadius:'10px', fontWeight:'800', cursor:'pointer', fontSize:'0.88rem', fontFamily:'Syne,sans-serif' }}>
          + Add Vehicle
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'1.5rem' }}>
        {[['Available','#4ade80',vehicles.filter(v=>v.status==='AVAILABLE').length],
          ['In Use','#facc15',vehicles.filter(v=>v.status==='IN_USE').length],
          ['Maintenance','#f87171',vehicles.filter(v=>v.status==='MAINTENANCE').length],
          ['Total','#38bdf8',vehicles.length]].map(([l,c,v]) => (
          <div key={l} style={{ background:`${c}08`, border:`1px solid ${c}20`, borderRadius:'12px', padding:'1rem', textAlign:'center' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.8rem', fontWeight:'800', color:c }}>{v}</div>
            <div style={{ color:'#475569', fontSize:'0.72rem', marginTop:'3px' }}>{l}</div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div style={{ background:'rgba(56,189,248,0.06)', border:'1px solid rgba(56,189,248,0.2)', borderRadius:'14px', padding:'1.5rem', marginBottom:'1.5rem' }}>
          <h3 style={{ fontFamily:'Syne,sans-serif', color:'#38bdf8', marginBottom:'1rem' }}>Add New Vehicle</h3>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'flex-end' }}>
            {[['Vehicle Name','name'],['Plate Number','plate']].map(([l,k]) => (
              <div key={k}>
                <label style={{ color:'#64748b', fontSize:'0.72rem', display:'block', marginBottom:'5px' }}>{l}</label>
                <input value={newV[k]} onChange={e => setNewV({...newV,[k]:e.target.value})}
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(56,189,248,0.2)', borderRadius:'8px', padding:'0.65rem 1rem', color:'#e2e8f0', fontSize:'0.85rem', outline:'none', width:'180px' }} />
              </div>
            ))}
            <div>
              <label style={{ color:'#64748b', fontSize:'0.72rem', display:'block', marginBottom:'5px' }}>Type</label>
              <select value={newV.type} onChange={e => setNewV({...newV,type:e.target.value})}
                style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(56,189,248,0.2)', borderRadius:'8px', padding:'0.65rem', color:'#e2e8f0', fontSize:'0.85rem', outline:'none' }}>
                {['SEDAN','SUV','TRUCK','BUS','EV'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color:'#64748b', fontSize:'0.72rem', display:'block', marginBottom:'5px' }}>Seats</label>
              <input type="number" value={newV.seats} min="2" max="50" onChange={e => setNewV({...newV,seats:+e.target.value})}
                style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(56,189,248,0.2)', borderRadius:'8px', padding:'0.65rem', color:'#e2e8f0', fontSize:'0.85rem', outline:'none', width:'70px' }} />
            </div>
            <button onClick={addVehicle}
              style={{ background:'#38bdf8', color:'#060912', border:'none', padding:'0.65rem 1.25rem', borderRadius:'8px', fontWeight:'700', cursor:'pointer' }}>
              Save
            </button>
            <button onClick={() => setShowAdd(false)}
              style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', color:'#64748b', padding:'0.65rem 1.25rem', borderRadius:'8px', cursor:'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {vehicles.map(v => (
          <div key={v.id} style={{ background:'rgba(56,189,248,0.03)', border:'1px solid rgba(56,189,248,0.08)', borderRadius:'14px', padding:'1.25rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <div style={{ width:'42px', height:'42px', borderRadius:'10px', background:`${SC[v.status]}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>
                {v.isEv ? '⚡' : '🚗'}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:'600', color:'#e2e8f0', marginBottom:'3px' }}>
                  {v.name}
                  <span style={{ color:'#475569', fontWeight:'400', fontSize:'0.82rem', marginLeft:'8px' }}>· {v.plate}</span>
                </div>
                <div style={{ fontSize:'0.78rem', color:'#64748b' }}>
                  {v.type} · {v.seats} seats · {v.mileage.toLocaleString()} km
                </div>
              </div>
              <div style={{ width:'120px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.68rem', color:'#64748b', marginBottom:'3px' }}>
                  <span>{v.isEv ? '⚡ Battery' : '⛽ Fuel'}</span>
                  <span style={{ color:(v.isEv?v.battery:v.fuel)>50?'#4ade80':'#f87171' }}>
                    {v.isEv ? v.battery : v.fuel}%
                  </span>
                </div>
                <div style={{ height:'5px', background:'rgba(255,255,255,0.06)', borderRadius:'3px' }}>
                  <div style={{ width:`${v.isEv?v.battery:v.fuel}%`, height:'100%', background:(v.isEv?v.battery:v.fuel)>50?'#4ade80':'#f87171', borderRadius:'3px' }} />
                </div>
              </div>
              <select value={v.status} onChange={e => changeStatus(v.id, e.target.value)}
                style={{ background:`${SC[v.status]}12`, border:`1px solid ${SC[v.status]}30`, borderRadius:'8px', padding:'5px 10px', color:SC[v.status], fontSize:'0.78rem', fontWeight:'600', cursor:'pointer', outline:'none' }}>
                {['AVAILABLE','IN_USE','MAINTENANCE','IDLE'].map(s => (
                  <option key={s} value={s}>{s.replace('_',' ')}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}