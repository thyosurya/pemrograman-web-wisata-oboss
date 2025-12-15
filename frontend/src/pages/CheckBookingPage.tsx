import { useState } from 'react';
import { Search, Calendar, Users, Home as HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currency';

interface BookingDetail {
  id_pemesanan: number;
  booking_token: string;
  status_pemesanan: string;
  tgl_checkin: string;
  tgl_checkout: string;
  jumlah_tamu: number;
  jumlah_malam: number;
  total_harga: number;
  wisatawan: {
    nama: string;
    email: string;
    no_telp: string;
  };
  kamar_villa: {
    tipe_kamar: string;
    foto_utama: string;
  };
}

export default function CheckBookingPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('Silakan masukkan token booking');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setBooking(null);
      
      const response = await fetch(`http://localhost:8000/api/pemesanan/check/${token.toUpperCase()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Booking tidak ditemukan');
      }
      
      setBooking(data);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      console.error('Error checking booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu Konfirmasi' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Dikonfirmasi' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gradient-to-br from-nature-green-50 to-ocean-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Cek Status Booking
              </h1>
              <p className="text-gray-600">
                Masukkan token booking Anda untuk melihat status pemesanan
              </p>
            </div>

            {/* Search Form */}
            <div className="card p-8 mb-8">
              <form onSubmit={handleCheck}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3 text-gray-700">
                    Token Booking
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value.toUpperCase())}
                      className="input-field pl-12 text-center text-2xl font-bold tracking-wider"
                      placeholder="Contoh: ABC12345"
                      maxLength={10}
                      required
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Token booking dikirim ke email Anda setelah pemesanan berhasil
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Mencari...' : 'Cek Status Booking'}
                </button>
              </form>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Booking Details */}
            {booking && (
              <div className="card p-8 animate-fadeIn">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status Booking</p>
                    {getStatusBadge(booking.status_pemesanan)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">ID Booking</p>
                    <p className="text-xl font-bold text-gray-800">
                      #{booking.id_pemesanan.toString().padStart(6, '0')}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  {/* Room Info */}
                  <div className="flex items-start space-x-4 mb-6">
                    <img
                      src={booking.kamar_villa.foto_utama ? (booking.kamar_villa.foto_utama.startsWith('http') ? booking.kamar_villa.foto_utama : `http://localhost:8000/${booking.kamar_villa.foto_utama}`) : 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400'}
                      alt={booking.kamar_villa.tipe_kamar}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {booking.kamar_villa.tipe_kamar}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {booking.wisatawan.nama}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-nature-green-600" size={20} />
                      <div className="flex-grow">
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(booking.tgl_checkin).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="text-ocean-blue-600" size={20} />
                      <div className="flex-grow">
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(booking.tgl_checkout).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Users className="text-purple-600" size={20} />
                      <div className="flex-grow">
                        <p className="text-sm text-gray-600">Jumlah Tamu</p>
                        <p className="font-semibold text-gray-800">
                          {booking.jumlah_tamu} orang · {booking.jumlah_malam} malam
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Total Pembayaran</span>
                      <span className="text-2xl font-bold text-nature-green-600">
                        {formatCurrency(booking.total_harga)}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-6 bg-ocean-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      Informasi Kontak
                    </p>
                    <p className="text-sm text-gray-700">
                      Email: {booking.wisatawan.email}
                    </p>
                    <p className="text-sm text-gray-700">
                      No. Telepon: {booking.wisatawan.no_telp}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/')}
                      className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      <HomeIcon size={20} />
                      <span>Kembali ke Beranda</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
