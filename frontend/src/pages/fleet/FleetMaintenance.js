import React, { useState, useEffect } from 'react';

const STORE_KEY = 'NFX_MAINTENANCE';
const INIT = [
  {id:1,vehicle:'Ford Transit',  plate:'TN03EF9012',issue:'Engine Oil Change',   severity:'CRITICAL',detail:'42,000 km overdue — engine at risk',         action:'Book service immediately',  cost:2500, days:-3,  resolved:false,createdAt:'2026-03-10'},
  {id:2,vehicle:'Toyota Camry',  plate:'TN02CD5678',issue:'Tire Pressure Low',   severity:'HIGH',    detail:'Front left 24 PSI, minimum is 32 PSI',        action:'Check and inflate all tires',cost:800,  days:1,   resolved:false,createdAt:'2026-03-15'},
  {id:3,vehicle:'Tesla Model 3', plate:'TN01AB1234',issue:'Battery Calibration', severity:'MEDIUM',  detail:'3 months since last calibration cycle',        action:'Run overnight calibration',  cost:0,    days:5,   resolved:false,createdAt:'2026-03-14'},
  {id:4,vehicle:'Honda City',    plate:'TN04GH3456',issue:'Brake Pad Wear',      severity:'MEDIUM',  detail:'65% worn — recommend replacing at 80%',        action:'Monitor, schedule for next month',cost:3200,days:14,resolved:false,createdAt:'2026-03-12'},
  {id:5,vehicle:'BYD e6 MPV',    plate:'TN05IJ7890',issue:'AC Filter Clean',     severity:'LOW',     detail:'6 months since last AC filter replacement',    action:'Clean during next stop',     cost:400,  days:30,  resolved:false,createdAt:'2026-03-08'},
  {id:6,vehicle:'Mahindra XUV',  plate:'TN06KL2345',issue:'Coolant Level Low',   severity:'HIGH',    detail:'Coolant at 30% — risk of overheating',         action:'Refill coolant immediately', cost:600,  days:0,   resolved:false,createdAt:'2026-03-19'},
];
const HISTORY = [
  {id:101,vehicle:'Toyota Camry',issue:'Oil Change',     cost:2200,date:'2025-10-15',tech:'Raj Auto Works'},
  {id:102,vehicle:'Tesla Model 3',issue:'Tire Rotation', cost:800, date:'2025-12-01',tech:'EV Service Center'},
  {id:103,vehicle:'Ford Transit', issue:'Brake Service', cost:5500,date:'2025-08-20',tech:'TransMotors'},
];

const AC = {CRITICAL:'#f87171',HIGH:'#fb923c',MEDIUM:'#facc15',LOW:'#4ade80'};

const load = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {alerts:INIT,history:HISTORY}; } catch { return {alerts:INIT,history:HISTORY}; }};
const save = (d) => localStorage.setItem(STORE_KEY, JSON.stringify(d));

