import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getTelemetry, updateTelemetry, getStoredTraffic, getTrafficData, predictHealth, initTelemetry } from '../../services/IoTTelemetry';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createVehicleIcon = (status, isEv) => {
  const color = status==='IN_USE'?'#facc15':status==='MAINTENANCE'?'#f87171':status==='IDLE'?'#94a3b8':'#4ade80';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="${color}" opacity="0.2" stroke="${color}" stroke-width="2"/>
    <circle cx="16" cy="16" r="7" fill="${color}"/>
    <text x="16" y="20" text-anchor="middle" font-size="9" fill="#000" font-weight="bold">${isEv?'EV':'🚗'}</text>
  </svg>`;
  return L.divIcon({ html: svg, className:'', iconSize:[32,32], iconAnchor:[16,16] });
};

const SC = {AVAILABLE:'#4ade80',IN_USE:'#facc15',MAINTENANCE:'#f87171',IDLE:'#94a3b8'};
const HC = {HEALTHY:'#4ade80',WARNING:'#facc15',CRITICAL:'#f87171'};

export default function LiveTracking() {
  const [vehicles,  setVehicles]  = useState([]);
  const [traffic,   setTraffic]   = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [showTraffic,setShowTraffic]=useState(true);
  const [filter,    setFilter]    = useState('ALL');
  const [time,      setTime]      = useState(new Date());
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!getTelemetry().length) initTelemetry();
    setVehicles(getTelemetry());
    setTraffic(getTrafficData());
    intervalRef.current = setInterval(() => {
      setVehicles(updateTelemetry());
      setTraffic(getStoredTraffic());
      setTime(new Date());
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const filtered = filter==='ALL' ? vehicles : vehicles.filter(v=>v.status===filter);
  const live     = vehicles.filter(v=>v.status==='IN_USE');
  const avgSpeed = live.length ? Math.round(live.reduce((s,v)=>s+v.speed,0)/live.length) : 0;
  const alerts   = vehicles.filter(v=>predictHealth(v).status!=='HEALTHY').length;

  return (
    <div style={{padding:'2rem',background:'#080f1e',minHeight:'100vh',color:'#e2e8f0',fontFamily:'DM Sans,sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'}}>
        <div>
          <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'1.9rem',fontWeight:'800',color:'#fff'}}>Live Fleet Tracking</h1>
          <p style={{color:'#475569',fontSize:'0.82rem',marginTop:'4px'}}>
            Real-time IoT telemetry · Updates every 3s · {time.toLocaleTimeString()}
          </p>
        </div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <button onClick={()=>setShowTraffic(!showTraffic)}
            style={{padding:'6px 14px',borderRadius:'8px',border:`1px solid ${showTraffic?'#facc15':'rgba(56,189,248,0.2)'}`,background:showTraffic?'rgba(250,204,21,0.1)':'transparent',color:showTraffic?'#facc15':'#64748b',cursor:'pointer',fontSize:'0.78rem',fontWeight:'600'}}>
            🚦 Traffic {showTraffic?'ON':'OFF'}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'10px',marginBottom:'1.25rem'}}>
        {[['Live Vehicles',live.length,'#4ade80'],['Avg Speed',`${avgSpeed} km/h`,'#38bdf8'],['Available',vehicles.filter(v=>v.status==='AVAILABLE').length,'#64748b'],['Health Alerts',alerts,'#f87171'],['Traffic Zones',traffic.filter(t=>t.congestion>60).length,'#facc15']].map(([l,v,c])=>(
          <div key={l} style={{background:`${c}08`,border:`1px solid ${c}20`,borderRadius:'10px',padding:'1rem',textAlign:'center'}}>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.6rem',fontWeight:'800',color:c}}>{v}</div>
            <div style={{color:'#64748b',fontSize:'0.7rem',marginTop:'3px'}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:'1.25rem'}}>
        {/* MAP */}
        <div style={{borderRadius:'14px',overflow:'hidden',border:'1px solid rgba(56,189,248,0.15)',height:'520px'}}>
          <MapContainer center={[13.0400,80.2200]} zoom={12} style={{height:'100%',width:'100%'}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap"/>
            {/* Traffic circles */}
            {showTraffic && traffic.map(t=>(
              <Circle key={t.id} center={[t.lat,t.lng]}
                radius={500}
                color={t.congestion>70?'#f87171':t.congestion>50?'#facc15':'#4ade80'}
                fillOpacity={0.15}
                weight={1}>
                <Tooltip permanent={false}>{t.name}: {t.congestion}% congestion</Tooltip>
              </Circle>
            ))}
            {/* Vehicle markers */}
            {filtered.map(v=>{
              const health = predictHealth(v);
              return (
                <Marker key={v.id} position={[v.lat,v.lng]} icon={createVehicleIcon(v.status,v.isEv)}
                  eventHandlers={{click:()=>setSelected(v)}}>
                  <Popup>
                    <div style={{fontFamily:'DM Sans,sans-serif',minWidth:'180px'}}>
                      <div style={{fontWeight:'700',fontSize:'0.95rem',marginBottom:'4px'}}>{v.name}</div>
                      <div style={{fontSize:'0.78rem',color:'#666',marginBottom:'6px'}}>Status: <span style={{color:SC[v.status],fontWeight:'700'}}>{v.status.replace('_',' ')}</span></div>
                      <div style={{fontSize:'0.78rem'}}>🏎 {v.speed} km/h</div>
                      <div style={{fontSize:'0.78rem'}}>{v.isEv?'⚡':'⛽'} {Math.round(v.isEv?v.battery:v.fuel)}%</div>
                      <div style={{fontSize:'0.78rem'}}>🌡 {v.engineTemp.toFixed(1)}°C</div>
                      <div style={{fontSize:'0.78rem',marginTop:'4px'}}>Health: <span style={{color:HC[health.status],fontWeight:'700'}}>{health.score}/100</span></div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* SIDEBAR */}
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {/* Filter */}
          <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
            {['ALL','IN_USE','AVAILABLE','MAINTENANCE','IDLE'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                style={{padding:'4px 10px',borderRadius:'99px',border:`1px solid ${filter===f?(SC[f]||'#38bdf8'):'rgba(56,189,248,0.15)'}`,background:filter===f?`${SC[f]||'#38bdf8'}15`:'transparent',color:filter===f?(SC[f]||'#38bdf8'):'#475569',cursor:'pointer',fontSize:'0.68rem',fontWeight:'600'}}>
                {f.replace('_',' ')}
              </button>
            ))}
          </div>

          {/* Vehicle list */}
          <div style={{display:'flex',flexDirection:'column',gap:'8px',maxHeight:'440px',overflowY:'auto'}}>
            {filtered.map(v=>{
              const health = predictHealth(v);
              const fuelLevel = v.isEv ? v.battery : v.fuel;
              return (
                <div key={v.id} onClick={()=>setSelected(selected?.id===v.id?null:v)}
                  style={{background:selected?.id===v.id?'rgba(56,189,248,0.1)':'rgba(255,255,255,0.03)',border:`1px solid ${selected?.id===v.id?'#38bdf8':SC[v.status]+'25'}`,borderRadius:'10px',padding:'0.9rem',cursor:'pointer',transition:'all 0.15s'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                    <div style={{fontSize:'0.85rem',fontWeight:'600',color:'#e2e8f0'}}>{v.name}</div>
                    <span style={{background:`${SC[v.status]}15`,color:SC[v.status],padding:'2px 8px',borderRadius:'99px',fontSize:'0.62rem',fontWeight:'700'}}>{v.status.replace('_',' ')}</span>
                  </div>
                  <div style={{display:'flex',gap:'10px',fontSize:'0.72rem',color:'#64748b',marginBottom:'6px'}}>
                    <span>🏎 {v.speed} km/h</span>
                    <span>{v.isEv?'⚡':'⛽'} {Math.round(fuelLevel)}%</span>
                    <span>🌡 {v.engineTemp.toFixed(0)}°C</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{flex:1,height:'4px',background:'rgba(255,255,255,0.06)',borderRadius:'2px',marginRight:'8px'}}>
                      <div style={{width:`${fuelLevel}%`,height:'100%',background:fuelLevel>40?'#4ade80':'#f87171',borderRadius:'2px'}}/>
                    </div>
                    <span style={{fontSize:'0.68rem',color:HC[health.status],fontWeight:'700',minWidth:'60px',textAlign:'right'}}>
                      {health.score}/100 {health.status==='CRITICAL'?'⚠️':health.status==='WARNING'?'⚡':'✓'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected vehicle detail */}
      {selected && (()=>{
        const health = predictHealth(selected);
        return (
          <div style={{marginTop:'1.25rem',background:'rgba(56,189,248,0.04)',border:'1px solid rgba(56,189,248,0.15)',borderRadius:'14px',padding:'1.5rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <h3 style={{fontFamily:'Syne,sans-serif',fontSize:'1.1rem',fontWeight:'700',color:'#38bdf8'}}>
                {selected.name} — Live Telemetry
              </h3>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <span style={{background:`${HC[health.status]}15`,color:HC[health.status],padding:'4px 12px',borderRadius:'99px',fontSize:'0.78rem',fontWeight:'700'}}>
                  Health: {health.score}/100 · {health.status}
                </span>
                <button onClick={()=>setSelected(null)} style={{background:'transparent',border:'none',color:'#475569',cursor:'pointer',fontSize:'1.2rem'}}>✕</button>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'10px',marginBottom:'1rem'}}>
              {[['Speed',`${selected.speed} km/h`,'#38bdf8'],['Engine',`${selected.engineTemp.toFixed(1)}°C`,selected.engineTemp>95?'#f87171':'#4ade80'],['Tire PSI',`${selected.tirePressure}`,selected.tirePressure<30?'#facc15':'#4ade80'],[selected.isEv?'Battery':'Fuel',`${Math.round(selected.isEv?selected.battery:selected.fuel)}%`,((selected.isEv?selected.battery:selected.fuel)>40)?'#4ade80':'#f87171'],['Latitude',selected.lat.toFixed(4),'#64748b'],['Longitude',selected.lng.toFixed(4),'#64748b']].map(([l,v,c])=>(
                <div key={l} style={{background:'rgba(255,255,255,0.03)',borderRadius:'8px',padding:'10px',textAlign:'center'}}>
                  <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.1rem',fontWeight:'800',color:c}}>{v}</div>
                  <div style={{color:'#475569',fontSize:'0.68rem',marginTop:'2px'}}>{l}</div>
                </div>
              ))}
            </div>
            {health.issues.length>0&&(
              <div>
                <div style={{fontSize:'0.78rem',color:'#f87171',fontWeight:'700',marginBottom:'6px'}}>⚠️ AI Health Alerts</div>
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  {health.issues.map((iss,i)=>(
                    <div key={i} style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:'8px',padding:'6px 12px',fontSize:'0.78rem'}}>
                      <span style={{color:'#f87171',fontWeight:'600'}}>{iss.type}</span>
                      <span style={{color:'#64748b',marginLeft:'6px'}}>{iss.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Traffic summary */}
      {showTraffic&&(
        <div style={{marginTop:'1.25rem',background:'rgba(250,204,21,0.04)',border:'1px solid rgba(250,204,21,0.12)',borderRadius:'14px',padding:'1.25rem'}}>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.85rem',fontWeight:'700',color:'#facc15',marginBottom:'0.75rem'}}>🚦 Live Traffic Intelligence</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px'}}>
            {traffic.map(t=>{
              const c = t.congestion>70?'#f87171':t.congestion>50?'#facc15':'#4ade80';
              return (
                <div key={t.id} style={{background:`${c}08`,border:`1px solid ${c}20`,borderRadius:'8px',padding:'8px 10px'}}>
                  <div style={{fontSize:'0.78rem',color:'#e2e8f0',fontWeight:'500',marginBottom:'4px'}}>{t.name}</div>
                  <div style={{height:'4px',background:'rgba(255,255,255,0.06)',borderRadius:'2px',marginBottom:'4px'}}>
                    <div style={{width:`${t.congestion}%`,height:'100%',background:c,borderRadius:'2px'}}/>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem'}}>
                    <span style={{color:c,fontWeight:'700'}}>{t.congestion}%</span>
                    <span style={{color:'#475569'}}>{t.trend}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}