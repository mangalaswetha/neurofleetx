import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LOCATIONS = {
  'Anna Nagar':   [13.0850, 80.2101],
  'T. Nagar':     [13.0418, 80.2341],
  'Adyar':        [13.0012, 80.2565],
  'Velachery':    [12.9815, 80.2180],
  'OMR':          [12.9260, 80.2300],
  'Tambaram':     [12.9249, 80.1000],
  'Guindy':       [13.0067, 80.2206],
  'Mylapore':     [13.0368, 80.2676],
};

export default function RouteMap() {
  const [from, setFrom] = useState('Anna Nagar');
  const [to, setTo] = useState('T. Nagar');
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateRoute = async () => {
    setLoading(true);
    const startCoords = LOCATIONS[from];
    const endCoords = LOCATIONS[to];
    const dist = Math.sqrt(
      Math.pow((endCoords[0]-startCoords[0])*111, 2) +
      Math.pow((endCoords[1]-startCoords[1])*111, 2)
    ).toFixed(1);

    setRoute({
      coordinates: [startCoords, endCoords],
      distance: dist,
      eta: Math.round(dist / 0.5),
      from, to,
    });

    try {
      await axios.post('http://localhost:5000/api/ai/routes', { start: from, end: to });
    } catch {}
    setLoading(false);
  };

  return (
    <div style={{ padding:'2rem', background:'#0d1117', minHeight:'100vh' }}>
      <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:'1.8rem', color:'#e2e8f0', marginBottom:'1.5rem' }}>
        🗺️ AI Route Optimization
      </h1>

      {/* Controls */}
      <div style={{ background:'#111827', border:'1px solid rgba(0,212,255,0.1)', borderRadius:'12px', padding:'1.25rem', marginBottom:'1.25rem', display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'flex-end' }}>
        <div>
          <label style={{ color:'#64748b', fontSize:'0.78rem', display:'block', marginBottom:'6px' }}>From</label>
          <select value={from} onChange={e => setFrom(e.target.value)}
            style={{ background:'#0d1117', border:'1px solid rgba(0,212,255,0.2)', borderRadius:'8px', padding:'0.6rem 1rem', color:'#e2e8f0', fontSize:'0.9rem' }}>
            {Object.keys(LOCATIONS).map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label style={{ color:'#64748b', fontSize:'0.78rem', display:'block', marginBottom:'6px' }}>To</label>
          <select value={to} onChange={e => setTo(e.target.value)}
            style={{ background:'#0d1117', border:'1px solid rgba(0,212,255,0.2)', borderRadius:'8px', padding:'0.6rem 1rem', color:'#e2e8f0', fontSize:'0.9rem' }}>
            {Object.keys(LOCATIONS).map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <button onClick={calculateRoute} disabled={loading}
          style={{ background:'linear-gradient(135deg,#00d4ff,#0088ff)', color:'#000', border:'none', padding:'0.65rem 1.5rem', borderRadius:'8px', fontWeight:'700', cursor:'pointer', fontSize:'0.9rem' }}>
          {loading ? 'Calculating...' : '🤖 Get Route'}
        </button>
        {route && (
          <div style={{ display:'flex', gap:'1rem', marginLeft:'auto' }}>
            <div style={{ background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:'8px', padding:'0.6rem 1rem', textAlign:'center' }}>
              <div style={{ color:'#00d4ff', fontSize:'1.2rem', fontWeight:'700' }}>{route.distance} km</div>
              <div style={{ color:'#475569', fontSize:'0.7rem' }}>Distance</div>
            </div>
            <div style={{ background:'rgba(0,255,136,0.1)', border:'1px solid rgba(0,255,136,0.2)', borderRadius:'8px', padding:'0.6rem 1rem', textAlign:'center' }}>
              <div style={{ color:'#00ff88', fontSize:'1.2rem', fontWeight:'700' }}>{route.eta} min</div>
              <div style={{ color:'#475569', fontSize:'0.7rem' }}>ETA</div>
            </div>
          </div>
        )}
      </div>

      {/* REAL MAP */}
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(0,212,255,0.15)', height:'450px' }}>
        <MapContainer
          center={[13.0827, 80.2707]}
          zoom={12}
          style={{ height:'100%', width:'100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {Object.entries(LOCATIONS).map(([name, coords]) => (
            <Marker key={name} position={coords}>
              <Popup>{name}</Popup>
            </Marker>
          ))}
          {route && (
            <Polyline
              positions={route.coordinates}
              color="#00d4ff"
              weight={4}
              opacity={0.8}
              dashArray="8 4"
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}