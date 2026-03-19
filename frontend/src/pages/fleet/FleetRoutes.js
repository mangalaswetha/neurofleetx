import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LOCS = {
  'Anna Nagar':   { pos:[13.0850,80.2101], desc:'Northwestern suburb, residential hub' },
  'T. Nagar':     { pos:[13.0418,80.2341], desc:'Major commercial district' },
  'Adyar':        { pos:[13.0012,80.2565], desc:'Southern suburb near beach' },
  'Velachery':    { pos:[12.9815,80.2180], desc:'IT corridor suburb' },
  'OMR':          { pos:[12.9260,80.2300], desc:'Old Mahabalipuram Road, IT hub' },
  'Tambaram':     { pos:[12.9249,80.1000], desc:'Southwest suburb, railway junction' },
  'Guindy':       { pos:[13.0067,80.2206], desc:'Industrial & IT area' },
  'Mylapore':     { pos:[13.0368,80.2676], desc:'Historic cultural hub' },
  'Nungambakkam': { pos:[13.0569,80.2425], desc:'Central business district' },
  'Egmore':       { pos:[13.0784,80.2598], desc:'Central railway station area' },
};

function RouteStep({ num, icon, text, detail }) {
  return (
    <div style={{ display:'flex', gap:'12px', alignItems:'flex-start', padding:'10px 0', borderBottom:'1px solid rgba(251,146,60,0.08)' }}>
      <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'rgba(251,146,60,0.15)', border:'1px solid rgba(251,146,60,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', color:'#fb923c', fontWeight:'700', flexShrink:0, fontFamily:'Syne,sans-serif' }}>{num}</div>
      <div>
        <div style={{ fontSize:'0.85rem', color:'#fff7ed', fontWeight:'500' }}>{icon} {text}</div>
        {detail && <div style={{ fontSize:'0.75rem', color:'#7c5c2e', marginTop:'2px' }}>{detail}</div>}
      </div>
    </div>
  );
}

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyToBounds(coords, { padding:[40,40], duration:1.2 });
  }, [coords, map]);
  return null;
}

const ROUTE_TYPES = [
  { key:'fastest',  label:'Fastest',  color:'#fb923c' },
  { key:'shortest', label:'Shortest', color:'#4ade80' },
  { key:'eco',      label:'Eco',      color:'#38bdf8' },
];

function buildDirections(from, to, routeType) {
  const fInfo = LOCS[from];
  const tInfo = LOCS[to];
  const dist  = +Math.sqrt(Math.pow((tInfo.pos[0]-fInfo.pos[0])*111,2)+Math.pow((tInfo.pos[1]-fInfo.pos[1])*111,2)).toFixed(1);
  const eta   = { fastest:Math.round(dist/0.5), shortest:Math.round(dist/0.4), eco:Math.round(dist/0.45) }[routeType];
  const fuel  = { fastest:+(dist*0.08).toFixed(1), shortest:+(dist*0.07).toFixed(1), eco:+(dist*0.06).toFixed(1) }[routeType];

  const steps = [
    { icon:'🚦', text:`Start at ${from}`, detail:fInfo.desc },
    { icon:'➡️', text:`Head towards main road from ${from}`, detail:'Keep right at the junction' },
  ];

  if (routeType==='fastest') {
    steps.push({ icon:'🛣️', text:'Take the inner ring road', detail:'Fastest route — uses flyovers to avoid signals' });
    steps.push({ icon:'🔀', text:`Merge onto ${from} - ${to} corridor`, detail:'Keep lane, expect moderate traffic' });
  } else if (routeType==='shortest') {
    steps.push({ icon:'📍', text:'Take the direct city road', detail:'Shorter distance but may have signals' });
    steps.push({ icon:'🔀', text:'Pass through main junction', detail:'Follow signs toward destination' });
  } else {
    steps.push({ icon:'🌿', text:'Take the eco route via GST Road', detail:'Lower fuel consumption, smoother drive' });
    steps.push({ icon:'🔋', text:'Steady speed recommended: 40-50 km/h', detail:'Optimal for fuel/battery efficiency' });
  }

  steps.push({ icon:'🏁', text:`Arrive at ${to}`, detail:tInfo.desc });

  return { dist, eta, fuel, steps };
}

