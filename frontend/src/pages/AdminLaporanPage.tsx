import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Home, 
  TrendingUp,
  Download,
  FileText,
  BarChart3,
  Moon,
  Percent
} from 'lucide-react';

interface LaporanData {
  periode: {
    start_date: string;
    end_date: string;
    jumlah_hari: number;
  };
  statistik_umum: {
    total_pemesanan: number;
    total_pendapatan: number;
    total_wisatawan: number;
    total_malam: number;
    rata_rata_pendapatan: number;
    rata_rata_tamu: number;
    rata_rata_malam: number;
    tingkat_okupansi: number;
  };
  status_pemesanan: {
    [key: string]: {
      count: number;
      total_pendapatan: number;
    };
  };
  kamar_terpopuler: Array<{
    id_kamar: number;
    tipe_kamar: string;
    total_booking: number;
    total_pendapatan: number;
    total_malam: number;
  }>;
  pendapatan_per_hari: Array<{
    tanggal: string;
    jumlah_pemesanan: number;
    total_pendapatan: number;
  }>;
  detail_pemesanan: Array<{
    id_pemesanan: number;
    booking_token: string;
    tgl_pemesanan: string;
    tgl_checkin: string;
    tgl_checkout: string;
    wisatawan: string;
    kamar: string;
    jumlah_tamu: number;
    jumlah_malam: number;
    total_harga: number;
    status_pemesanan: string;
  }>;
}

interface RingkasanData {
  hari_ini: {
    total_pemesanan: number;
    total_pendapatan: number;
  };
  bulan_ini: {
    total_pemesanan: number;
    total_pendapatan: number;
  };
  tahun_ini: {
    total_pemesanan: number;
    total_pendapatan: number;
  };
}

