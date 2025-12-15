import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Building2, Upload, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { formatCurrency, formatNumber } from '../utils/currency';

type PaymentMethod = 'bank_transfer' | 'ewallet';

const paymentMethods = [
  {
    id: 'bank_transfer',
    name: 'Transfer Bank',
    icon: Building2,
    options: [
      { name: 'BCA', account: '1234567890', holder: 'PT Wisata Oboss' },
      { name: 'Mandiri', account: '0987654321', holder: 'PT Wisata Oboss' },
      { name: 'BNI', account: '5555666677', holder: 'PT Wisata Oboss' },
    ],
  },
  {
    id: 'ewallet',
    name: 'E-Wallet',
    icon: CreditCard,
    options: [
      { name: 'GoPay', account: '081234567890', holder: 'Wisata Oboss' },
      { name: 'OVO', account: '081234567890', holder: 'Wisata Oboss' },
      { name: 'DANA', account: '081234567890', holder: 'Wisata Oboss' },
    ],
  },
];

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData, room, nights, totalPrice } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [selectedOption, setSelectedOption] = useState(0);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [currentStep, setCurrentStep] = useState(1);

  // Redirect if no booking data
  if (!bookingData || !room) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Data booking tidak ditemukan</p>
            <button onClick={() => navigate('/rooms')} className="btn-primary">
              Kembali ke Daftar Kamar
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('File terlalu besar! Maksimal 2MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Format file tidak didukung! Gunakan JPG, PNG, atau JPEG');
        return;
      }
      setProofFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('File terlalu besar! Maksimal 2MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Format file tidak didukung! Gunakan JPG, PNG, atau JPEG');
        return;
      }
      setProofFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setCurrentStep(2);
      
      // 1. Simpan data wisatawan terlebih dahulu
      const wisatawanData = {
        nama: guestInfo.name,
        email: guestInfo.email,
        no_telp: guestInfo.phone,
        alamat: guestInfo.address,
      };
      
      const wisatawan = await api.wisatawan.create(wisatawanData);
      
      setCurrentStep(3);
      
      // 2. Simpan data pemesanan dengan bukti pembayaran
      const formData = new FormData();
      formData.append('id_wisatawan', wisatawan.id_wisatawan.toString());
      formData.append('id_kamar', room.id_kamar.toString());
      formData.append('tgl_checkin', bookingData.checkin);
      formData.append('tgl_checkout', bookingData.checkout);
      formData.append('jumlah_tamu', bookingData.guests.toString());
      formData.append('status_pemesanan', 'pending');
      if (bookingData.notes) {
        formData.append('catatan', bookingData.notes);
      }
      if (proofFile) {
        formData.append('bukti_pembayaran', proofFile);
      }
      
      // Send with FormData for file upload
      const response = await fetch('http://localhost:8000/api/pemesanan', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to create booking');
      const pemesanan = await response.json();
      
      setCurrentStep(4);
      
      // Navigate to success page
      setTimeout(() => {
        navigate('/booking-success', {
          state: {
            bookingId: pemesanan.id_pemesanan,
            bookingToken: pemesanan.booking_token,
            guestName: guestInfo.name,
          },
        });
      }, 1500);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Terjadi kesalahan saat memproses booking. Silakan coba lagi.');
      setCurrentStep(1);
    }
  };

  const selectedPaymentMethod = paymentMethods.find((m) => m.id === paymentMethod);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {['Booking', 'Payment', 'Verification', 'Done'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      index + 1 <= currentStep
                        ? 'bg-nature-green-600 text-white shadow-lg scale-110'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index + 1 < currentStep ? (
                      <CheckCircle size={24} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-sm mt-3 font-semibold ${
                    index + 1 <= currentStep ? 'text-nature-green-600' : 'text-gray-600'
                  }`}>{step}</span>
                </div>
                {index < 3 && (
                  <div
                    className={`w-20 md:w-32 h-1 mx-2 transition-all duration-300 ${
                      index + 1 < currentStep ? 'bg-nature-green-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 md:p-8 sticky top-24 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 pb-4 border-b">
                Ringkasan Pesanan
              </h2>

              <div className="mb-6">
                <img
                  src={room.foto_utama ? (room.foto_utama.startsWith('http') ? room.foto_utama : `http://localhost:8000/${room.foto_utama}`) : 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'}
                  alt={room.tipe_kamar}
                  className="w-full h-40 object-cover rounded-xl mb-4 shadow-md"
                />
                <h3 className="font-bold text-lg text-gray-800">{room.tipe_kamar}</h3>
              </div>

              <div className="space-y-3 mb-6 text-sm bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Check-in</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(bookingData.checkin).toLocaleDateString('id-ID', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Check-out</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(bookingData.checkout).toLocaleDateString('id-ID', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Jumlah Tamu</span>
                  <span className="font-semibold text-gray-800">{bookingData.guests} orang</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Lama Menginap</span>
                  <span className="font-semibold text-gray-800">{nights} malam</span>
                </div>
              </div>

              <div className="border-t-2 pt-6">
                <div className="flex justify-between mb-3 text-gray-700">
                  <span>
                    {formatCurrency(room.harga_permalam)} x {nights} malam
                  </span>
                  <span className="font-semibold">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl bg-nature-green-50 p-4 rounded-lg">
                  <span className="text-gray-800">Total</span>
                  <span className="text-nature-green-600">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Guest Information */}
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Informasi Tamu
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={guestInfo.name}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, name: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, email: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={guestInfo.phone}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, phone: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Alamat Lengkap
                    </label>
                    <textarea
                      value={guestInfo.address}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, address: e.target.value })
                      }
                      className="input-field"
                      rows={3}
                      placeholder="Masukkan alamat lengkap Anda..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Metode Pembayaran
                </h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id}>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => {
                            setPaymentMethod(e.target.value as PaymentMethod);
                            setSelectedOption(0);
                          }}
                          className="w-4 h-4 text-nature-green-600"
                        />
                        <method.icon size={20} className="text-gray-600" />
                        <span className="font-semibold">{method.name}</span>
                      </label>

                      {paymentMethod === method.id && (
                        <div className="ml-7 mt-3 space-y-2">
                          {method.options.map((option, index) => (
                            <label
                              key={index}
                              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="radio"
                                name="paymentOption"
                                checked={selectedOption === index}
                                onChange={() => setSelectedOption(index)}
                                className="w-4 h-4 text-nature-green-600"
                              />
                              <div>
                                <div className="font-semibold">{option.name}</div>
                                <div className="text-sm text-gray-600">
                                  {option.account} - {option.holder}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Proof */}
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Upload Bukti Transfer
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Silakan lakukan pembayaran ke rekening yang dipilih, kemudian upload
                  bukti transfer Anda.
                </p>

                {selectedPaymentMethod && (
                  <div className="bg-ocean-blue-50 p-4 rounded-lg mb-4">
                    <div className="font-semibold mb-2">Detail Pembayaran:</div>
                    <div className="text-sm space-y-1">
                      <div>
                        Bank/E-Wallet:{' '}
                        <span className="font-semibold">
                          {selectedPaymentMethod.options[selectedOption].name}
                        </span>
                      </div>
                      <div>
                        Nomor Rekening:{' '}
                        <span className="font-semibold">
                          {selectedPaymentMethod.options[selectedOption].account}
                        </span>
                      </div>
                      <div>
                        Atas Nama:{' '}
                        <span className="font-semibold">
                          {selectedPaymentMethod.options[selectedOption].holder}
                        </span>
                      </div>
                      <div className="text-nature-green-600 font-bold text-lg mt-2">
                        Total: {formatCurrency(totalPrice)}
                      </div>
                    </div>
                  </div>
                )}

                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-nature-green-500 bg-nature-green-50' 
                      : 'border-gray-300 hover:border-nature-green-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="proofFile"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="proofFile" className="cursor-pointer block">
                    <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                    {proofFile ? (
                      <div>
                        <p className="font-semibold text-nature-green-600">
                          {proofFile.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {(proofFile.size / 1024).toFixed(0)} KB - Klik untuk mengganti file
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold mb-1">
                          Klik untuk upload atau drag & drop
                        </p>
                        <p className="text-sm text-gray-500">
                          Format: JPG, PNG (Max. 2MB) - Opsional
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary w-full text-lg">
                Konfirmasi Pembayaran
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
