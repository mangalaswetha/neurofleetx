import React, { useState, useEffect } from 'react';

const INIT_VEHICLES = [
  {id:1,name:'Tesla Model 3', plate:'TN01AB1234',type:'EV',   status:'AVAILABLE',  fuel:85, battery:85,seats:5,mileage:12400,driver:'Unassigned',lastService:'2025-12-01',nextService:'2026-06-01',isEv:true, year:2023,color:'White',insurance:'2026-12-31'},
  {id:2,name:'Toyota Camry',  plate:'TN02CD5678',type:'SEDAN',status:'IN_USE',     fuel:72, battery:0, seats:5,mileage:48200,driver:'Raj Driver',  lastService:'2025-10-15',nextService:'2026-04-15',isEv:false,year:2022,color:'Silver',insurance:'2026-10-31'},
  {id:3,name:'Ford Transit',  plate:'TN03EF9012',type:'TRUCK',status:'MAINTENANCE',fuel:45, battery:0, seats:3,mileage:91000,driver:'Unassigned',  lastService:'2025-08-20',nextService:'2026-02-20',isEv:false,year:2021,color:'White',insurance:'2026-08-31'},
  {id:4,name:'Honda City',    plate:'TN04GH3456',type:'SEDAN',status:'AVAILABLE',  fuel:91, battery:0, seats:5,mileage:28500,driver:'Unassigned',  lastService:'2026-01-10',nextService:'2026-07-10',isEv:false,year:2023,color:'Blue', insurance:'2026-11-30'},
  {id:5,name:'BYD e6 MPV',    plate:'TN05IJ7890',type:'EV',   status:'AVAILABLE',  fuel:100,battery:92,seats:6,mileage:8900, driver:'Unassigned',  lastService:'2026-02-05',nextService:'2026-08-05',isEv:true, year:2023,color:'Black',insurance:'2027-01-31'},
  {id:6,name:'Mahindra XUV',  plate:'TN06KL2345',type:'SUV',  status:'IDLE',       fuel:60, battery:0, seats:7,mileage:35000,driver:'Unassigned',  lastService:'2025-11-20',nextService:'2026-05-20',isEv:false,year:2022,color:'Red',  insurance:'2026-09-30'},
];

const DRIVERS_LIST = ['Raj Driver','Priya Kumar','Ahmed Shah','Meena Rajan','Suresh Babu'];
const SC = {AVAILABLE:'#4ade80',IN_USE:'#facc15',MAINTENANCE:'#f87171',IDLE:'#94a3b8'};

const STORE_KEY = 'NFX_FLEET_VEHICLES';
const load = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || INIT_VEHICLES; } catch { return INIT_VEHICLES; } };
const save = (d) => localStorage.setItem(STORE_KEY, JSON.stringify(d));