export default function AdminLaporanPage() {
  const [loading, setLoading] = useState(false);
  const [laporanData, setLaporanData] = useState<LaporanData | null>(null);
  const [ringkasan, setRingkasan] = useState<RingkasanData | null>(null);
  const [periode, setPeriode] = useState({
    start_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });
  const [selectedPreset, setSelectedPreset] = useState('30-hari');

  useEffect(() => {
    fetchRingkasan();
    fetchLaporan();
  }, []);

  const fetchRingkasan = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/laporan/ringkasan');
      const data = await response.json();
      setRingkasan(data);
    } catch (error) {
      console.error('Error fetching ringkasan:', error);
    }
  };

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/laporan?start_date=${periode.start_date}&end_date=${periode.end_date}`
      );
      const data = await response.json();
      setLaporanData(data);
    } catch (error) {
      console.error('Error fetching laporan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    const today = new Date();
    let startDate = new Date();

    switch (preset) {
      case 'hari-ini':
        startDate = today;
        break;
      case '7-hari':
        startDate.setDate(today.getDate() - 7);
        break;
      case '30-hari':
        startDate.setDate(today.getDate() - 30);
        break;
      case 'bulan-ini':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'tahun-ini':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        return;
    }

    setPeriode({
      start_date: startDate.toISOString().split('T')[0],
      end_date: today.toISOString().split('T')[0],
    });
  };

  const handleGenerateLaporan = () => {
    fetchLaporan();
  };

  const handleExportPDF = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Laporan</h1>
          <p className="text-gray-600">Analisis dan statistik pemesanan villa</p>
        </div>

        {/* Ringkasan Cards */}
        {ringkasan && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Calendar size={32} className="opacity-80" />
              </div>
              <p className="text-blue-100 text-sm mb-1">Hari Ini</p>
              <p className="text-3xl font-bold mb-2">{ringkasan.hari_ini.total_pemesanan} Pemesanan</p>
              <p className="text-blue-100">{formatCurrency(ringkasan.hari_ini.total_pendapatan)}</p>
            </div>

            <div className="bg-gradient-to-br from-nature-green-500 to-nature-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp size={32} className="opacity-80" />
              </div>
              <p className="text-green-100 text-sm mb-1">Bulan Ini</p>
              <p className="text-3xl font-bold mb-2">{ringkasan.bulan_ini.total_pemesanan} Pemesanan</p>
              <p className="text-green-100">{formatCurrency(ringkasan.bulan_ini.total_pendapatan)}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 size={32} className="opacity-80" />
              </div>
              <p className="text-purple-100 text-sm mb-1">Tahun Ini</p>
              <p className="text-3xl font-bold mb-2">{ringkasan.tahun_ini.total_pemesanan} Pemesanan</p>
              <p className="text-purple-100">{formatCurrency(ringkasan.tahun_ini.total_pendapatan)}</p>
            </div>
          </div>
        )}

        {/* Filter Periode */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2" size={20} />
            Filter Periode Laporan
          </h2>
          
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { label: 'Hari Ini', value: 'hari-ini' },
              { label: '7 Hari Terakhir', value: '7-hari' },
              { label: '30 Hari Terakhir', value: '30-hari' },
              { label: 'Bulan Ini', value: 'bulan-ini' },
              { label: 'Tahun Ini', value: 'tahun-ini' },
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetChange(preset.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPreset === preset.value
                    ? 'bg-nature-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={periode.start_date}
                onChange={(e) => {
                  setPeriode({ ...periode, start_date: e.target.value });
                  setSelectedPreset('custom');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={periode.end_date}
                onChange={(e) => {
                  setPeriode({ ...periode, end_date: e.target.value });
                  setSelectedPreset('custom');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleGenerateLaporan}
                disabled={loading}
                className="flex-1 bg-nature-green-600 text-white px-6 py-2 rounded-lg hover:bg-nature-green-700 transition-colors disabled:opacity-50 font-medium"
              >
                {loading ? 'Memuat...' : 'Generate Laporan'}
              </button>
              {laporanData && (
                <button
                  onClick={handleExportPDF}
                  className="bg-ocean-blue-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-blue-700 transition-colors"
                  title="Export PDF"
                >
                  <Download size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Laporan Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nature-green-600"></div>
            <p className="mt-4 text-gray-600">Memuat data laporan...</p>
          </div>
        ) : laporanData ? (
          <div className="space-y-8">
            {/* Statistik Umum */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <BarChart3 className="mr-2" size={20} />
                Statistik Umum
                <span className="ml-3 text-sm text-gray-500 font-normal">
                  ({formatDate(laporanData.periode.start_date)} - {formatDate(laporanData.periode.end_date)})
                </span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FileText size={32} className="mx-auto mb-2 text-blue-600" />
                  <p className="text-3xl font-bold text-blue-600">
                    {laporanData.statistik_umum.total_pemesanan}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Pemesanan</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign size={32} className="mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(laporanData.statistik_umum.total_pendapatan)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Pendapatan</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Users size={32} className="mx-auto mb-2 text-purple-600" />
                  <p className="text-3xl font-bold text-purple-600">
                    {laporanData.statistik_umum.total_wisatawan}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Wisatawan</p>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Moon size={32} className="mx-auto mb-2 text-orange-600" />
                  <p className="text-3xl font-bold text-orange-600">
                    {laporanData.statistik_umum.total_malam}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Malam</p>
                </div>

                <div className="text-center p-4 bg-teal-50 rounded-lg">
                  <DollarSign size={28} className="mx-auto mb-2 text-teal-600" />
                  <p className="text-xl font-bold text-teal-600">
                    {formatCurrency(laporanData.statistik_umum.rata_rata_pendapatan)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Rata-rata Pendapatan</p>
                </div>

                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <Users size={28} className="mx-auto mb-2 text-pink-600" />
                  <p className="text-xl font-bold text-pink-600">
                    {laporanData.statistik_umum.rata_rata_tamu.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Rata-rata Tamu</p>
                </div>

                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <Moon size={28} className="mx-auto mb-2 text-indigo-600" />
                  <p className="text-xl font-bold text-indigo-600">
                    {laporanData.statistik_umum.rata_rata_malam.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Rata-rata Malam</p>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Percent size={28} className="mx-auto mb-2 text-yellow-600" />
                  <p className="text-xl font-bold text-yellow-600">
                    {laporanData.statistik_umum.tingkat_okupansi.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Tingkat Okupansi</p>
                </div>
              </div>
            </div>

            {/* Status Pemesanan */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2" size={20} />
                Status Pemesanan
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(laporanData.status_pemesanan).map(([status, data]) => (
                  <div key={status} className="p-4 border rounded-lg">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusBadge(status)}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <p className="text-2xl font-bold text-gray-800">{data.count}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(data.total_pendapatan)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Kamar Terpopuler */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Home className="mr-2" size={20} />
                Kamar Terpopuler
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe Kamar</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Booking</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Malam</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {laporanData.kamar_terpopuler.map((kamar) => (
                      <tr key={kamar.id_kamar} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{kamar.tipe_kamar}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-700">{kamar.total_booking}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-700">{kamar.total_malam}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                          {formatCurrency(kamar.total_pendapatan)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail Pemesanan */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2" size={20} />
                Detail Pemesanan
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Token</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wisatawan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kamar</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tamu</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Malam</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {laporanData.detail_pemesanan.map((pemesanan) => (
                      <tr key={pemesanan.id_pemesanan} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{pemesanan.booking_token}</td>
                        <td className="px-4 py-3 text-xs">{formatDate(pemesanan.tgl_pemesanan)}</td>
                        <td className="px-4 py-3">{pemesanan.wisatawan}</td>
                        <td className="px-4 py-3">{pemesanan.kamar}</td>
                        <td className="px-4 py-3 text-center">{pemesanan.jumlah_tamu}</td>
                        <td className="px-4 py-3 text-center">{pemesanan.jumlah_malam}</td>
                        <td className="px-4 py-3 text-right font-medium text-green-600">
                          {formatCurrency(pemesanan.total_harga)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(pemesanan.status_pemesanan)}`}>
                            {pemesanan.status_pemesanan}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Pilih periode dan klik "Generate Laporan" untuk melihat data</p>
          </div>
        )}
      </main>
    </div>
  );
}
