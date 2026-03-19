import React from 'react';

export default function Maintenance() {
  const alerts = [
    { id:1, vehicle:'Tesla Model 3', issue:'Engine Oil', severity:'HIGH', action:'Schedule oil change' },
    { id:2, vehicle:'Toyota Camry', issue:'Tire Pressure', severity:'MEDIUM', action:'Check tires' },
    { id:3, vehicle:'Ford Transit', issue:'Battery Level', severity:'CRITICAL', action:'Recharge immediately' },
  ];
  const colors = { LOW:'#00ff88', MEDIUM:'#facc15', HIGH:'#ff6b35', CRITICAL:'#ef4444' };

  return (
    <div style={{ padding:'2rem', background:'#0a0e1a', minHeight:'100vh' }}>
      <h1 style={{ color:'#00d4ff', fontSize:'2rem', marginBottom:'2rem' }}>🔧 Predictive Maintenance</h1>
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {alerts.map(a => (
          <div key={a.id} style={{ background:'#111827', border:`1px solid ${colors[a.severity]}44`, borderRadius:'12px', padding:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <h3 style={{ color:'#e2e8f0', marginBottom:'4px' }}>{a.vehicle}</h3>
              <p style={{ color:'#94a3b8', fontSize:'0.875rem' }}>{a.issue} — {a.action}</p>
            </div>
            <span style={{ background:`${colors[a.severity]}22`, color:colors[a.severity], padding:'6px 14px', borderRadius:'20px', fontSize:'0.8rem', fontWeight:'600' }}>{a.severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}