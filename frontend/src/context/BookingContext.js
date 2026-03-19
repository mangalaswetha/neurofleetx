import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const BookingContext = createContext();

// Single persistent keys - NEVER change these
const BOOKINGS_KEY = 'NFX_BOOKINGS';
const DRIVERS_KEY  = 'NFX_DRIVERS';
const CHATS_KEY    = 'NFX_CHATS';

// Always read directly from localStorage - never stale
const readLS = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
};

const writeLS = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); }
  catch(e) { console.error('Storage error:', e); }
};

export function BookingProvider({ children }) {
  const [tick, setTick] = useState(0); // force re-render on any change
  const timerRef = useRef(null);

  // Poll every 1 second - syncs across all tabs
  useEffect(() => {
    timerRef.current = setInterval(() => setTick(t => t + 1), 1000);
    const onStorage = () => setTick(t => t + 1);
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(timerRef.current);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Force refresh helper - writes then triggers re-render
  const refresh = () => setTick(t => t + 1);

  // ── DRIVERS ──────────────────────────────────────────────────
  const setDriverOnline = useCallback((id, name, location, vehicle, phone) => {
    const list = readLS(DRIVERS_KEY);
    const idx = list.findIndex(d => d.id === String(id));
    const obj = { id:String(id), name, location, vehicle, phone:phone||'9876543210', online:true, ts:Date.now() };
    if (idx >= 0) list[idx] = obj; else list.push(obj);
    writeLS(DRIVERS_KEY, list);
    refresh();
  }, []);

  const setDriverOffline = useCallback((id) => {
    const list = readLS(DRIVERS_KEY).map(d => d.id===String(id) ? {...d,online:false} : d);
    writeLS(DRIVERS_KEY, list);
    refresh();
  }, []);

  const getOnlineDrivers = () => readLS(DRIVERS_KEY).filter(d => d.online);

  // ── BOOKINGS ─────────────────────────────────────────────────
  const _save = (list) => { writeLS(BOOKINGS_KEY, list); refresh(); };

  const createBooking = useCallback((customerId, customerName, customerPhone, vehicleId, vehicleName, pickup, dropoff, date, time) => {
    const b = {
      id: `NFX-${Date.now().toString().slice(-6)}`,
      customerId: String(customerId),
      customerName, customerPhone: customerPhone||'9999999999',
      vehicleId, vehicleName, pickup, dropoff, date, time,
      status: 'PENDING',
      driverId: null, driverName: null, driverPhone: null,
      price: Math.floor(Math.random()*300)+150,
      createdAt: new Date().toISOString(),
    };
    _save([b, ...readLS(BOOKINGS_KEY)]);
    return b;
  }, []);

  const _update = useCallback((id, changes) => {
    const list = readLS(BOOKINGS_KEY).map(b => b.id===id ? {...b,...changes} : b);
    _save(list);
  }, []);

  const acceptBooking  = useCallback((id,did,dname,dphone) => _update(id,{status:'ACCEPTED', driverId:String(did), driverName:dname, driverPhone:dphone||'9876543210', acceptedAt:new Date().toISOString()}), [_update]);
  const startTrip      = useCallback((id) => _update(id,{status:'IN_PROGRESS', startedAt:new Date().toISOString()}), [_update]);
  const completeTrip   = useCallback((id) => _update(id,{status:'COMPLETED',   completedAt:new Date().toISOString()}), [_update]);
  const cancelBooking  = useCallback((id) => _update(id,{status:'CANCELLED'}), [_update]);

  // All query functions read FRESH from localStorage every call
  const getAllBookings         = () => readLS(BOOKINGS_KEY);
  const getPendingBookings     = () => readLS(BOOKINGS_KEY).filter(b => b.status==='PENDING');
  const getLiveBookings        = () => readLS(BOOKINGS_KEY).filter(b => b.status==='ACCEPTED'||b.status==='IN_PROGRESS');
  const getBookingsForCustomer = (cid) => readLS(BOOKINGS_KEY).filter(b => b.customerId===String(cid));
  const getBookingsForDriver   = (did) => readLS(BOOKINGS_KEY).filter(b => b.driverId===String(did));

  // ── CHAT ─────────────────────────────────────────────────────
  const sendMessage = useCallback((bookingId, senderId, senderName, senderRole, text) => {
    const all = readLS(CHATS_KEY);
    const idx = all.findIndex(c => c.bookingId===bookingId);
    const msg = { id:Date.now(), senderId:String(senderId), senderName, senderRole, text, time:new Date().toISOString() };
    if (idx>=0) all[idx].messages.push(msg);
    else all.push({bookingId, messages:[msg]});
    writeLS(CHATS_KEY, all);
    refresh();
  }, []);

  const getChat = (bookingId) => {
    const all = readLS(CHATS_KEY);
    return (all.find(c=>c.bookingId===bookingId)||{messages:[]}).messages;
  };

  // Expose tick so components can depend on it for re-renders
  return (
    <BookingContext.Provider value={{
      tick, // components use this in useEffect deps to auto-refresh
      setDriverOnline, setDriverOffline, getOnlineDrivers,
      createBooking, acceptBooking, startTrip, completeTrip, cancelBooking,
      getAllBookings, getPendingBookings, getLiveBookings,
      getBookingsForCustomer, getBookingsForDriver,
      sendMessage, getChat,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);