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
  'Anna Nagar':   [13.0850,80.2101],
  'T. Nagar':     [13.0418,80.2341],
  'Adyar':        [13.0012,80.2565],
  'Velachery':    [12.9815,80.2180],
  'OMR':          [12.9260,80.2300],
  'Tambaram':     [12.9249,80.1000],
  'Guindy':       [13.0067,80.2206],
  'Mylapore':     [13.0368,80.2676],
  'Nungambakkam': [13.0569,80.2425],
  'Egmore':       [13.0784,80.2598],
};

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyToBounds(coords, { padding:[50,50], duration:1.2 });
  }, [coords, map]);
  return null;
}

export default function DriverMap() {
  const [from,   setFrom]   = useState('Anna Nagar');
  const [to,     setTo]     = useState('T. Nagar');
  const [route,  setRoute]  = useState(null);
  const [loading,setLoading]= useState(false);

  const calcRoute = () => {
    if (from===to) return;
    setLoading(true);
    setTimeout(() => {
      const s = LOCS[from]; const e = LOCS[to];
      const dist = +Math.sqrt(Math.pow((e[0]-s[0])*111,2)+Math.pow((e[1]-s[1])*111,2)).toFixed(1);
      const steps = [
        { icon:'🚦', text:`Start at ${from}` },
        { icon:'➡️', text:'Head to main road, keep right' },
        { icon:'🛣️', text:'Take inner ring road towards destination' },
        { icon:'🔀', text:'At major junction, follow signs' },
        { icon:'🏁', text:`Arrive at ${to}` },
      ];
      setRoute({ from, to, coords:[s,e], dist, eta:Math.round(dist/0.4), steps });
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ padding:'2rem', background:'#050f08', minHeight:'100vh', color:'#e8fdf0' }}>
      <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.9rem', fontWeight:'800', color:'#fff', marginBottom:'1.5rem' }}>Navigation</h1>

      <div style={{ background:'rgba(74,222,128,0.06)', border:'1px solid rgba(74,222,128,0.15)', borderRadius:'14px', padding:'1.25rem', marginBottom:'1.25rem', display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'flex-end' }}>
        {[['FROM',from,setFrom],['TO',to,setTo]].map(([label,val,setter])=>(
          <div key={label}>
            <label style={{ color:'#4d7a5e', fontSize:'0.75rem', display:'block', marginBottom:'6px', fontWeight:'600' }}>{label}</label>
            <select value={val} onChange={e=>setter(e.target.value)}
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:'8px', padding:'0.65rem 1rem', color:'#e8fdf0', fontSize:'0.88rem', outline:'none', minWidth:'160px' }}>
              {Object.keys(LOCS).map(l=><option key={l}>{l}</option>)}
            </select>
          </div>
        ))}
        <button onClick={calcRoute} disabled={loading||from===to}
          style={{ background:(loading||from===to)?'rgba(255,255,255,0.05)':'linear-gradient(135deg,#4ade80,#22c55e)', color:(loading||from===to)?'#475569':'#050f08', border:'none', padding:'0.7rem 1.5rem', borderRadius:'8px', fontWeight:'800', cursor:(loading||from===to)?'not-allowed':'pointer', fontSize:'0.9rem', fontFamily:'Syne,sans-serif' }}>
          {loading?'⏳ Calculating...':'GET ROUTE'}
        </button>
        {route && (
          <div style={{ display:'flex', gap:'10px' }}>
            <div style={{ background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:'8px', padding:'6px 12px', textAlign:'center' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', fontWeight:'800', color:'#4ade80' }}>{route.dist} km</div>
              <div style={{ color:'#4d7a5e', fontSize:'0.68rem' }}>Distance</div>
            </div>
            <div style={{ background:'rgba(250,204,21,0.1)', border:'1px solid rgba(250,204,21,0.2)', borderRadius:'8px', padding:'6px 12px', textAlign:'center' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', fontWeight:'800', color:'#facc15' }}>{route.eta} min</div>
              <div style={{ color:'#4d7a5e', fontSize:'0.68rem' }}>ETA</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns: route?'1fr 280px':'1fr', gap:'1rem', alignItems:'start' }}>
        <div style={{ borderRadius:'14px', overflow:'hidden', border:'1px solid rgba(74,222,128,0.15)', height:'420px' }}>
          <MapContainer center={[13.0400,80.2200]} zoom={11} style={{ height:'100%', width:'100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap"/>
            {Object.entries(LOCS).map(([name,coords])=>(
              <Marker key={name} position={coords}><Popup><strong>{name}</strong>, Chennai</Popup></Marker>
            ))}
            {route && (
              <>
                <Polyline positions={route.coords} color="#4ade80" weight={6} opacity={0.9} dashArray="10 5"/>
                <FlyTo coords={route.coords}/>
              </>
            )}
          </MapContainer>
        </div>

        {route && (
          <div style={{ background:'rgba(74,222,128,0.04)', border:'1px solid rgba(74,222,128,0.12)', borderRadius:'14px', padding:'1.25rem', maxHeight:'420px', overflowY:'auto' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.85rem', fontWeight:'700', color:'#4ade80', marginBottom:'0.75rem', letterSpacing:'0.08em' }}>
              TURN-BY-TURN
            </div>
            {route.steps.map((step,i)=>(
              <div key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start', padding:'8px 0', borderBottom:'1px solid rgba(74,222,128,0.08)' }}>
                <div style={{ width:'24px', height:'24px', borderRadius:'50%', background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', color:'#4ade80', fontWeight:'700', flexShrink:0, fontFamily:'Syne,sans-serif' }}>{i+1}</div>
                <div style={{ fontSize:'0.82rem', color:'#e8fdf0' }}>{step.icon} {step.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}