export default function FleetHome() {
  const [vehicles,   setVehicles]   = useState(load);
  const [view,       setView]       = useState('GRID'); // GRID | TABLE | STATS
  const [filter,     setFilter]     = useState('ALL');
  const [search,     setSearch]     = useState('');
  const [selected,   setSelected]   = useState(null); // vehicle detail modal
  const [showAdd,    setShowAdd]    = useState(false);
  const [newV,       setNewV]       = useState({name:'',plate:'',type:'SEDAN',seats:5,color:'White',year:2024,insurance:''});
  const [time,       setTime]       = useState(new Date());

  useEffect(() => { const t=setInterval(()=>setTime(new Date()),1000); return ()=>clearInterval(t); },[]);
  useEffect(() => { save(vehicles); }, [vehicles]);

  const update = (id, changes) => setVehicles(prev => prev.map(v => v.id===id ? {...v,...changes} : v));
  const del    = (id) => { setVehicles(prev=>prev.filter(v=>v.id!==id)); setSelected(null); };

  const addVehicle = () => {
    if (!newV.name||!newV.plate) return;
    const v = {...newV, id:Date.now(), status:'AVAILABLE', fuel:100, battery:0, mileage:0, driver:'Unassigned', lastService:new Date().toISOString().split('T')[0], nextService:'', isEv:newV.type==='EV'};
    setVehicles(prev=>[...prev,v]);
    setShowAdd(false); setNewV({name:'',plate:'',type:'SEDAN',seats:5,color:'White',year:2024,insurance:''});
  };

  const filtered = vehicles
    .filter(v => filter==='ALL' || v.status===filter || v.type===filter)
    .filter(v => !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.plate.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    available: vehicles.filter(v=>v.status==='AVAILABLE').length,
    inUse:     vehicles.filter(v=>v.status==='IN_USE').length,
    maintenance:vehicles.filter(v=>v.status==='MAINTENANCE').length,
    idle:      vehicles.filter(v=>v.status==='IDLE').length,
    evCount:   vehicles.filter(v=>v.isEv).length,
    avgFuel:   Math.round(vehicles.reduce((s,v)=>s+(v.isEv?v.battery:v.fuel),0)/vehicles.length),
    dueService:vehicles.filter(v=>v.nextService && new Date(v.nextService)<new Date(Date.now()+30*86400000)).length,
  };

  const accent = '#fb923c';

  return (
    <div style={{padding:'2rem',background:'#0f0900',minHeight:'100vh',color:'#fff7ed',fontFamily:'DM Sans,sans-serif'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2rem'}}>
        <div>
          <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'1.9rem',fontWeight:'800',color:'#fff'}}>Fleet Dashboard</h1>
          <p style={{color:'#7c5c2e',fontSize:'0.82rem',marginTop:'4px'}}>{vehicles.length} vehicles · {time.toLocaleTimeString()}</p>
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          {['GRID','TABLE','STATS'].map(v=>(
            <button key={v} onClick={()=>setView(v)}
              style={{padding:'7px 16px',borderRadius:'8px',border:`1px solid ${view===v?accent:'rgba(251,146,60,0.2)'}`,background:view===v?`${accent}20`:'transparent',color:view===v?accent:'#7c5c2e',cursor:'pointer',fontSize:'0.78rem',fontWeight:'600',fontFamily:'Syne,sans-serif'}}>
              {v==='GRID'?'⊞ Grid':v==='TABLE'?'☰ Table':'◎ Stats'}
            </button>
          ))}
          <button onClick={()=>setShowAdd(true)}
            style={{padding:'7px 18px',borderRadius:'8px',border:'none',background:`linear-gradient(135deg,${accent},#f59e0b)`,color:'#0f0900',cursor:'pointer',fontSize:'0.82rem',fontWeight:'800',fontFamily:'Syne,sans-serif'}}>
            + Add Vehicle
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'8px',marginBottom:'1.5rem'}}>
        {[['Available',stats.available,'#4ade80'],['In Use',stats.inUse,'#facc15'],['Maintenance',stats.maintenance,'#f87171'],['Idle',stats.idle,'#94a3b8'],['EVs',stats.evCount,'#38bdf8'],['Avg Fuel',`${stats.avgFuel}%`,'#fb923c'],['Due Svc',stats.dueService,'#c482ff']].map(([l,v,c])=>(
          <div key={l} style={{background:`${c}08`,border:`1px solid ${c}20`,borderRadius:'10px',padding:'0.9rem',textAlign:'center'}}>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.5rem',fontWeight:'800',color:c}}>{v}</div>
            <div style={{color:'#7c5c2e',fontSize:'0.68rem',marginTop:'2px'}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{display:'flex',gap:'10px',marginBottom:'1.25rem',flexWrap:'wrap',alignItems:'center'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search vehicle or plate..."
          style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'8px',padding:'7px 14px',color:'#fff7ed',fontSize:'0.85rem',outline:'none',width:'220px'}}/>
        {['ALL','AVAILABLE','IN_USE','MAINTENANCE','IDLE','EV','SEDAN','SUV','TRUCK'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{padding:'5px 12px',borderRadius:'99px',border:`1px solid ${filter===f?accent:'rgba(251,146,60,0.15)'}`,background:filter===f?`${accent}15`:'transparent',color:filter===f?accent:'#7c5c2e',cursor:'pointer',fontSize:'0.72rem',fontWeight:'600',transition:'all 0.15s'}}>
            {f.replace('_',' ')} ({(f==='ALL'?vehicles:vehicles.filter(v=>v.status===f||v.type===f)).length})
          </button>
        ))}
      </div>

      {/* ADD VEHICLE FORM */}
      {showAdd&&(
        <div style={{background:'rgba(251,146,60,0.06)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'14px',padding:'1.5rem',marginBottom:'1.5rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}>
            <h3 style={{fontFamily:'Syne,sans-serif',color:accent,fontSize:'1rem',fontWeight:'700'}}>Add New Vehicle</h3>
            <button onClick={()=>setShowAdd(false)} style={{background:'transparent',border:'none',color:'#7c5c2e',cursor:'pointer',fontSize:'1.2rem'}}>✕</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'1rem'}}>
            {[['Vehicle Name','name','text'],['Plate Number','plate','text'],['Color','color','text'],['Insurance Expiry','insurance','date']].map(([l,k,t])=>(
              <div key={k}>
                <label style={{color:'#7c5c2e',fontSize:'0.72rem',display:'block',marginBottom:'4px'}}>{l}</label>
                <input type={t} value={newV[k]} onChange={e=>setNewV({...newV,[k]:e.target.value})}
                  style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'8px',padding:'7px 10px',color:'#fff7ed',fontSize:'0.85rem',outline:'none'}}/>
              </div>
            ))}
            <div>
              <label style={{color:'#7c5c2e',fontSize:'0.72rem',display:'block',marginBottom:'4px'}}>Type</label>
              <select value={newV.type} onChange={e=>setNewV({...newV,type:e.target.value})}
                style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'8px',padding:'7px 10px',color:'#fff7ed',fontSize:'0.85rem',outline:'none'}}>
                {['SEDAN','SUV','TRUCK','BUS','EV'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{color:'#7c5c2e',fontSize:'0.72rem',display:'block',marginBottom:'4px'}}>Year</label>
              <input type="number" value={newV.year} min="2010" max="2025" onChange={e=>setNewV({...newV,year:+e.target.value})}
                style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'8px',padding:'7px 10px',color:'#fff7ed',fontSize:'0.85rem',outline:'none'}}/>
            </div>
            <div>
              <label style={{color:'#7c5c2e',fontSize:'0.72rem',display:'block',marginBottom:'4px'}}>Seats</label>
              <input type="number" value={newV.seats} min="2" max="50" onChange={e=>setNewV({...newV,seats:+e.target.value})}
                style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'8px',padding:'7px 10px',color:'#fff7ed',fontSize:'0.85rem',outline:'none'}}/>
            </div>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={addVehicle} style={{background:`linear-gradient(135deg,${accent},#f59e0b)`,color:'#0f0900',border:'none',padding:'8px 24px',borderRadius:'8px',fontWeight:'800',cursor:'pointer',fontFamily:'Syne,sans-serif'}}>Save Vehicle</button>
            <button onClick={()=>setShowAdd(false)} style={{background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'#7c5c2e',padding:'8px 16px',borderRadius:'8px',cursor:'pointer'}}>Cancel</button>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {view==='GRID'&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:'12px'}}>
          {filtered.map(v=>(
            <div key={v.id} onClick={()=>setSelected(v)}
              style={{background:'rgba(251,146,60,0.04)',border:`1px solid ${SC[v.status]}25`,borderRadius:'14px',padding:'1.25rem',cursor:'pointer',transition:'all 0.2s',position:'relative'}}
              onMouseEnter={e=>e.currentTarget.style.border=`1px solid ${accent}50`}
              onMouseLeave={e=>e.currentTarget.style.border=`1px solid ${SC[v.status]}25`}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                <div>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:'700',color:'#fff7ed',fontSize:'0.95rem'}}>{v.name}</div>
                  <div style={{fontSize:'0.72rem',color:'#7c5c2e',marginTop:'2px'}}>{v.plate} · {v.year} · {v.color}</div>
                </div>
                <span style={{background:`${SC[v.status]}15`,color:SC[v.status],padding:'3px 9px',borderRadius:'99px',fontSize:'0.65rem',fontWeight:'700'}}>{v.status.replace('_',' ')}</span>
              </div>
              <div style={{display:'flex',gap:'1rem',marginBottom:'0.75rem'}}>
                <span style={{fontSize:'0.75rem',color:'#7c5c2e'}}>🪑 {v.seats}</span>
                <span style={{fontSize:'0.75rem',color:'#7c5c2e'}}>🚗 {v.type}</span>
                <span style={{fontSize:'0.75rem',color:'#7c5c2e'}}>📍 {v.mileage.toLocaleString()} km</span>
              </div>
              <div style={{marginBottom:'0.5rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.68rem',color:'#7c5c2e',marginBottom:'3px'}}>
                  <span>{v.isEv?'⚡ Battery':'⛽ Fuel'}</span>
                  <span style={{color:(v.isEv?v.battery:v.fuel)>30?'#4ade80':'#f87171'}}>{v.isEv?v.battery:v.fuel}%</span>
                </div>
                <div style={{height:'5px',background:'rgba(255,255,255,0.06)',borderRadius:'3px'}}>
                  <div style={{width:`${v.isEv?v.battery:v.fuel}%`,height:'100%',background:(v.isEv?v.battery:v.fuel)>30?'#4ade80':'#f87171',borderRadius:'3px'}}/>
                </div>
              </div>
              <div style={{fontSize:'0.72rem',color:v.driver==='Unassigned'?'#7c5c2e':'#4ade80'}}>
                👤 {v.driver}
              </div>
              {v.nextService&&new Date(v.nextService)<new Date(Date.now()+30*86400000)&&(
                <div style={{position:'absolute',top:'10px',right:'10px',background:'rgba(196,130,255,0.15)',color:'#c482ff',fontSize:'0.62rem',padding:'2px 6px',borderRadius:'4px',fontWeight:'700'}}>SVC DUE</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {view==='TABLE'&&(
        <div style={{background:'rgba(251,146,60,0.03)',border:'1px solid rgba(251,146,60,0.08)',borderRadius:'14px',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(251,146,60,0.1)'}}>
                {['Vehicle','Plate','Type','Status','Fuel/Bat','Driver','Mileage','Next Service','Actions'].map(h=>(
                  <th key={h} style={{padding:'10px 12px',textAlign:'left',fontSize:'0.72rem',fontWeight:'700',color:'#7c5c2e',fontFamily:'Syne,sans-serif',letterSpacing:'0.06em'}}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v,i)=>(
                <tr key={v.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)',background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                  <td style={{padding:'10px 12px'}}>
                    <div style={{fontSize:'0.85rem',fontWeight:'500',color:'#fff7ed'}}>{v.name}</div>
                    <div style={{fontSize:'0.68rem',color:'#7c5c2e'}}>{v.year} · {v.color}</div>
                  </td>
                  <td style={{padding:'10px 12px',fontSize:'0.8rem',color:'#94a3b8',fontFamily:'monospace'}}>{v.plate}</td>
                  <td style={{padding:'10px 12px',fontSize:'0.78rem',color:'#7c5c2e'}}>{v.isEv?'⚡':''} {v.type}</td>
                  <td style={{padding:'10px 12px'}}>
                    <select value={v.status} onChange={e=>update(v.id,{status:e.target.value})}
                      style={{background:`${SC[v.status]}12`,border:`1px solid ${SC[v.status]}30`,borderRadius:'6px',padding:'3px 8px',color:SC[v.status],fontSize:'0.72rem',fontWeight:'600',cursor:'pointer',outline:'none'}}>
                      {['AVAILABLE','IN_USE','MAINTENANCE','IDLE'].map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}
                    </select>
                  </td>
                  <td style={{padding:'10px 12px'}}>
                    <div style={{width:'70px'}}>
                      <div style={{height:'4px',background:'rgba(255,255,255,0.06)',borderRadius:'2px'}}>
                        <div style={{width:`${v.isEv?v.battery:v.fuel}%`,height:'100%',background:(v.isEv?v.battery:v.fuel)>30?'#4ade80':'#f87171',borderRadius:'2px'}}/>
                      </div>
                      <div style={{fontSize:'0.65rem',color:'#7c5c2e',marginTop:'2px',textAlign:'right'}}>{v.isEv?v.battery:v.fuel}%</div>
                    </div>
                  </td>
                  <td style={{padding:'10px 12px'}}>
                    <select value={v.driver} onChange={e=>update(v.id,{driver:e.target.value})}
                      style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(251,146,60,0.15)',borderRadius:'6px',padding:'3px 8px',color:v.driver==='Unassigned'?'#7c5c2e':'#4ade80',fontSize:'0.72rem',outline:'none',cursor:'pointer'}}>
                      <option>Unassigned</option>
                      {DRIVERS_LIST.map(d=><option key={d}>{d}</option>)}
                    </select>
                  </td>
                  <td style={{padding:'10px 12px',fontSize:'0.78rem',color:'#7c5c2e'}}>{v.mileage.toLocaleString()} km</td>
                  <td style={{padding:'10px 12px',fontSize:'0.75rem',color:v.nextService&&new Date(v.nextService)<new Date(Date.now()+30*86400000)?'#c482ff':'#7c5c2e'}}>{v.nextService||'—'}</td>
                  <td style={{padding:'10px 12px'}}>
                    <div style={{display:'flex',gap:'6px'}}>
                      <button onClick={()=>setSelected(v)} style={{background:'rgba(251,146,60,0.1)',border:'1px solid rgba(251,146,60,0.2)',color:accent,padding:'4px 10px',borderRadius:'6px',cursor:'pointer',fontSize:'0.72rem'}}>View</button>
                      <button onClick={()=>del(v.id)} style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',color:'#f87171',padding:'4px 10px',borderRadius:'6px',cursor:'pointer',fontSize:'0.72rem'}}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* STATS VIEW */}
      {view==='STATS'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem'}}>
          {/* Status breakdown */}
          <div style={{background:'rgba(251,146,60,0.04)',border:'1px solid rgba(251,146,60,0.1)',borderRadius:'14px',padding:'1.25rem'}}>
            <h3 style={{fontFamily:'Syne,sans-serif',fontSize:'1rem',fontWeight:'700',color:'#fff7ed',marginBottom:'1rem'}}>Status Distribution</h3>
            {Object.entries(SC).map(([s,c])=>{
              const count = vehicles.filter(v=>v.status===s).length;
              const pct   = Math.round(count/vehicles.length*100);
              return (
                <div key={s} style={{marginBottom:'12px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.78rem',marginBottom:'4px'}}>
                    <span style={{color:'#fff7ed',fontWeight:'500'}}>{s.replace('_',' ')}</span>
                    <span style={{color:c,fontWeight:'700'}}>{count} ({pct}%)</span>
                  </div>
                  <div style={{height:'8px',background:'rgba(255,255,255,0.06)',borderRadius:'4px'}}>
                    <div style={{width:`${pct}%`,height:'100%',background:c,borderRadius:'4px',transition:'width 0.5s'}}/>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Fuel health */}
          <div style={{background:'rgba(251,146,60,0.04)',border:'1px solid rgba(251,146,60,0.1)',borderRadius:'14px',padding:'1.25rem'}}>
            <h3 style={{fontFamily:'Syne,sans-serif',fontSize:'1rem',fontWeight:'700',color:'#fff7ed',marginBottom:'1rem'}}>Fuel & Battery Health</h3>
            {vehicles.map(v=>{
              const level = v.isEv?v.battery:v.fuel;
              const c = level>60?'#4ade80':level>30?'#facc15':'#f87171';
              return (
                <div key={v.id} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                  <div style={{width:'110px',fontSize:'0.75rem',color:'#fff7ed',fontWeight:'500',flexShrink:0}}>{v.name.split(' ').slice(0,2).join(' ')}</div>
                  <div style={{flex:1,height:'6px',background:'rgba(255,255,255,0.06)',borderRadius:'3px'}}>
                    <div style={{width:`${level}%`,height:'100%',background:c,borderRadius:'3px'}}/>
                  </div>
                  <div style={{width:'32px',fontSize:'0.72rem',color:c,textAlign:'right'}}>{level}%</div>
                </div>
              );
            })}
          </div>
          {/* Mileage */}
          <div style={{background:'rgba(251,146,60,0.04)',border:'1px solid rgba(251,146,60,0.1)',borderRadius:'14px',padding:'1.25rem'}}>
            <h3 style={{fontFamily:'Syne,sans-serif',fontSize:'1rem',fontWeight:'700',color:'#fff7ed',marginBottom:'1rem'}}>Mileage Overview</h3>
            {[...vehicles].sort((a,b)=>b.mileage-a.mileage).map(v=>{
              const maxMileage = Math.max(...vehicles.map(v=>v.mileage));
              return (
                <div key={v.id} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                  <div style={{width:'110px',fontSize:'0.75rem',color:'#fff7ed',fontWeight:'500',flexShrink:0}}>{v.name.split(' ').slice(0,2).join(' ')}</div>
                  <div style={{flex:1,height:'6px',background:'rgba(255,255,255,0.06)',borderRadius:'3px'}}>
                    <div style={{width:`${v.mileage/maxMileage*100}%`,height:'100%',background:accent,borderRadius:'3px'}}/>
                  </div>
                  <div style={{width:'60px',fontSize:'0.72rem',color:'#7c5c2e',textAlign:'right'}}>{v.mileage.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
          {/* Service schedule */}
          <div style={{background:'rgba(251,146,60,0.04)',border:'1px solid rgba(251,146,60,0.1)',borderRadius:'14px',padding:'1.25rem'}}>
            <h3 style={{fontFamily:'Syne,sans-serif',fontSize:'1rem',fontWeight:'700',color:'#fff7ed',marginBottom:'1rem'}}>Service Schedule</h3>
            {vehicles.filter(v=>v.nextService).sort((a,b)=>new Date(a.nextService)-new Date(b.nextService)).map(v=>{
              const daysLeft = Math.ceil((new Date(v.nextService)-Date.now())/86400000);
              const c = daysLeft<0?'#f87171':daysLeft<30?'#c482ff':daysLeft<90?'#facc15':'#4ade80';
              return (
                <div key={v.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <div>
                    <div style={{fontSize:'0.82rem',color:'#fff7ed',fontWeight:'500'}}>{v.name}</div>
                    <div style={{fontSize:'0.68rem',color:'#7c5c2e'}}>{v.nextService}</div>
                  </div>
                  <span style={{background:`${c}15`,color:c,padding:'3px 10px',borderRadius:'99px',fontSize:'0.7rem',fontWeight:'700'}}>
                    {daysLeft<0?'Overdue':daysLeft===0?'Today':`${daysLeft}d`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VEHICLE DETAIL MODAL */}
      {selected&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'2rem'}} onClick={()=>setSelected(null)}>
          <div style={{background:'#1a0f00',border:`1px solid ${accent}30`,borderRadius:'20px',padding:'2rem',maxWidth:'600px',width:'100%',maxHeight:'80vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'}}>
              <div>
                <h2 style={{fontFamily:'Syne,sans-serif',fontSize:'1.4rem',fontWeight:'800',color:'#fff7ed'}}>{selected.name}</h2>
                <p style={{color:'#7c5c2e',fontSize:'0.82rem',marginTop:'2px'}}>{selected.plate} · {selected.year} · {selected.color}</p>
              </div>
              <button onClick={()=>setSelected(null)} style={{background:'transparent',border:'none',color:'#7c5c2e',cursor:'pointer',fontSize:'1.5rem',lineHeight:1}}>✕</button>
            </div>

            {/* Status & Driver inline edit */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.25rem'}}>
              <div>
                <label style={{color:'#7c5c2e',fontSize:'0.72rem',display:'block',marginBottom:'5px',fontWeight:'600',letterSpacing:'0.06em'}}>STATUS</label>
                <select value={selected.status} onChange={e=>{update(selected.id,{status:e.target.value});setSelected({...selected,status:e.target.value});}}
                  style={{width:'100%',background:`${SC[selected.status]}12`,border:`1px solid ${SC[selected.status]}30`,borderRadius:'8px',padding:'8px 12px',color:SC[selected.status],fontSize:'0.88rem',fontWeight:'600',outline:'none',cursor:'pointer'}}>
                  {['AVAILABLE','IN_USE','MAINTENANCE','IDLE'].map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}
                </select>
              </div>
              <div>
                <label style={{color:'#7c5c2e',fontSize:'0.72rem',display:'block',marginBottom:'5px',fontWeight:'600',letterSpacing:'0.06em'}}>ASSIGNED DRIVER</label>
                <select value={selected.driver} onChange={e=>{update(selected.id,{driver:e.target.value});setSelected({...selected,driver:e.target.value});}}
                  style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'8px',padding:'8px 12px',color:'#fff7ed',fontSize:'0.88rem',outline:'none',cursor:'pointer'}}>
                  <option>Unassigned</option>
                  {DRIVERS_LIST.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Details grid */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'1.25rem'}}>
              {[['Type',selected.type],['Seats',selected.seats],['Mileage',`${selected.mileage.toLocaleString()} km`],[selected.isEv?'Battery':'Fuel',`${selected.isEv?selected.battery:selected.fuel}%`],['Last Service',selected.lastService],['Next Service',selected.nextService||'Not set'],['Insurance',selected.insurance||'Not set']].map(([l,v])=>(
                <div key={l} style={{background:'rgba(255,255,255,0.03)',borderRadius:'8px',padding:'10px 12px'}}>
                  <div style={{color:'#7c5c2e',fontSize:'0.68rem',marginBottom:'3px',fontWeight:'600'}}>{l.toUpperCase()}</div>
                  <div style={{color:'#fff7ed',fontSize:'0.88rem',fontWeight:'500'}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Fuel bar */}
            <div style={{marginBottom:'1.25rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.78rem',color:'#7c5c2e',marginBottom:'6px'}}>
                <span>{selected.isEv?'⚡ Battery Level':'⛽ Fuel Level'}</span>
                <span style={{color:(selected.isEv?selected.battery:selected.fuel)>30?'#4ade80':'#f87171',fontWeight:'700'}}>{selected.isEv?selected.battery:selected.fuel}%</span>
              </div>
              <div style={{height:'10px',background:'rgba(255,255,255,0.06)',borderRadius:'5px'}}>
                <div style={{width:`${selected.isEv?selected.battery:selected.fuel}%`,height:'100%',background:(selected.isEv?selected.battery:selected.fuel)>30?'#4ade80':'#f87171',borderRadius:'5px',transition:'width 0.3s'}}/>
              </div>
            </div>

            {/* Update mileage */}
            <div style={{marginBottom:'1.25rem'}}>
              <label style={{color:'#7c5c2e',fontSize:'0.72rem',display:'block',marginBottom:'5px',fontWeight:'600',letterSpacing:'0.06em'}}>UPDATE MILEAGE (KM)</label>
              <div style={{display:'flex',gap:'8px'}}>
                <input type="number" defaultValue={selected.mileage} id="mileage-input"
                  style={{flex:1,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:'8px',padding:'7px 12px',color:'#fff7ed',fontSize:'0.88rem',outline:'none'}}/>
                <button onClick={()=>{const v=+document.getElementById('mileage-input').value;update(selected.id,{mileage:v});setSelected({...selected,mileage:v});}}
                  style={{background:accent,color:'#0f0900',border:'none',padding:'7px 16px',borderRadius:'8px',cursor:'pointer',fontWeight:'700',fontSize:'0.82rem'}}>Update</button>
              </div>
            </div>

            {/* Fuel update */}
            <div style={{marginBottom:'1.5rem'}}>
              <label style={{color:'#7c5c2e',fontSize:'0.72rem',display:'block',marginBottom:'5px',fontWeight:'600',letterSpacing:'0.06em'}}>UPDATE {selected.isEv?'BATTERY':'FUEL'} (%)</label>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <input type="range" min="0" max="100" defaultValue={selected.isEv?selected.battery:selected.fuel} id="fuel-input"
                  style={{flex:1}}
                  onChange={e=>{const val=+e.target.value; const k=selected.isEv?'battery':'fuel'; update(selected.id,{[k]:val}); setSelected({...selected,[k]:val});}}/>
                <span style={{color:accent,fontWeight:'700',minWidth:'36px',textAlign:'right'}}>{selected.isEv?selected.battery:selected.fuel}%</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={()=>{update(selected.id,{status:'MAINTENANCE',nextService:new Date(Date.now()+180*86400000).toISOString().split('T')[0],lastService:new Date().toISOString().split('T')[0]});setSelected({...selected,status:'MAINTENANCE'});}}
                style={{flex:1,background:'rgba(196,130,255,0.1)',border:'1px solid rgba(196,130,255,0.25)',color:'#c482ff',padding:'8px',borderRadius:'8px',cursor:'pointer',fontSize:'0.82rem',fontWeight:'600'}}>
                🔧 Send to Maintenance
              </button>
              <button onClick={()=>{update(selected.id,{status:'AVAILABLE'});setSelected({...selected,status:'AVAILABLE'});}}
                style={{flex:1,background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.25)',color:'#4ade80',padding:'8px',borderRadius:'8px',cursor:'pointer',fontSize:'0.82rem',fontWeight:'600'}}>
                ✓ Mark Available
              </button>
              <button onClick={()=>del(selected.id)}
                style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',color:'#f87171',padding:'8px 14px',borderRadius:'8px',cursor:'pointer',fontSize:'0.82rem'}}>
                🗑
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}