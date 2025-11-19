import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, FileText, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, bookingToken, guestName } = location.state || {};

  if (!bookingId) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-nature-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={64} className="text-nature-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Booking Berhasil!
            </h1>
            <p className="text-xl text-gray-600">
              Terima kasih, {guestName}!
            </p>
          </div>

          {/* Booking Info */}
          <div className="card p-8 mb-8">
            <div className="bg-nature-green-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">ID Booking Anda</p>
              <p className="text-3xl font-bold text-nature-green-600">
                #{bookingId.toString().padStart(6, '0')}
              </p>
            </div>

            <div className="bg-ocean-blue-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Token Booking</p>
              <p className="text-2xl font-bold text-ocean-blue-600 tracking-wider">
                {bookingToken}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Simpan token ini untuk mengecek status booking Anda
              </p>
            </div>

            <div className="text-left space-y-4">
              <div className="flex items-start space-x-3">
                <FileText className="text-nature-green-600 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-800">Status Pemesanan</p>
                  <p className="text-gray-600">
                    Booking Anda sedang diproses. Kami akan mengirimkan konfirmasi melalui email setelah pembayaran Anda diverifikasi.
                  </p>
                </div>
              </div>

              <div className="bg-ocean-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-800 mb-2">Langkah Selanjutnya:</p>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>Lakukan pembayaran sesuai dengan instruksi yang diberikan</li>
                  <li>Simpan bukti transfer Anda</li>
                  <li>Tunggu konfirmasi dari tim kami (maksimal 1x24 jam)</li>
                  <li>Anda akan menerima email konfirmasi booking</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Home size={20} />
              <span>Kembali ke Beranda</span>
            </button>
            <button
              onClick={() => navigate('/check-booking')}
              className="bg-white border-2 border-ocean-blue-600 text-ocean-blue-600 hover:bg-ocean-blue-50 px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <Search size={20} />
              <span>Cek Status Booking</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
