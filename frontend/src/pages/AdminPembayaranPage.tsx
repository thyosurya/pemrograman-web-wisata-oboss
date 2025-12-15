import { useState, useEffect } from 'react';
import { Search, DollarSign, CheckCircle, XCircle, Clock, Eye, Image, Edit2 } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currency';

interface Wisatawan {
  id_wisatawan: number;
  nama: string;
  email: string;
  no_telp: string;
}

interface KamarVilla {
  id_kamar: number;
  tipe_kamar: string;
}

interface Pemesanan {
  id_pemesanan: number;
  booking_token: string;
  bukti_pembayaran?: string;
  tgl_pemesanan: string;
  tgl_checkin: string;
  tgl_checkout: string;
  jumlah_malam: number;
  total_harga: number;
  status_pemesanan: string;
  wisatawan?: Wisatawan;
  kamar_villa?: KamarVilla;
}

type PaymentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export default function AdminPembayaranPage() {
  const [bookings, setBookings] = useState<Pemesanan[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Pemesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<{ id: number; status: string } | null>(null);

  // Statistics
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    confirmedPayments: 0,
    completedPayments: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterAndSearchBookings();
  }, [searchTerm, filterStatus, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/api/pemesanan');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
      calculateStats(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Pemesanan[]) => {
    const stats = {
      totalRevenue: data
        .filter((b) => b.status_pemesanan === 'completed')
        .reduce((sum, b) => sum + (Number(b.total_harga) || 0), 0),
      pendingPayments: data.filter((b) => b.status_pemesanan === 'pending').length,
      confirmedPayments: data.filter((b) => b.status_pemesanan === 'confirmed').length,
      completedPayments: data.filter((b) => b.status_pemesanan === 'completed').length,
    };
    setStats(stats);
  };

  const filterAndSearchBookings = () => {
    let filtered = [...bookings];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((b) => b.status_pemesanan === filterStatus);
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.booking_token?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.wisatawan?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.wisatawan?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => 
      new Date(b.tgl_pemesanan).getTime() - new Date(a.tgl_pemesanan).getTime()
    );

    setFilteredBookings(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string; icon: any }> = {
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Pending', 
        icon: Clock 
      },
      confirmed: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        label: 'Confirmed', 
        icon: CheckCircle 
      },
      completed: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Completed', 
        icon: CheckCircle 
      },
      cancelled: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        label: 'Cancelled', 
        icon: XCircle 
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon size={14} />
        <span>{config.label}</span>
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi "${newStatus}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/pemesanan/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status_pemesanan: newStatus,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update status');
      }

      // Refresh data
      await fetchBookings();
      setEditingStatus(null);
      alert('Status berhasil diubah! Ketersediaan kamar telah diperbarui.');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-grow p-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nature-green-600"></div>
            <p className="mt-4 text-gray-600">Loading data pembayaran...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-grow p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-grow p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Manajemen Pembayaran
          </h1>
          <p className="text-gray-600">
            Kelola dan monitor pembayaran pemesanan villa
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pendapatan</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmedPayments}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedPayments}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari token, nama, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-green-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-green-500"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Wisatawan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Kamar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Malam
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Bukti
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data pembayaran ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id_pemesanan} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono font-semibold text-ocean-blue-600">
                          {booking.booking_token}
                        </div>
                        <div className="text-xs text-gray-500">
                          #{booking.id_pemesanan.toString().padStart(6, '0')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-800">
                          {booking.wisatawan?.nama || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.wisatawan?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {booking.kamar_villa?.tipe_kamar || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {formatDate(booking.tgl_checkin)}
                        </div>
                        <div className="text-xs text-gray-500">
                          s/d {formatDate(booking.tgl_checkout)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {booking.jumlah_malam} malam
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-nature-green-600">
                          {formatCurrency(Number(booking.total_harga))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.bukti_pembayaran ? (
                          <button
                            onClick={() => setPreviewImage(`http://localhost:8000/${booking.bukti_pembayaran}`)}
                            className="flex items-center space-x-1 text-ocean-blue-600 hover:text-ocean-blue-800 transition-colors"
                          >
                            <Image size={16} />
                            <span className="text-xs">Lihat</span>
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Belum upload</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status_pemesanan)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingStatus?.id === booking.id_pemesanan ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={editingStatus.status}
                              onChange={(e) => setEditingStatus({ id: booking.id_pemesanan, status: e.target.value })}
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-nature-green-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => handleStatusChange(booking.id_pemesanan, editingStatus.status)}
                              className="px-3 py-1 bg-nature-green-600 text-white text-xs rounded hover:bg-nature-green-700 transition-colors"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={() => setEditingStatus(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingStatus({ id: booking.id_pemesanan, status: booking.status_pemesanan })}
                            className="flex items-center space-x-1 text-ocean-blue-600 hover:text-ocean-blue-800 transition-colors"
                          >
                            <Edit2 size={16} />
                            <span className="text-xs">Ubah Status</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {filteredBookings.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Menampilkan {filteredBookings.length} dari {bookings.length} transaksi
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  Total: {formatCurrency(
                    filteredBookings.reduce((sum, b) => sum + Number(b.total_harga), 0)
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <XCircle size={32} />
            </button>
            <img
              src={previewImage}
              alt="Bukti Pembayaran"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
