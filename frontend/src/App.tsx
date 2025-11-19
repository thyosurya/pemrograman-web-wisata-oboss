import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RoomsListPage from './pages/RoomsListPage';
import RoomDetailPage from './pages/RoomDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import CheckBookingPage from './pages/CheckBookingPage';
import AboutPage from './pages/AboutPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminKamarPage from './pages/AdminKamarPage';
import AdminWisatawanPage from './pages/AdminWisatawanPage';
import AdminPembayaranPage from './pages/AdminPembayaranPage';
import AdminLaporanPage from './pages/AdminLaporanPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/rooms" element={<RoomsListPage />} />
        <Route path="/rooms/:id" element={<RoomDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/booking-success" element={<BookingSuccessPage />} />
        <Route path="/check-booking" element={<CheckBookingPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/pemesanan" element={<AdminDashboard />} />
        <Route path="/admin/kamar" element={<AdminKamarPage />} />
        <Route path="/admin/wisatawan" element={<AdminWisatawanPage />} />
        <Route path="/admin/pembayaran" element={<AdminPembayaranPage />} />
        <Route path="/admin/laporan" element={<AdminLaporanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
