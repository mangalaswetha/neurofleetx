import React, { useState, useEffect } from 'react';
import { getTelemetry, predictHealth } from '../../services/IoTTelemetry';

const HISTORY_KEY = 'NFX_HEALTH_HISTORY';

function HealthGauge({ score }) {
  const color = score>=80?'#4ade80':score>=60?'#facc15':'#f87171';
  const circumference = 2*Math.PI*40;
  const dash = (score/100)*circumference;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
      <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circumference-dash}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{transition:'stroke-dasharray 0.5s'}}/>
      <text x="50" y="46" textAnchor="middle" fill={color} fontSize="18" fontWeight="800" fontFamily="Syne,sans-serif">{score}</text>
      <text x="50" y="60" textAnchor="middle" fill="#64748b" fontSize="9">/100</text>
    </svg>
  );
}

function MiniChart({ data, color, label }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max-min || 1;
  const w = 120, h = 40;
  const pts = data.map((v,i) => `${(i/(data.length-1))*w},${h-((v-min)/range)*h}`).join(' ');
  return (
    <div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx={(data.length-1)/(data.length-1)*w} cy={h-((data[data.length-1]-min)/range)*h} r="3" fill={color}/>
      </svg>
      <div style={{fontSize:'0.65rem',color:'#475569',marginTop:'2px'}}>{label}</div>
    </div>
  );
}

