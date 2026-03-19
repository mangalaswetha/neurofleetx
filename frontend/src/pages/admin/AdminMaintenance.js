import React, { useState } from 'react';

const INIT_ALERTS = [
  { id:1, vehicle:'Ford Transit',  issue:'Engine Oil Change',    severity:'CRITICAL', detail:'42,000 km overdue',           action:'Schedule immediately', days:0  },
  { id:2, vehicle:'Toyota Camry',  issue:'Tire Pressure Low',    severity:'HIGH',     detail:'Front left 24 PSI (min 32)',   action:'Check and inflate',    days:1  },
  { id:3, vehicle:'Tesla Model 3', issue:'Battery Calibration',  severity:'MEDIUM',   detail:'3 months since calibration',   action:'Run full charge cycle', days:5  },
  { id:4, vehicle:'Honda City',    issue:'Brake Pad Wear',        severity:'MEDIUM',   detail:'65% worn — replace at 80%',    action:'Monitor closely',       days:14 },
  { id:5, vehicle:'BYD e6 MPV',    issue:'AC Filter Clean',       severity:'LOW',      detail:'6 months since last clean',    action:'Clean during next stop', days:30 },
];

const AC = { CRITICAL:'#f87171', HIGH:'#fb923c', MEDIUM:'#facc15', LOW:'#4ade80' };

export default function AdminMaintenance() {
  const [alerts, setAlerts] = useState(INIT_ALERTS);

  const resolve = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  return (
    <div style={{ padding:'2rem', background:'#080f1e', minHeight:'100vh', color:'#e2e8f0' }}>
      <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.9rem', fontWeight:'800', color:'#fff', marginBottom:'0.5rem' }}>
        Maintenance Hub
      </h1>
      <p style={{ color:'#475569', fontSize:'0.82rem', marginBottom:'2rem' }}>
        AI-powered predictive maintenance alerts
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'2rem' }}>
        {['CRITICAL','HIGH','MEDIUM','LOW'].map(sev => (
          <div key={sev} style={{ background:`${AC[sev]}08`, border:`1px solid ${AC[sev]}20`, borderRadius:'12px', padding:'1rem', textAlign:'center' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'2rem', fontWeight:'800', color:AC[sev] }}>
              {alerts.filter(a => a.severity === sev).length}
            </div>
            <div style={{ color:'#64748b', fontSize:'0.75rem', marginTop:'3px' }}>{sev}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {alerts.map(a => (
          <div key={a.id} style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${AC[a.severity]}20`, borderRadius:'14px', padding:'1.25rem', display:'flex', alignItems:'center', gap:'1rem' }}>
            <div style={{ width:'6px', alignSelf:'stretch', borderRadius:'3px', background:AC[a.severity], flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                <span style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:'700', color:'#e2e8f0' }}>
                  {a.vehicle} — {a.issue}
                </span>
                <span style={{ background:`${AC[a.severity]}15`, color:AC[a.severity], padding:'3px 10px', borderRadius:'99px', fontSize:'0.7rem', fontWeight:'700' }}>
                  {a.severity}
                </span>
              </div>
              <p style={{ color:'#64748b', fontSize:'0.8rem', marginBottom:'4px' }}>{a.detail}</p>
              <p style={{ color:AC[a.severity], fontSize:'0.78rem', opacity:0.8 }}>Action: {a.action}</p>
              <p style={{ color:'#334155', fontSize:'0.72rem', marginTop:'4px' }}>
                {a.days === 0 ? '⚠️ Overdue' : `Due in ${a.days} days`}
              </p>
            </div>
            <button onClick={() => resolve(a.id)}
              style={{ background:`${AC[a.severity]}15`, border:`1px solid ${AC[a.severity]}30`, color:AC[a.severity], padding:'8px 16px', borderRadius:'8px', cursor:'pointer', fontSize:'0.78rem', fontWeight:'700', whiteSpace:'nowrap', fontFamily:'Syne,sans-serif' }}>
              ✓ Resolved
            </button>
          </div>
        ))}
        {alerts.length === 0 && (
          <div style={{ textAlign:'center', padding:'4rem', color:'#475569' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✅</div>
            <p>All vehicles healthy! No alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
}