export default function FleetRoutes() {
  const [from,   setFrom]   = useState('Anna Nagar');
  const [to,     setTo]     = useState('Adyar');
  const [routes, setRoutes] = useState(null);
  const [active, setActive] = useState('fastest');
  const [loading,setLoading]= useState(false);

  const calcRoutes = () => {
    if (from===to) return;
    setLoading(true);
    setTimeout(() => {
      setRoutes({
        fastest:  buildDirections(from, to, 'fastest'),
        shortest: buildDirections(from, to, 'shortest'),
        eco:      buildDirections(from, to, 'eco'),
      });
      setLoading(false);
    }, 700);
  };

  const activeRoute = routes?.[active];
  const boundsCoords= activeRoute ? [LOCS[from].pos, LOCS[to].pos] : null;

  return (
    <div style={{ padding:'2rem', background:'#0f0900', minHeight:'100vh', color:'#fff7ed' }}>
      <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.9rem', fontWeight:'800', color:'#fff', marginBottom:'1.5rem' }}>
        AI Route Optimizer
      </h1>

      {/* Controls */}
      <div style={{ background:'rgba(251,146,60,0.06)', border:'1px solid rgba(251,146,60,0.15)', borderRadius:'14px', padding:'1.25rem', marginBottom:'1.25rem', display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'flex-end' }}>
        {[['FROM',from,setFrom],['TO',to,setTo]].map(([label,val,setter])=>(
          <div key={label}>
            <label style={{ color:'#7c5c2e', fontSize:'0.75rem', display:'block', marginBottom:'6px', fontWeight:'600', letterSpacing:'0.06em' }}>{label}</label>
            <select value={val} onChange={e=>setter(e.target.value)}
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(251,146,60,0.2)', borderRadius:'8px', padding:'0.65rem 1rem', color:'#fff7ed', fontSize:'0.88rem', outline:'none', minWidth:'170px' }}>
              {Object.keys(LOCS).map(l=><option key={l}>{l}</option>)}
            </select>
          </div>
        ))}
        <button onClick={calcRoutes} disabled={loading||from===to}
          style={{ background:(loading||from===to)?'rgba(255,255,255,0.05)':'linear-gradient(135deg,#fb923c,#f59e0b)', color:(loading||from===to)?'#475569':'#0f0900', border:'none', padding:'0.7rem 1.5rem', borderRadius:'8px', fontWeight:'800', cursor:(loading||from===to)?'not-allowed':'pointer', fontSize:'0.9rem', fontFamily:'Syne,sans-serif' }}>
          {loading ? '⏳ Calculating...' : '🤖 Get AI Routes'}
        </button>
        {from===to && <span style={{ color:'#f87171', fontSize:'0.8rem', alignSelf:'center' }}>⚠️ Choose different locations</span>}
      </div>

      {/* Route Type Selector */}
      {routes && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'1.25rem' }}>
          {ROUTE_TYPES.map(rt=>{
            const r = routes[rt.key];
            const isActive = active===rt.key;
            return (
              <div key={rt.key} onClick={()=>setActive(rt.key)}
                style={{ background:isActive?`${rt.color}12`:'rgba(255,255,255,0.02)', border:`${isActive?2:1}px solid ${isActive?rt.color:`${rt.color}25`}`, borderRadius:'12px', padding:'1.1rem', cursor:'pointer', transition:'all 0.2s' }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.8rem', fontWeight:'700', color:rt.color, marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.08em' }}>{rt.label}</div>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.5rem', fontWeight:'800', color:'#fff7ed' }}>{r.eta} min</div>
                <div style={{ color:'#7c5c2e', fontSize:'0.78rem', marginTop:'3px' }}>{r.dist} km</div>
                <div style={{ display:'flex', gap:'12px', marginTop:'6px' }}>
                  <span style={{ fontSize:'0.7rem', color:rt.color }}>⛽ {r.fuel}L</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Map + Directions side by side */}
      <div style={{ display:'grid', gridTemplateColumns: routes ? '1fr 340px' : '1fr', gap:'1.25rem', alignItems:'start' }}>
        {/* Real Map */}
        <div style={{ borderRadius:'14px', overflow:'hidden', border:'1px solid rgba(251,146,60,0.15)', height:'420px' }}>
          <MapContainer center={[13.0400,80.2200]} zoom={11} style={{ height:'100%', width:'100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap"/>
            {Object.entries(LOCS).map(([name,info])=>(
              <Marker key={name} position={info.pos}>
                <Popup><strong>{name}</strong><br/>{info.desc}</Popup>
              </Marker>
            ))}
            {activeRoute && (
              <>
                <Polyline positions={[LOCS[from].pos, LOCS[to].pos]} color={ROUTE_TYPES.find(r=>r.key===active)?.color||'#fb923c'} weight={6} opacity={0.9} dashArray={active==='eco'?'10 6':undefined}/>
                <FlyTo coords={boundsCoords} />
              </>
            )}
            {routes && ROUTE_TYPES.filter(r=>r.key!==active).map(rt=>(
              <Polyline key={rt.key} positions={[LOCS[from].pos,LOCS[to].pos]} color={rt.color} weight={2} opacity={0.2}/>
            ))}
          </MapContainer>
        </div>

        {/* Step-by-step Directions */}
        {activeRoute && (
          <div style={{ background:'rgba(251,146,60,0.04)', border:'1px solid rgba(251,146,60,0.12)', borderRadius:'14px', padding:'1.25rem', maxHeight:'420px', overflowY:'auto' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.9rem', fontWeight:'700', color:'#fb923c', marginBottom:'0.75rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>
              Turn-by-Turn Directions
            </div>
            <div style={{ background:'rgba(251,146,60,0.08)', borderRadius:'8px', padding:'8px 12px', marginBottom:'1rem', display:'flex', gap:'1.5rem' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.2rem', fontWeight:'800', color:'#fb923c' }}>{activeRoute.eta} min</div>
                <div style={{ color:'#7c5c2e', fontSize:'0.68rem' }}>ETA</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.2rem', fontWeight:'800', color:'#fff7ed' }}>{activeRoute.dist} km</div>
                <div style={{ color:'#7c5c2e', fontSize:'0.68rem' }}>Distance</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.2rem', fontWeight:'800', color:'#4ade80' }}>{activeRoute.fuel}L</div>
                <div style={{ color:'#7c5c2e', fontSize:'0.68rem' }}>Fuel</div>
              </div>
            </div>
            {activeRoute.steps.map((step,i)=>(
              <RouteStep key={i} num={i+1} icon={step.icon} text={step.text} detail={step.detail}/>
            ))}
            <div style={{ marginTop:'1rem', background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.15)', borderRadius:'8px', padding:'8px 12px', color:'#4ade80', fontSize:'0.78rem' }}>
              ✓ Route optimized by NeuroFleetX AI
            </div>
          </div>
        )}
      </div>

      {!routes && (
        <p style={{ textAlign:'center', marginTop:'1rem', color:'#7c5c2e', fontSize:'0.85rem' }}>
          Select origin and destination, then click Get AI Routes to see optimized paths with directions
        </p>
      )}
    </div>
  );
}