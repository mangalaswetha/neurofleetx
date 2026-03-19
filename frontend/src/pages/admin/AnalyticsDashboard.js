import React, { useState, useEffect } from 'react';

function BarChart({ data, color, height=120 }) {
  const max = Math.max(...data.map(d=>d.value),1);
  return (
    <div style={{display:'flex',gap:'4px',alignItems:'flex-end',height:height+'px'}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
          <div style={{width:'100%',background:`${color}15`,borderRadius:'3px 3px 0 0',position:'relative',height:Math.max(4,Math.round((d.value/max)*(height-20)))+'px'}}>
            <div style={{position:'absolute',bottom:0,left:0,right:0,background:color,borderRadius:'3px 3px 0 0',height:'100%',opacity:0.85}}/>
          </div>
          <div style={{fontSize:'0.6rem',color:'#475569',textAlign:'center',lineHeight:1}}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, color, height=80 }) {
  if (data.length < 2) return null;
  const max = Math.max(...data); const min = Math.min(...data);
  const range = max-min||1;
  const w=200, h=height;
  const pts = data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/range)*(h-4)}`).join(' ');
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#grad-${color.replace('#','')})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={(data.length-1)/(data.length-1)*w} cy={h-((data[data.length-1]-min)/range)*(h-4)} r="3" fill={color}/>
    </svg>
  );
}

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('7D');
  const [time,   setTime]   = useState(new Date());

  useEffect(()=>{
    const t=setInterval(()=>setTime(new Date()),1000);
    return ()=>clearInterval(t);
  },[]);

  // Simulated analytics data
  const tripsData = {
    '7D':  [{label:'Mon',value:24},{label:'Tue',value:31},{label:'Wed',value:28},{label:'Thu',value:35},{label:'Fri',value:42},{label:'Sat',value:38},{label:'Sun',value:19}],
    '30D': Array.from({length:30},(_,i)=>({label:`${i+1}`,value:Math.round(Math.random()*30+15)})),
    '90D': Array.from({length:12},(_,i)=>({label:`W${i+1}`,value:Math.round(Math.random()*200+100)})),
  };
  const revenueData = {
    '7D':  [{label:'Mon',value:8400},{label:'Tue',value:10850},{label:'Wed',value:9800},{label:'Thu',value:12250},{label:'Fri',value:14700},{label:'Sat',value:13300},{label:'Sun',value:6650}],
    '30D': Array.from({length:30},(_,i)=>({label:`${i+1}`,value:Math.round(Math.random()*10000+5000)})),
    '90D': Array.from({length:12},(_,i)=>({label:`W${i+1}`,value:Math.round(Math.random()*70000+30000)})),
  };

  const currentTrips   = tripsData[period];
  const currentRevenue = revenueData[period];
  const totalTrips     = currentTrips.reduce((s,d)=>s+d.value,0);
  const totalRevenue   = currentRevenue.reduce((s,d)=>s+d.value,0);
  const avgTrips       = Math.round(totalTrips/currentTrips.length);

  const vehiclePerf = [
    {name:'Tesla Model 3',trips:89,revenue:31150,uptime:94,rating:4.9,isEv:true},
    {name:'BYD e6 MPV',   trips:76,revenue:28480,uptime:91,rating:4.9,isEv:true},
    {name:'Honda City',   trips:82,revenue:23780,uptime:96,rating:4.8,isEv:false},
    {name:'Toyota Camry', trips:71,revenue:22720,uptime:88,rating:4.7,isEv:false},
    {name:'Mahindra XUV', trips:58,revenue:20300,uptime:85,rating:4.6,isEv:false},
    {name:'Ford Transit', trips:34,revenue:16660,uptime:72,rating:4.5,isEv:false},
  ];

  const topRoutes = [
    {from:'Anna Nagar',to:'T. Nagar',  trips:142,revenue:49700,time:22},
    {from:'Adyar',     to:'Airport',   trips:128,revenue:89600,time:45},
    {from:'Velachery', to:'OMR',       trips:115,revenue:26450,time:18},
    {from:'Tambaram',  to:'Guindy',    trips:98, revenue:27440,time:28},
    {from:'Mylapore',  to:'Nungambakkam',trips:87,revenue:19575,time:20},
  ];

  const hourlyData = [2,1,1,0,1,3,8,15,22,18,14,12,16,14,11,13,18,22,19,15,10,8,6,4];
  const revTrend   = Array.from({length:14},(_,i)=>8000+i*800+Math.random()*2000);
  const evStats    = {trips:165,revenue:59630,co2saved:284,percent:40};

  return (
    <div style={{padding:'2rem',background:'#080f1e',minHeight:'100vh',color:'#e2e8f0',fontFamily:'DM Sans,sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'}}>
        <div>
          <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'1.9rem',fontWeight:'800',color:'#fff'}}>Urban Mobility Analytics</h1>
          <p style={{color:'#475569',fontSize:'0.82rem',marginTop:'4px'}}>Business intelligence · {time.toLocaleTimeString()}</p>
        </div>
        <div style={{display:'flex',gap:'6px'}}>
          {['7D','30D','90D'].map(p=>(
            <button key={p} onClick={()=>setPeriod(p)}
              style={{padding:'6px 14px',borderRadius:'8px',border:`1px solid ${period===p?'#38bdf8':'rgba(56,189,248,0.2)'}`,background:period===p?'rgba(56,189,248,0.15)':'transparent',color:period===p?'#38bdf8':'#64748b',cursor:'pointer',fontSize:'0.8rem',fontWeight:'600'}}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'10px',marginBottom:'1.5rem'}}>
        {[
          ['Total Trips',totalTrips,'#38bdf8',`+${avgTrips}/day avg`],
          ['Revenue',`₹${(totalRevenue/1000).toFixed(0)}K`,'#c482ff',`₹${Math.round(totalRevenue/totalTrips)} avg/trip`],
          ['Active Vehicles','5/6','#4ade80','83% fleet utilization'],
          ['EV Share',`${evStats.percent}%`,'#facc15',`${evStats.trips} EV trips`],
          ['CO₂ Saved',`${evStats.co2saved}kg`,'#4ade80','vs full ICE fleet'],
        ].map(([l,v,c,sub])=>(
          <div key={l} style={{background:`${c}08`,border:`1px solid ${c}20`,borderRadius:'12px',padding:'1.1rem'}}>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.7rem',fontWeight:'800',color:c,lineHeight:1}}>{v}</div>
            <div style={{color:'#64748b',fontSize:'0.72rem',marginTop:'4px'}}>{l}</div>
            <div style={{color:c,fontSize:'0.68rem',marginTop:'3px',opacity:0.7}}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'1.25rem'}}>
        <div style={{background:'rgba(56,189,248,0.04)',border:'1px solid rgba(56,189,248,0.1)',borderRadius:'14px',padding:'1.25rem'}}>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.82rem',fontWeight:'700',color:'#38bdf8',marginBottom:'1rem'}}>📊 Trips — {period}</div>
          <BarChart data={currentTrips} color="#38bdf8"/>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:'0.75rem',fontSize:'0.75rem',color:'#64748b'}}>
            <span>Total: {totalTrips}</span><span>Avg/day: {avgTrips}</span>
          </div>
        </div>
        <div style={{background:'rgba(196,130,255,0.04)',border:'1px solid rgba(196,130,255,0.1)',borderRadius:'14px',padding:'1.25rem'}}>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.82rem',fontWeight:'700',color:'#c482ff',marginBottom:'1rem'}}>💰 Revenue — {period}</div>
          <BarChart data={currentRevenue.map(d=>({...d,value:d.value/1000}))} color="#c482ff"/>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:'0.75rem',fontSize:'0.75rem',color:'#64748b'}}>
            <span>Total: ₹{(totalRevenue/1000).toFixed(0)}K</span><span>Avg: ₹{Math.round(totalRevenue/currentRevenue.length/1000)}K/day</span>
          </div>
        </div>
        <div style={{background:'rgba(74,222,128,0.04)',border:'1px solid rgba(74,222,128,0.1)',borderRadius:'14px',padding:'1.25rem'}}>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.82rem',fontWeight:'700',color:'#4ade80',marginBottom:'0.5rem'}}>📈 Revenue Trend (14d)</div>
          <LineChart data={revTrend} color="#4ade80" height={90}/>
          <div style={{display:'flex',gap:'12px',marginTop:'0.5rem',fontSize:'0.72rem',color:'#64748b'}}>
            <span style={{color:'#4ade80'}}>↑ +12.4% vs last period</span>
          </div>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.82rem',fontWeight:'700',color:'#facc15',marginTop:'1rem',marginBottom:'0.5rem'}}>🕐 Hourly Activity</div>
          <BarChart data={hourlyData.map((v,i)=>({label:i%4===0?`${i}h`:'',value:v}))} color="#facc15" height={50}/>
          <div style={{fontSize:'0.7rem',color:'#64748b',marginTop:'4px'}}>Peak: 8-9am & 6-7pm</div>
        </div>
      </div>

      {/* Vehicle performance + top routes */}
      <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:'12px',marginBottom:'1.25rem'}}>
        {/* Vehicle performance */}
        <div style={{background:'rgba(56,189,248,0.04)',border:'1px solid rgba(56,189,248,0.1)',borderRadius:'14px',padding:'1.25rem'}}>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.82rem',fontWeight:'700',color:'#38bdf8',marginBottom:'1rem'}}>🚗 Vehicle Performance</div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                {['Vehicle','Trips','Revenue','Uptime','Rating'].map(h=>(
                  <th key={h} style={{padding:'6px 8px',textAlign:'left',fontSize:'0.65rem',fontWeight:'700',color:'#475569',fontFamily:'Syne,sans-serif',letterSpacing:'0.06em',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehiclePerf.map((v,i)=>(
                <tr key={v.name} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <td style={{padding:'8px',fontSize:'0.8rem',color:'#e2e8f0',fontWeight:'500'}}>
                    {v.isEv?'⚡':''} {v.name.split(' ').slice(0,2).join(' ')}
                  </td>
                  <td style={{padding:'8px',fontFamily:'Syne,sans-serif',fontSize:'0.85rem',fontWeight:'700',color:'#38bdf8'}}>{v.trips}</td>
                  <td style={{padding:'8px',fontSize:'0.8rem',color:'#c482ff',fontWeight:'600'}}>₹{(v.revenue/1000).toFixed(0)}K</td>
                  <td style={{padding:'8px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                      <div style={{width:'50px',height:'4px',background:'rgba(255,255,255,0.06)',borderRadius:'2px'}}>
                        <div style={{width:`${v.uptime}%`,height:'100%',background:v.uptime>90?'#4ade80':'#facc15',borderRadius:'2px'}}/>
                      </div>
                      <span style={{fontSize:'0.7rem',color:'#64748b'}}>{v.uptime}%</span>
                    </div>
                  </td>
                  <td style={{padding:'8px',fontSize:'0.8rem',color:'#facc15',fontWeight:'600'}}>★ {v.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top routes + EV stats */}
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div style={{background:'rgba(251,146,60,0.04)',border:'1px solid rgba(251,146,60,0.1)',borderRadius:'14px',padding:'1.25rem'}}>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.82rem',fontWeight:'700',color:'#fb923c',marginBottom:'0.75rem'}}>📍 Top Routes</div>
            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              {topRoutes.map((r,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <div>
                    <div style={{fontSize:'0.8rem',color:'#e2e8f0',fontWeight:'500'}}>{r.from} → {r.to}</div>
                    <div style={{fontSize:'0.68rem',color:'#475569'}}>{r.trips} trips · ~{r.time} min</div>
                  </div>
                  <span style={{fontFamily:'Syne,sans-serif',fontSize:'0.85rem',fontWeight:'700',color:'#fb923c'}}>₹{(r.revenue/1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>

          {/* EV stats */}
          <div style={{background:'rgba(74,222,128,0.04)',border:'1px solid rgba(74,222,128,0.12)',borderRadius:'14px',padding:'1.25rem'}}>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:'0.82rem',fontWeight:'700',color:'#4ade80',marginBottom:'0.75rem'}}>⚡ EV Fleet Sustainability</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              {[['EV Trips',evStats.trips,'#facc15'],['EV Revenue',`₹${(evStats.revenue/1000).toFixed(0)}K`,'#38bdf8'],['CO₂ Saved',`${evStats.co2saved}kg`,'#4ade80'],['EV Share',`${evStats.percent}%`,'#c482ff']].map(([l,v,c])=>(
                <div key={l} style={{background:`${c}08`,borderRadius:'8px',padding:'8px 10px',textAlign:'center'}}>
                  <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.1rem',fontWeight:'800',color:c}}>{v}</div>
                  <div style={{color:'#475569',fontSize:'0.65rem',marginTop:'2px'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export row */}
      <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
        {['Export CSV','Export PDF','Share Report'].map(btn=>(
          <button key={btn} onClick={()=>alert(`${btn} — In production this downloads the report`)}
            style={{padding:'8px 18px',borderRadius:'8px',border:'1px solid rgba(56,189,248,0.2)',background:'rgba(56,189,248,0.06)',color:'#38bdf8',cursor:'pointer',fontSize:'0.82rem',fontWeight:'600',fontFamily:'Syne,sans-serif'}}>
            {btn==='Export CSV'?'📄':btn==='Export PDF'?'📋':'🔗'} {btn}
          </button>
        ))}
      </div>
    </div>
  );
}