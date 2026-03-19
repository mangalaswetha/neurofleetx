import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import './index.css';
import LiveTracking from './pages/admin/LiveTracking';
import PredictiveMaintenance from './pages/admin/PredictiveMaintenance';
import SmartRouteAI from './pages/admin/SmartRouteAI';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
// Test each import one by one
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './components/layouts/AdminLayout';
import CustomerLayout from './components/layouts/CustomerLayout';
import DriverLayout from './components/layouts/DriverLayout';
import FleetLayout from './components/layouts/FleetLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminFleet from './pages/admin/AdminFleet';
import AdminMaintenance from './pages/admin/AdminMaintenance';
import CustomerHome from './pages/customer/CustomerHome';
import CustomerBooking from './pages/customer/CustomerBooking';
import CustomerMyRides from './pages/customer/CustomerMyRides';
import DriverHome from './pages/driver/DriverHome';
import DriverTrips from './pages/driver/DriverTrips';
import DriverMap from './pages/driver/DriverMap';
import FleetHome from './pages/fleet/FleetHome';
import FleetMaintenance from './pages/fleet/FleetMaintenance';
import FleetRoutes from './pages/fleet/FleetRoutes';

// Debug: log all imports to find the broken one
console.log('Login:', typeof Login);
console.log('Register:', typeof Register);
console.log('AdminLayout:', typeof AdminLayout);
console.log('CustomerLayout:', typeof CustomerLayout);
console.log('DriverLayout:', typeof DriverLayout);
console.log('FleetLayout:', typeof FleetLayout);
console.log('AdminDashboard:', typeof AdminDashboard);
console.log('AdminBookings:', typeof AdminBookings);
console.log('AdminFleet:', typeof AdminFleet);
console.log('AdminMaintenance:', typeof AdminMaintenance);
console.log('CustomerHome:', typeof CustomerHome);
console.log('CustomerBooking:', typeof CustomerBooking);
console.log('CustomerMyRides:', typeof CustomerMyRides);
console.log('DriverHome:', typeof DriverHome);
console.log('DriverTrips:', typeof DriverTrips);
console.log('DriverMap:', typeof DriverMap);
console.log('FleetHome:', typeof FleetHome);
console.log('FleetMaintenance:', typeof FleetMaintenance);
console.log('FleetRoutes:', typeof FleetRoutes);

function Guard({ roles, children }) {
  const token = localStorage.getItem('token') || localStorage.getItem('nfx_token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/tracking"    element={<Guard roles={['ADMIN']}><AdminLayout><LiveTracking /></AdminLayout></Guard>} />
<Route path="/admin/maintenance" element={<Guard roles={['ADMIN']}><AdminLayout><PredictiveMaintenance /></AdminLayout></Guard>} />
<Route path="/admin/routes"      element={<Guard roles={['ADMIN']}><AdminLayout><SmartRouteAI /></AdminLayout></Guard>} />
<Route path="/admin/analytics"   element={<Guard roles={['ADMIN']}><AdminLayout><AnalyticsDashboard /></AdminLayout></Guard>} />
          <Route path="/admin" element={<Guard roles={['ADMIN']}><AdminLayout><AdminDashboard /></AdminLayout></Guard>} />
          <Route path="/admin/bookings" element={<Guard roles={['ADMIN']}><AdminLayout><AdminBookings /></AdminLayout></Guard>} />
          <Route path="/admin/fleet" element={<Guard roles={['ADMIN']}><AdminLayout><AdminFleet /></AdminLayout></Guard>} />
          <Route path="/admin/maintenance" element={<Guard roles={['ADMIN']}><AdminLayout><AdminMaintenance /></AdminLayout></Guard>} />
          <Route path="/customer" element={<Guard roles={['CUSTOMER']}><CustomerLayout><CustomerHome /></CustomerLayout></Guard>} />
          <Route path="/customer/book" element={<Guard roles={['CUSTOMER']}><CustomerLayout><CustomerBooking /></CustomerLayout></Guard>} />
          <Route path="/customer/rides" element={<Guard roles={['CUSTOMER']}><CustomerLayout><CustomerMyRides /></CustomerLayout></Guard>} />
          <Route path="/driver" element={<Guard roles={['DRIVER']}><DriverLayout><DriverHome /></DriverLayout></Guard>} />
          <Route path="/driver/trips" element={<Guard roles={['DRIVER']}><DriverLayout><DriverTrips /></DriverLayout></Guard>} />
          <Route path="/driver/map" element={<Guard roles={['DRIVER']}><DriverLayout><DriverMap /></DriverLayout></Guard>} />
          <Route path="/fleet" element={<Guard roles={['FLEET_MANAGER']}><FleetLayout><FleetHome /></FleetLayout></Guard>} />
          <Route path="/fleet/maintenance" element={<Guard roles={['FLEET_MANAGER']}><FleetLayout><FleetMaintenance /></FleetLayout></Guard>} />
          <Route path="/fleet/routes" element={<Guard roles={['FLEET_MANAGER']}><FleetLayout><FleetRoutes /></FleetLayout></Guard>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </BookingProvider>
  );
}
