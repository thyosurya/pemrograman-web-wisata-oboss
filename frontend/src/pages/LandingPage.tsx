import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Wifi, Coffee, Wind, Tv } from 'lucide-react';
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

const facilities = [
  { icon: Wifi, name: 'WiFi Gratis' },
  { icon: Coffee, name: 'Restaurant' },
  { icon: Wind, name: 'AC' },
  { icon: Tv, name: 'TV Cable' },
];

export default function LandingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.kamarVilla.getAll();
      // Filter only active rooms
      const activeRooms = data.filter((room: Room) => room.status_aktif);
      setRooms(activeRooms);
    } catch (err) {
      setError('Gagal memuat data kamar. Silakan coba lagi.');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.tipe_kamar.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] bg-gradient-to-r from-nature-green-900 to-ocean-blue-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600')",
          }}
        />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in drop-shadow-lg">
            Selamat Datang di Wisata Oboss
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl drop-shadow-md">
            Nikmati pengalaman menginap yang tak terlupakan di tengah keindahan alam
          </p>
          <Link to="/rooms" className="btn-primary text-lg px-10 py-4">
            Mulai Booking Sekarang
          </Link>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="section-title">
            Kamar & Villa Pilihan
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Temukan akomodasi sempurna untuk liburan Anda
          </p>
        </div>

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
            <p className="text-gray-600">Tidak ada kamar tersedia saat ini.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredRooms.map((room) => (
            <div key={room.id_kamar} className="card group">
              <div className="relative overflow-hidden">
                <img
                  src={room.foto_utama ? (room.foto_utama.startsWith('http') ? room.foto_utama : `http://localhost:8000/${room.foto_utama}`) : 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'}
                  alt={room.tipe_kamar}
                  className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-nature-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {room.jumlah_tersedia} Tersedia
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-nature-green-600 transition-colors">
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
                  <span className="text-gray-600 text-sm flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                    <Users size={16} className="mr-1" />
                    {room.kapasitas}
                  </span>
                </div>
                <Link
                  to={`/rooms/${room.id_kamar}`}
                  className="btn-outline w-full text-center block"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/rooms" className="btn-secondary px-12">
            Lihat Semua Kamar
          </Link>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">
              Fasilitas Kami
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Nikmati berbagai fasilitas terbaik untuk kenyamanan Anda
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="bg-gradient-to-br from-nature-green-100 to-ocean-blue-100 p-5 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <facility.icon size={36} className="text-nature-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-base">{facility.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-nature-green-600 via-nature-green-500 to-ocean-blue-600 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Siap untuk Liburan Impian?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/95 max-w-2xl mx-auto">
            Booking sekarang dan dapatkan penawaran terbaik untuk pengalaman tak terlupakan!
          </p>
          <Link 
            to="/rooms" 
            className="inline-block bg-white text-nature-green-600 hover:bg-gray-100 font-bold py-4 px-12 rounded-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
          >
            Pesan Sekarang
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
