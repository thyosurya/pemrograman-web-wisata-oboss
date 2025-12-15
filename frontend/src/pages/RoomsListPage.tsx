import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { formatCurrencyShort } from '../utils/currency';

interface Room {
  id_kamar: number;
  tipe_kamar: string;
  deskripsi: string;
  harga_permalam: number;
  kapasitas: number;
  jumlah_tersedia: number;
  status_aktif: boolean;
  foto_utama: string;
}

export default function RoomsListPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCapacity, setFilterCapacity] = useState<string>('all');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.kamarVilla.getAll();
      const activeRooms = data.filter((room: Room) => room.status_aktif);
      setRooms(activeRooms);
    } catch (err) {
      setError('Gagal memuat data kamar. Silakan coba lagi.');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.tipe_kamar.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCapacity = filterCapacity === 'all' || 
                           (filterCapacity === '2' && room.kapasitas <= 2) ||
                           (filterCapacity === '4' && room.kapasitas > 2 && room.kapasitas <= 4) ||
                           (filterCapacity === '6+' && room.kapasitas > 4);
    return matchesSearch && matchesCapacity;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-nature-green-600 to-ocean-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kamar & Villa</h1>
          <p className="text-xl mb-8">Temukan akomodasi sempurna untuk liburan Anda</p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white shadow-md py-6 sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari kamar atau villa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-green-500 focus:border-transparent"
              />
            </div>
            <div className="w-full md:w-auto">
              <select
                value={filterCapacity}
                onChange={(e) => setFilterCapacity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-green-500 focus:border-transparent"
              >
                <option value="all">Semua Kapasitas</option>
                <option value="2">1-2 Orang</option>
                <option value="4">3-4 Orang</option>
                <option value="6+">5+ Orang</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="container mx-auto px-4 py-12 flex-grow">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nature-green-600"></div>
            <p className="mt-4 text-gray-600">Memuat data kamar...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg inline-block">
              {error}
            </div>
          </div>
        )}

        {!loading && !error && filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Tidak ada kamar yang sesuai dengan kriteria pencarian.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div key={room.id_kamar} className="card group">
              <div className="relative overflow-hidden">
                <img
                  src={room.foto_utama ? (room.foto_utama.startsWith('http') ? room.foto_utama : `http://localhost:8000/${room.foto_utama}`) : 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'}
                  alt={room.tipe_kamar}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-nature-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {room.jumlah_tersedia} Tersedia
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-nature-green-600 transition-colors">
                  {room.tipe_kamar}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.deskripsi}</p>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Mulai dari</div>
                    <span className="text-nature-green-600 font-bold text-2xl">
                      {formatCurrencyShort(room.harga_permalam)}
                    </span>
                    <span className="text-gray-500 text-sm">/malam</span>
                  </div>
                  <span className="text-gray-600 text-sm flex items-center bg-gray-100 px-3 py-2 rounded-lg">
                    <Users size={16} className="mr-1" />
                    {room.kapasitas}
                  </span>
                </div>
                <Link
                  to={`/rooms/${room.id_kamar}`}
                  className="btn-primary w-full text-center block"
                >
                  Lihat Detail & Pesan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