export default function PredictiveMaintenance() {
  const [vehicles,  setVehicles]  = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [history,   setHistory]   = useState(()=>{ try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||'{}')}catch{return {}}; });
  const [time,      setTime]      = useState(new Date());

  useEffect(()=>{
    const refresh = () => {
      const data = getTelemetry();
      setVehicles(data);
      // Record health history for sparklines
      const h = JSON.parse(localStorage.getItem(HISTORY_KEY)||'{}');
      data.forEach(v=>{
        const health = predictHealth(v);
        if (!h[v.id]) h[v.id]={scores:[],temps:[],fuels:[]};
        h[v.id].scores = [...(h[v.id].scores||[]).slice(-19), health.score];
        h[v.id].temps  = [...(h[v.id].temps||[]).slice(-19),  v.engineTemp];
        h[v.id].fuels  = [...(h[v.id].fuels||[]).slice(-19),  v.isEv?v.battery:v.fuel];
      });
      localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
      setHistory({...h});
      setTime(new Date());
    };
    refresh();
    const t = setInterval(refresh, 3000);
    return ()=>clearInterval(t);
  },[]);

  const HC = {HEALTHY:'#4ade80',WARNING:'#facc15',CRITICAL:'#f87171'};
  const healthData = vehicles.map(v=>({...v, health:predictHealth(v)}));
  const critical = healthData.filter(v=>v.health.status==='CRITICAL');
  const warning  = healthData.filter(v=>v.health.status==='WARNING');

  return (
    <div style={{padding:'2rem',background:'#080f1e',minHeight:'100vh',color:'#e2e8f0',fontFamily:'DM Sans,sans-serif'}}>
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'1.9rem',fontWeight:'800',color:'#fff'}}>Predictive Maintenance</h1>
        <p style={{color:'#475569',fontSize:'0.82rem',marginTop:'4px'}}>ML-powered health analytics · {time.toLocaleTimeString()} · Auto-updates every 3s</p>
      </div>

      {/* Summary */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'1.5rem'}}>
        {[['Healthy',healthData.filter(v=>v.health.status==='HEALTHY').length,'#4ade80'],['Warning',warning.length,'#facc15'],['Critical',critical.length,'#f87171'],['Avg Health',`${Math.round(healthData.reduce((s,v)=>s+v.health.score,0)/(healthData.length||1))}/100`,'#38bdf8']].map(([l,v,c])=>(
          <div key={l} style={{background:`${c}08`,border:`1px solid ${c}20`,borderRadius:'12px',padding:'1.25rem',textAlign:'center'}}>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.8rem',fontWeight:'800',color:c}}>{v}</div>
            <div style={{color:'#64748b',fontSize:'0.72rem',marginTop:'3px'}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Critical alerts banner */}
      {critical.length>0&&(
        <div style={{background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.25)',borderRadius:'12px',padding:'1rem',marginBottom:'1.25rem'}}>
          <div style={{fontFamily:'Syne,sans-serif',fontWeight:'700',color:'#f87171',marginBottom:'8px'}}>🚨 CRITICAL ALERTS — Immediate Action Required</div>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
            {critical.map(v=>v.health.issues.map((iss,i)=>(
              <div key={`${v.id}-${i}`} style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:'8px',padding:'6px 12px'}}>
                <span style={{color:'#f87171',fontWeight:'600',fontSize:'0.82rem'}}>{v.name}</span>
                <span style={{color:'#94a3b8',fontSize:'0.78rem',marginLeft:'6px'}}>— {iss.type}: {iss.value}</span>
              </div>
            )))}
          </div>
        </div>
      )}

      {/* Vehicle health grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'12px'}}>
        {healthData.map(v=>{
          const h = history[v.id] || {};
          const isSelected = selected===v.id;
          return (
            <div key={v.id} onClick={()=>setSelected(isSelected?null:v.id)}
              style={{background:isSelected?'rgba(56,189,248,0.08)':'rgba(255,255,255,0.02)',border:`1px solid ${HC[v.health.status]}25`,borderRadius:'14px',padding:'1.25rem',cursor:'pointer',transition:'all 0.2s'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                <div>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:'700',color:'#e2e8f0',fontSize:'0.95rem'}}>{v.name}</div>
                  <div style={{fontSize:'0.72rem',color:'#475569',marginTop:'2px'}}>{v.status.replace('_',' ')} · {v.isEv?'EV':'ICE'}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <HealthGauge score={v.health.score}/>
                </div>
              </div>

              {/* Sensor bars */}
              <div style={{display:'flex',flexDirection:'column',gap:'6px',marginBottom:'0.75rem'}}>
                {[
                  [v.isEv?'Battery':'Fuel', Math.round(v.isEv?v.battery:v.fuel), 100, v.isEv?'#38bdf8':'#4ade80'],
                  ['Engine Temp', v.engineTemp.toFixed(0), 110, v.engineTemp>95?'#f87171':v.engineTemp>85?'#facc15':'#4ade80'],
                  ['Tire Pressure', v.tirePressure, 40, v.tirePressure<30?'#f87171':v.tirePressure<32?'#facc15':'#4ade80'],
                ].map(([label,val,max,color])=>(
                  <div key={label}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.68rem',color:'#475569',marginBottom:'2px'}}>
                      <span>{label}</span><span style={{color}}>{val}{label==='Engine Temp'?'°C':label==='Tire Pressure'?' PSI':'%'}</span>
                    </div>
                    <div style={{height:'4px',background:'rgba(255,255,255,0.06)',borderRadius:'2px'}}>
                      <div style={{width:`${(val/max)*100}%`,height:'100%',background:color,borderRadius:'2px'}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Issues */}
              {v.health.issues.length>0&&(
                <div style={{display:'flex',flexDirection:'column',gap:'4px',marginBottom:'0.75rem'}}>
                  {v.health.issues.map((iss,i)=>(
                    <div key={i} style={{background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.15)',borderRadius:'6px',padding:'5px 8px',fontSize:'0.75rem'}}>
                      <span style={{color:'#f87171',fontWeight:'600'}}>{iss.type}</span>
                      <span style={{color:'#64748b',marginLeft:'6px'}}>{iss.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sparklines */}
              {isSelected&&h.scores&&(
                <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'0.75rem',display:'flex',gap:'1.5rem'}}>
                  <MiniChart data={h.scores} color="#38bdf8" label="Health trend"/>
                  <MiniChart data={h.temps}  color="#fb923c" label="Engine temp"/>
                  <MiniChart data={h.fuels}  color="#4ade80" label="Fuel/Battery"/>
                </div>
              )}

              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'0.5rem'}}>
                <span style={{background:`${HC[v.health.status]}15`,color:HC[v.health.status],padding:'3px 10px',borderRadius:'99px',fontSize:'0.68rem',fontWeight:'700'}}>
                  {v.health.status}
                </span>
                <span style={{fontSize:'0.68rem',color:'#334155'}}>{isSelected?'Click to collapse ↑':'Click for details ↓'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ML Prediction info */}
      <div style={{marginTop:'1.5rem',background:'rgba(56,189,248,0.04)',border:'1px solid rgba(56,189,248,0.1)',borderRadius:'14px',padding:'1.25rem'}}>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.85rem',fontWeight:'700',color:'#38bdf8',marginBottom:'0.75rem'}}>🤖 ML Prediction Model</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}}>
          {[['Algorithm','Threshold-based ML + rule engine'],['Data Points','Fuel, temp, tire PSI, speed, mileage'],['Update Rate','Every 3 seconds from IoT sensors'],['Accuracy','Simulated — connect real IoT for live data']].map(([l,v])=>(
            <div key={l} style={{background:'rgba(255,255,255,0.02)',borderRadius:'8px',padding:'10px'}}>
              <div style={{color:'#475569',fontSize:'0.68rem',marginBottom:'3px'}}>{l}</div>
              <div style={{color:'#e2e8f0',fontSize:'0.78rem',fontWeight:'500'}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}