export default function FleetMaintenance() {
  const [data,       setData]       = useState(load);
  const [tab,        setTab]        = useState('ALERTS');
  const [showAdd,    setShowAdd]    = useState(false);
  const [newAlert,   setNewAlert]   = useState({vehicle:'',plate:'',issue:'',severity:'MEDIUM',detail:'',action:'',cost:0,days:30});
  const [filter,     setFilter]     = useState('ALL');

  useEffect(()=>{ save(data); },[data]);

  const resolve = (id) => {
    const alert = data.alerts.find(a=>a.id===id);
    const newHistory = [...data.history, {id:Date.now(), vehicle:alert.vehicle, issue:alert.issue, cost:alert.cost, date:new Date().toISOString().split('T')[0], tech:'Fleet Team'}];
    setData({alerts:data.alerts.filter(a=>a.id!==id), history:newHistory});
  };

  const addAlert = () => {
    if (!newAlert.vehicle||!newAlert.issue) return;
    setData({...data, alerts:[{...newAlert,id:Date.now(),resolved:false,createdAt:new Date().toISOString().split('T')[0]}, ...data.alerts]});
    setShowAdd(false);
    setNewAlert({vehicle:'',plate:'',issue:'',severity:'MEDIUM',detail:'',action:'',cost:0,days:30});
  };

  const alerts  = filter==='ALL' ? data.alerts : data.alerts.filter(a=>a.severity===filter);
  const totalCost = data.alerts.reduce((s,a)=>s+a.cost,0);
  const historyCost = data.history.reduce((s,h)=>s+h.cost,0);

  return (
    <div style={{padding:'2rem',background:'#0f0900',minHeight:'100vh',color:'#fff7ed',fontFamily:'DM Sans,sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2rem'}}>
        <div>
          <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'1.9rem',fontWeight:'800',color:'#fff'}}>Maintenance Hub</h1>
          <p style={{color:'#7c5c2e',fontSize:'0.82rem',marginTop:'4px'}}>AI-powered predictive alerts · all data saved</p>
        </div>
        <button onClick={()=>setShowAdd(true)}
          style={{padding:'7px 18px',borderRadius:'8px',border:'none',background:'linear-gradient(135deg,#fb923c,#f59e0b)',color:'#0f0900',cursor:'pointer',fontSize:'0.82rem',fontWeight:'800',fontFamily:'Syne,sans-serif'}}>
          + Add Alert
        </button>
      </div>

      {/* Summary KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'8px',marginBottom:'1.5rem'}}>
        {[['Critical',data.alerts.filter(a=>a.severity==='CRITICAL').length,'#f87171'],['High',data.alerts.filter(a=>a.severity==='HIGH').length,'#fb923c'],['Medium',data.alerts.filter(a=>a.severity==='MEDIUM').length,'#facc15'],['Low',data.alerts.filter(a=>a.severity==='LOW').length,'#4ade80'],['Est Cost',`₹${totalCost.toLocaleString()}`,'#c482ff'],['Resolved',data.history.length,'#94a3b8']].map(([l,v,c])=>(
          <div key={l} style={{background:`${c}08`,border:`1px solid ${c}20`,borderRadius:'10px',padding:'0.9rem',textAlign:'center'}}>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.4rem',fontWeight:'800',color:c}}>{v}</div>
            <div style={{color:'#7c5c2e',fontSize:'0.68rem',marginTop:'2px'}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:'8px',marginBottom:'1.25rem'}}>
        {['ALERTS','HISTORY','SCHEDULE'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{padding:'7px 18px',borderRadius:'8px',border:`1px solid ${tab===t?'#fb923c':'rgba(251,146,60,0.2)'}`,background:tab===t?'rgba(251,146,60,0.15)':'transparent',color:tab===t?'#fb923c':'#7c5c2e',cursor:'pointer',fontSize:'0.82rem',fontWeight:'700',fontFamily:'Syne,sans-serif'}}>
            {t==='ALERTS'?`🔔 Alerts (${data.alerts.length})`:t==='HISTORY'?`✓ History (${data.history.length})`:'📅 Schedule'}
          </button>
        ))}
      </div>

      {/* ADD ALERT FORM */}
      {showAdd&&(
        <div style={{background:'rgba(251,146,60,0.06)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'14px',padding:'1.5rem',marginBottom:'1.5rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}>
            <h3 style={{fontFamily:'Syne,sans-serif',color:'#fb923c',fontWeight:'700'}}>New Maintenance Alert</h3>
            <button onClick={()=>setShowAdd(false)} style={{background:'transparent',border:'none',color:'#7c5c2e',cursor:'pointer',fontSize:'1.2rem'}}>✕</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'1rem'}}>
            {[['Vehicle Name','vehicle','text'],['Plate','plate','text'],['Issue','issue','text'],['Detail','detail','text'],['Action Required','action','text']].map(([l,k,t])=>(
              <div key={k}>
                <label style={{color:'#7c5c2e',fontSize:'0.72rem',display:'block',marginBottom:'4px'}}>{l}</label>
                <input type={t} value={newAlert[k]} onChange={e=>setNewAlert({...newAlert,[k]:e.target.value})}
                  style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'8px',padding:'7px 10px',color:'#fff7ed',fontSize:'0.85rem',outline:'none'}}/>
              </div>
            ))}
            <div>
              <label style={{color:'#7c5c2e',fontSize:'0.72rem',display:'block',marginBottom:'4px'}}>Severity</label>
              <select value={newAlert.severity} onChange={e=>setNewAlert({...newAlert,severity:e.target.value})}
                style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'8px',padding:'7px 10px',color:'#fff7ed',fontSize:'0.85rem',outline:'none'}}>
                {['CRITICAL','HIGH','MEDIUM','LOW'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{color:'#7c5c2e',fontSize:'0.72rem',display:'block',marginBottom:'4px'}}>Est Cost (₹)</label>
              <input type="number" value={newAlert.cost} onChange={e=>setNewAlert({...newAlert,cost:+e.target.value})}
                style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'8px',padding:'7px 10px',color:'#fff7ed',fontSize:'0.85rem',outline:'none'}}/>
            </div>
            <div>
              <label style={{color:'#7c5c2e',fontSize:'0.72rem',display:'block',marginBottom:'4px'}}>Due in (days)</label>
              <input type="number" value={newAlert.days} onChange={e=>setNewAlert({...newAlert,days:+e.target.value})}
                style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'8px',padding:'7px 10px',color:'#fff7ed',fontSize:'0.85rem',outline:'none'}}/>
            </div>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={addAlert} style={{background:'linear-gradient(135deg,#fb923c,#f59e0b)',color:'#0f0900',border:'none',padding:'8px 24px',borderRadius:'8px',fontWeight:'800',cursor:'pointer',fontFamily:'Syne,sans-serif'}}>Save Alert</button>
            <button onClick={()=>setShowAdd(false)} style={{background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'#7c5c2e',padding:'8px 16px',borderRadius:'8px',cursor:'pointer'}}>Cancel</button>
          </div>
        </div>
      )}

      {/* ALERTS TAB */}
      {tab==='ALERTS'&&(
        <>
          <div style={{display:'flex',gap:'8px',marginBottom:'1rem',flexWrap:'wrap'}}>
            {['ALL','CRITICAL','HIGH','MEDIUM','LOW'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                style={{padding:'4px 12px',borderRadius:'99px',border:`1px solid ${filter===f?(AC[f]||'#fb923c'):'rgba(251,146,60,0.15)'}`,background:filter===f?`${AC[f]||'#fb923c'}15`:'transparent',color:filter===f?(AC[f]||'#fb923c'):'#7c5c2e',cursor:'pointer',fontSize:'0.72rem',fontWeight:'600'}}>
                {f} ({(f==='ALL'?data.alerts:data.alerts.filter(a=>a.severity===f)).length})
              </button>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {alerts.map(a=>(
              <div key={a.id} style={{background:'rgba(255,255,255,0.02)',border:`1px solid ${AC[a.severity]}22`,borderRadius:'14px',padding:'1.25rem',display:'flex',alignItems:'stretch',gap:'1rem'}}>
                <div style={{width:'5px',borderRadius:'3px',background:AC[a.severity],flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
                    <div>
                      <span style={{fontFamily:'Syne,sans-serif',fontSize:'0.95rem',fontWeight:'700',color:'#fff7ed'}}>{a.vehicle}</span>
                      <span style={{color:'#7c5c2e',fontSize:'0.82rem'}}> — {a.issue}</span>
                    </div>
                    <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                      <span style={{background:`${AC[a.severity]}15`,color:AC[a.severity],padding:'3px 10px',borderRadius:'99px',fontSize:'0.7rem',fontWeight:'700'}}>{a.severity}</span>
                      {a.cost>0&&<span style={{color:'#c482ff',fontSize:'0.78rem',fontWeight:'700'}}>₹{a.cost.toLocaleString()}</span>}
                    </div>
                  </div>
                  <p style={{color:'#7c5c2e',fontSize:'0.8rem',marginBottom:'4px'}}>{a.detail}</p>
                  <p style={{color:AC[a.severity],fontSize:'0.78rem',opacity:0.85}}>→ {a.action}</p>
                  <div style={{display:'flex',gap:'1rem',marginTop:'6px'}}>
                    <span style={{fontSize:'0.7rem',color:'#475569'}}>{a.plate}</span>
                    <span style={{fontSize:'0.7rem',color:a.days<0?'#f87171':a.days===0?'#facc15':'#475569'}}>{a.days<0?`⚠️ ${Math.abs(a.days)}d overdue`:a.days===0?'⚠️ Due today':`Due in ${a.days}d`}</span>
                    <span style={{fontSize:'0.7rem',color:'#475569'}}>Added: {a.createdAt}</span>
                  </div>
                </div>
                <button onClick={()=>resolve(a.id)}
                  style={{background:`${AC[a.severity]}15`,border:`1px solid ${AC[a.severity]}30`,color:AC[a.severity],padding:'8px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'0.78rem',fontWeight:'700',whiteSpace:'nowrap',alignSelf:'center',fontFamily:'Syne,sans-serif'}}>
                  ✓ Resolved
                </button>
              </div>
            ))}
            {alerts.length===0&&(
              <div style={{textAlign:'center',padding:'4rem',color:'#7c5c2e',background:'rgba(251,146,60,0.03)',borderRadius:'14px',border:'1px solid rgba(251,146,60,0.08)'}}>
                <div style={{fontSize:'3rem',marginBottom:'1rem'}}>✅</div>
                <p>All vehicles healthy! No alerts.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* HISTORY TAB */}
      {tab==='HISTORY'&&(
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
            <p style={{color:'#7c5c2e',fontSize:'0.82rem'}}>Total spent: <span style={{color:'#c482ff',fontWeight:'700'}}>₹{historyCost.toLocaleString()}</span></p>
          </div>
          <div style={{background:'rgba(251,146,60,0.03)',border:'1px solid rgba(251,146,60,0.08)',borderRadius:'14px',overflow:'hidden'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{borderBottom:'1px solid rgba(251,146,60,0.1)'}}>
                  {['Vehicle','Issue','Cost','Date','Technician'].map(h=>(
                    <th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:'0.72rem',fontWeight:'700',color:'#7c5c2e',fontFamily:'Syne,sans-serif',letterSpacing:'0.06em'}}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...data.history].reverse().map((h,i)=>(
                  <tr key={h.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)',background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                    <td style={{padding:'10px 14px',fontSize:'0.85rem',color:'#fff7ed',fontWeight:'500'}}>{h.vehicle}</td>
                    <td style={{padding:'10px 14px',fontSize:'0.82rem',color:'#7c5c2e'}}>{h.issue}</td>
                    <td style={{padding:'10px 14px',fontFamily:'Syne,sans-serif',fontSize:'0.9rem',fontWeight:'700',color:'#c482ff'}}>₹{h.cost.toLocaleString()}</td>
                    <td style={{padding:'10px 14px',fontSize:'0.78rem',color:'#7c5c2e'}}>{h.date}</td>
                    <td style={{padding:'10px 14px',fontSize:'0.78rem',color:'#4ade80'}}>{h.tech}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.history.length===0&&<p style={{textAlign:'center',padding:'3rem',color:'#7c5c2e'}}>No maintenance history yet</p>}
          </div>
        </div>
      )}

      {/* SCHEDULE TAB */}
      {tab==='SCHEDULE'&&(
        <div>
          <p style={{color:'#7c5c2e',fontSize:'0.82rem',marginBottom:'1.25rem'}}>Upcoming service schedule for all vehicles</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            {[{label:'This Week',days:7,color:'#f87171'},{label:'This Month',days:30,color:'#facc15'},{label:'Next 3 Months',days:90,color:'#4ade80'},{label:'Upcoming',days:365,color:'#94a3b8'}].map(({label,days,color})=>{
              const veh = data.alerts.filter(a=>a.days>=0&&a.days<=days);
              return (
                <div key={label} style={{background:'rgba(255,255,255,0.02)',border:`1px solid ${color}20`,borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
                    <h3 style={{fontFamily:'Syne,sans-serif',fontSize:'0.9rem',fontWeight:'700',color}}>{label}</h3>
                    <span style={{background:`${color}15`,color,padding:'3px 10px',borderRadius:'99px',fontSize:'0.7rem',fontWeight:'700'}}>{veh.length} alerts</span>
                  </div>
                  {veh.length===0?<p style={{color:'#475569',fontSize:'0.78rem'}}>All clear ✓</p>:veh.map(a=>(
                    <div key={a.id} style={{padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div>
                        <div style={{fontSize:'0.8rem',color:'#fff7ed',fontWeight:'500'}}>{a.vehicle}</div>
                        <div style={{fontSize:'0.7rem',color:'#7c5c2e'}}>{a.issue}</div>
                      </div>
                      <span style={{fontSize:'0.72rem',color,fontWeight:'700'}}>{a.days===0?'Today':`${a.days}d`}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}