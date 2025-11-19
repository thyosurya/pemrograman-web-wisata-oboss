import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Calendar, ChevronLeft, ChevronRight, Wifi, Coffee, Wind, Tv } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../services/api';

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

const defaultImages = [
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
];

const facilities = [
  'WiFi Gratis',
  'AC',
  'TV Cable',
  'Kamar Mandi Pribadi',
  'Balkon dengan Pemandangan',
  'Mini Bar',
  'Coffee Maker',
  'Safe Box',
];

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkin: '',
    checkout: '',
    guests: 2,
    notes: '',
  });
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.kamarVilla.getById(Number(id));
      setRoom(data);
    } catch (err) {
      setError('Gagal memuat data kamar. Silakan coba lagi.');
      console.error('Error fetching room:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingData.checkin && bookingData.checkout && room) {
      const checkin = new Date(bookingData.checkin);
      const checkout = new Date(bookingData.checkout);
      const nightCount = differenceInDays(checkout, checkin);
      setNights(nightCount > 0 ? nightCount : 0);
      setTotalPrice(nightCount > 0 ? nightCount * room.harga_permalam : 0);
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }, [bookingData.checkin, bookingData.checkout, room]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? defaultImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === defaultImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/checkout', { state: { bookingData, room, nights, totalPrice } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nature-green-600"></div>
            <p className="mt-4 text-gray-600">Memuat data kamar...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg inline-block">
              {error || 'Kamar tidak ditemukan'}
            </div>
            <div className="mt-6">
              <button onClick={() => navigate('/rooms')} className="btn-primary">
                Kembali ke Daftar Kamar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = room.foto_utama 
    ? [
        room.foto_utama.startsWith('http') ? room.foto_utama : `http://localhost:8000/${room.foto_utama}`,
        ...defaultImages.slice(1)
      ] 
    : defaultImages;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Room Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={images[currentImageIndex]}
                alt={room.tipe_kamar}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all hover:scale-110"
              >
                <ChevronLeft size={28} className="text-gray-800" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all hover:scale-110"
              >
                <ChevronRight size={28} className="text-gray-800" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-white w-8'
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div className="card p-8 mb-6">
              <h1 className="text-4xl font-bold mb-3 text-gray-800">
                {room.tipe_kamar}
              </h1>
              <div className="flex items-center space-x-6 text-gray-600 mb-6 pb-6 border-b">
                <span className="flex items-center bg-ocean-blue-50 px-4 py-2 rounded-lg">
                  <Users size={20} className="mr-2 text-ocean-blue-600" />
                  <span className="font-semibold">Kapasitas: {room.kapasitas} orang</span>
                </span>
                <span className="flex items-center bg-nature-green-50 px-4 py-2 rounded-lg">
                  <span className="font-semibold text-nature-green-700">Tersedia: {room.jumlah_tersedia} unit</span>
                </span>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Deskripsi
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {room.deskripsi}
                </p>
              </div>
            </div>

            {/* Facilities */}
            <div className="card p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Fasilitas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facilities.map((facility, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-nature-green-50 transition-colors">
                    <div className="w-2 h-2 bg-nature-green-600 rounded-full flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="card p-6 md:p-8 sticky top-24 shadow-2xl">
              <div className="mb-8 pb-6 border-b">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Harga Mulai Dari</div>
                <div className="text-4xl font-bold text-nature-green-600">
                  Rp {room.harga_permalam.toLocaleString('id-ID')}
                </div>
                <div className="text-gray-600 mt-1">per malam</div>
              </div>

              <form onSubmit={handleBooking}>
                {/* Check-in Date */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    <Calendar className="inline mr-2" size={16} />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={bookingData.checkin}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, checkin: e.target.value })
                    }
                    className="input-field"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Check-out Date */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    <Calendar className="inline mr-2" size={16} />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={bookingData.checkout}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, checkout: e.target.value })
                    }
                    className="input-field"
                    required
                    min={bookingData.checkin || new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Guest Count */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    <Users className="inline mr-2" size={16} />
                    Jumlah Tamu
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          guests: Math.max(1, bookingData.guests - 1),
                        })
                      }
                      className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg font-bold transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={bookingData.guests}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          guests: parseInt(e.target.value) || 1,
                        })
                      }
                      className="input-field text-center flex-grow"
                      min="1"
                      max={room.kapasitas}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          guests: Math.min(room.kapasitas, bookingData.guests + 1),
                        })
                      }
                      className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Maksimal {room.kapasitas} orang
                  </p>
                </div>

                {/* Special Request */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Catatan Khusus (Opsional)
                  </label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, notes: e.target.value })
                    }
                    className="input-field"
                    rows={3}
                    placeholder="Permintaan khusus Anda..."
                  />
                </div>

                {/* Price Calculation */}
                {nights > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between mb-2 text-gray-700">
                      <span>
                        Rp {room.harga_permalam.toLocaleString('id-ID')} x {nights} malam
                      </span>
                      <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-nature-green-600">
                        Rp {totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  type="submit"
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={nights <= 0 || bookingData.guests > room.kapasitas}
                >
                  {nights <= 0 ? 'Pilih Tanggal Check-in & Check-out' : 'Lanjut ke Pembayaran'}
                </button>
                
                {bookingData.guests > room.kapasitas && (
                  <p className="text-red-600 text-sm mt-2 text-center">
                    Jumlah tamu melebihi kapasitas kamar
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
