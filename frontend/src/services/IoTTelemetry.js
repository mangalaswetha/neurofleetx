// IoT Telemetry Simulator — stores live sensor data for all vehicles
// Import this anywhere: import { useTelemetry } from '../services/IoTTelemetry';

const TELE_KEY = 'NFX_TELEMETRY';
const TRAFFIC_KEY = 'NFX_TRAFFIC';

export function initTelemetry() {
  const vehicles = [
    {id:1,name:'Tesla Model 3', lat:13.0850,lng:80.2101,speed:0,  engineTemp:35, tirePressure:32,fuel:85, battery:85, isEv:true, status:'AVAILABLE'},
    {id:2,name:'Toyota Camry',  lat:13.0418,lng:80.2341,speed:42, engineTemp:88, tirePressure:31,fuel:72, battery:0,  isEv:false,status:'IN_USE'},
    {id:3,name:'Ford Transit',  lat:13.0067,lng:80.2206,speed:0,  engineTemp:102,tirePressure:28,fuel:45, battery:0,  isEv:false,status:'MAINTENANCE'},
    {id:4,name:'Honda City',    lat:13.0368,lng:80.2676,speed:0,  engineTemp:38, tirePressure:33,fuel:91, battery:0,  isEv:false,status:'AVAILABLE'},
    {id:5,name:'BYD e6 MPV',    lat:12.9815,lng:80.2180,speed:58, engineTemp:42, tirePressure:32,fuel:100,battery:92, isEv:true, status:'IN_USE'},
    {id:6,name:'Mahindra XUV',  lat:12.9249,lng:80.1000,speed:0,  engineTemp:36, tirePressure:34,fuel:60, battery:0,  isEv:false,status:'IDLE'},
  ];
  localStorage.setItem(TELE_KEY, JSON.stringify(vehicles));
}

export function getTelemetry() {
  try { return JSON.parse(localStorage.getItem(TELE_KEY) || '[]'); }
  catch { return []; }
}

export function updateTelemetry() {
  const data = getTelemetry();
  const updated = data.map(v => {
    if (v.status === 'IN_USE') {
      // Simulate movement
      const dlat = (Math.random()-0.5)*0.002;
      const dlng = (Math.random()-0.5)*0.002;
      const newSpeed = Math.max(0, Math.min(80, v.speed + (Math.random()-0.4)*10));
      const fuelDrain = v.isEv ? 0 : 0.02;
      const batDrain  = v.isEv ? 0.03 : 0;
      return {
        ...v,
        lat: v.lat + dlat, lng: v.lng + dlng,
        speed: Math.round(newSpeed),
        engineTemp: Math.min(105, v.engineTemp + (Math.random()-0.3)*2),
        fuel: Math.max(0, v.fuel - fuelDrain),
        battery: Math.max(0, v.battery - batDrain),
        mileage: (v.mileage||0) + newSpeed/3600,
        updatedAt: Date.now(),
      };
    }
    if (v.status === 'AVAILABLE' || v.status === 'IDLE') {
      return { ...v, speed:0, engineTemp: Math.max(35, v.engineTemp - 0.5), updatedAt: Date.now() };
    }
    return v;
  });
  localStorage.setItem(TELE_KEY, JSON.stringify(updated));
  return updated;
}

// Traffic simulation for Chennai zones
export function getTrafficData() {
  const zones = [
    {id:1, name:'Anna Nagar Junction',    lat:13.0850,lng:80.2101, congestion:Math.round(Math.random()*40+30), trend:'↑'},
    {id:2, name:'T. Nagar Signal',         lat:13.0418,lng:80.2341, congestion:Math.round(Math.random()*50+40), trend:'→'},
    {id:3, name:'Adyar Bridge',            lat:13.0012,lng:80.2565, congestion:Math.round(Math.random()*30+20), trend:'↓'},
    {id:4, name:'Guindy Flyover',          lat:13.0067,lng:80.2206, congestion:Math.round(Math.random()*60+35), trend:'↑'},
    {id:5, name:'OMR Toll',                lat:12.9260,lng:80.2300, congestion:Math.round(Math.random()*40+25), trend:'→'},
    {id:6, name:'Tambaram Junction',       lat:12.9249,lng:80.1000, congestion:Math.round(Math.random()*35+15), trend:'↓'},
    {id:7, name:'Velachery Signal',        lat:12.9815,lng:80.2180, congestion:Math.round(Math.random()*55+40), trend:'↑'},
    {id:8, name:'Nungambakkam Circle',     lat:13.0569,lng:80.2425, congestion:Math.round(Math.random()*45+30), trend:'→'},
  ];
  localStorage.setItem(TRAFFIC_KEY, JSON.stringify({zones, updatedAt:Date.now()}));
  return zones;
}

export function getStoredTraffic() {
  try { return JSON.parse(localStorage.getItem(TRAFFIC_KEY)||'{}').zones || getTrafficData(); }
  catch { return getTrafficData(); }
}

// ML-based health score predictor
export function predictHealth(vehicle) {
  let score = 100;
  const issues = [];

  if ((vehicle.isEv ? vehicle.battery : vehicle.fuel) < 20) {
    score -= 25; issues.push({type: vehicle.isEv?'Low Battery':'Low Fuel', severity:'CRITICAL', value:`${Math.round(vehicle.isEv?vehicle.battery:vehicle.fuel)}%`});
  } else if ((vehicle.isEv ? vehicle.battery : vehicle.fuel) < 40) {
    score -= 10; issues.push({type: vehicle.isEv?'Battery Warning':'Fuel Warning', severity:'HIGH', value:`${Math.round(vehicle.isEv?vehicle.battery:vehicle.fuel)}%`});
  }

  if (vehicle.engineTemp > 100) {
    score -= 30; issues.push({type:'Engine Overheat', severity:'CRITICAL', value:`${vehicle.engineTemp.toFixed(1)}°C`});
  } else if (vehicle.engineTemp > 95) {
    score -= 15; issues.push({type:'High Engine Temp', severity:'HIGH', value:`${vehicle.engineTemp.toFixed(1)}°C`});
  }

  if (vehicle.tirePressure < 28) {
    score -= 20; issues.push({type:'Low Tire Pressure', severity:'HIGH', value:`${vehicle.tirePressure} PSI`});
  } else if (vehicle.tirePressure < 30) {
    score -= 8; issues.push({type:'Tire Pressure Warning', severity:'MEDIUM', value:`${vehicle.tirePressure} PSI`});
  }

  return {
    score: Math.max(0, Math.round(score)),
    status: score>=80?'HEALTHY':score>=60?'WARNING':'CRITICAL',
    issues,
  };
}

// ETA Predictor using traffic data
export function predictETA(distanceKm, trafficCongestion) {
  const baseSpeed = 40; // km/h
  const trafficFactor = 1 + (trafficCongestion / 100) * 1.5;
  const effectiveSpeed = baseSpeed / trafficFactor;
  const etaMinutes = Math.round((distanceKm / effectiveSpeed) * 60);
  return { etaMinutes, effectiveSpeed: Math.round(effectiveSpeed), trafficFactor: trafficFactor.toFixed(2) };
}