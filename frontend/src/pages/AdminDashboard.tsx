import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currency';

interface Wisatawan {
  id_wisatawan: number;
  nama: string;
  email: string;
  no_telp: string;
  alamat: string;
}

interface KamarVilla {
  id_kamar: number;
  tipe_kamar: string;
  harga_permalam: number;
}

interface Pemesanan {
  id_pemesanan: number;
  id_wisatawan: number;
  id_kamar: number;
  tgl_checkin: string;
  tgl_checkout: string;
  jumlah_tamu: number;
  jumlah_malam: number;
  harga_permalam: number;
  total_harga: number;
  status_pemesanan: string;
  wisatawan?: Wisatawan;
  kamar_villa?: KamarVilla;
}

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Pemesanan[]>([]);
  const [totalKamar, setTotalKamar] = useState(0);
  const [totalWisatawan, setTotalWisatawan] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data secara paralel
      const [pemesananData, kamarData, wisatawanData] = await Promise.all([
        api.pemesanan.getAll(),
        api.kamarVilla.getAll(),
        api.wisatawan.getAll(),
      ]);
      
      console.log('Pemesanan Data:', pemesananData);
      console.log('Sample booking total_harga:', pemesananData[0]?.total_harga, typeof pemesananData[0]?.total_harga);
      
      setBookings(pemesananData);
      setTotalKamar(kamarData.length);
      setTotalWisatawan(wisatawanData.length);
    } catch (err) {
      setError('Gagal memuat data. Silakan coba lagi.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await api.pemesanan.getAll();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleStatusChange = async (id: number, newStatus: BookingStatus) => {
    try {
      await api.pemesanan.update(id, { status_pemesanan: newStatus });
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id_pemesanan === id ? { ...booking, status_pemesanan: newStatus } : booking
        )
      );
    } catch (err) {
      alert('Gagal mengubah status pemesanan');
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus booking ini?')) {
      try {
        await api.pemesanan.delete(id);
        setBookings((prev) => prev.filter((booking) => booking.id_pemesanan !== id));
      } catch (err) {
        alert('Gagal menghapus pemesanan');
        console.error('Error deleting booking:', err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter((b) => b.status_pemesanan === 'pending').length,
    confirmed: bookings.filter((b) => b.status_pemesanan === 'confirmed').length,
    completed: bookings.filter((b) => b.status_pemesanan === 'completed').length,
    totalRevenue: bookings
      .filter((b) => b.status_pemesanan === 'completed')
      .reduce((sum, b) => sum + (Number(b.total_harga) || 0), 0),
    totalKamar: totalKamar,
    totalWisatawan: totalWisatawan,
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-grow p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Selamat datang di Admin Panel Wisata Oboss</p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nature-green-600"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        )}

        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-gray-600 text-sm mb-2">Total Booking</div>
                <div className="text-3xl font-bold text-gray-800">
                  {stats.totalBookings}
                </div>
              </div>
              <div className="bg-yellow-50 rounded-xl shadow-md p-6 border-2 border-yellow-200">
                <div className="text-yellow-700 text-sm mb-2">Pending</div>
                <div className="text-3xl font-bold text-yellow-800">
                  {stats.pending}
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl shadow-md p-6 border-2 border-blue-200">
                <div className="text-blue-700 text-sm mb-2">Confirmed</div>
                <div className="text-3xl font-bold text-blue-800">
                  {stats.confirmed}
                </div>
              </div>
              <div className="bg-green-50 rounded-xl shadow-md p-6 border-2 border-green-200">
                <div className="text-green-700 text-sm mb-2">Completed</div>
                <div className="text-3xl font-bold text-green-800">
                  {stats.completed}
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-nature-green-500 to-nature-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="text-nature-green-100 text-sm mb-2">Total Revenue</div>
                <div className="text-3xl font-bold">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <div className="text-nature-green-100 text-xs mt-2">Dari booking completed</div>
              </div>
              <div className="bg-gradient-to-br from-ocean-blue-500 to-ocean-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="text-ocean-blue-100 text-sm mb-2">Total Kamar</div>
                <div className="text-3xl font-bold">
                  {stats.totalKamar}
                </div>
                <div className="text-ocean-blue-100 text-xs mt-2">Kamar tersedia</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="text-purple-100 text-sm mb-2">Total Wisatawan</div>
                <div className="text-3xl font-bold">
                  {stats.totalWisatawan}
                </div>
                <div className="text-purple-100 text-xs mt-2">Tamu terdaftar</div>
              </div>
            </div>

            {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Data Pemesanan</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama Tamu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Kamar/Villa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Harga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id_pemesanan} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking.id_pemesanan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.wisatawan?.nama || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.kamar_villa?.tipe_kamar || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(booking.tgl_checkin).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(booking.total_harga)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={booking.status_pemesanan}
                        onChange={(e) =>
                          handleStatusChange(
                            booking.id_pemesanan,
                            e.target.value as BookingStatus
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          booking.status_pemesanan
                        )} border-none outline-none cursor-pointer`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id_pemesanan)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
