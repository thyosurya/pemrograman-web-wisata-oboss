import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-nature-green-600 to-ocean-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl">Kami siap membantu Anda merencanakan liburan sempurna</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Informasi Kontak</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-nature-green-100 p-3 rounded-lg">
                  <MapPin className="text-nature-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">Alamat</h3>
                  <p className="text-gray-600">
                    Jl. Pantai Indah No. 123<br />
                    Seminyak, Bali 80361<br />
                    Indonesia
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-ocean-blue-100 p-3 rounded-lg">
                  <Phone className="text-ocean-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">Telepon</h3>
                  <p className="text-gray-600">
                    +62 361 123 4567<br />
                    +62 812 3456 7890 (WhatsApp)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-nature-green-100 p-3 rounded-lg">
                  <Mail className="text-nature-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">Email</h3>
                  <p className="text-gray-600">
                    info@wisataoboss.com<br />
                    booking@wisataoboss.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-ocean-blue-100 p-3 rounded-lg">
                  <Clock className="text-ocean-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">Jam Operasional</h3>
                  <p className="text-gray-600">
                    Senin - Jumat: 08:00 - 20:00 WITA<br />
                    Sabtu - Minggu: 09:00 - 18:00 WITA<br />
                    <span className="text-nature-green-600 font-semibold">Check-in: 14:00 | Check-out: 12:00</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 p-6 bg-gradient-to-br from-nature-green-50 to-ocean-blue-50 rounded-xl">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Ikuti Kami</h3>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-3 rounded-lg hover:bg-nature-green-600 hover:text-white transition-colors shadow-md"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-3 rounded-lg hover:bg-nature-green-600 hover:text-white transition-colors shadow-md"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-3 rounded-lg hover:bg-nature-green-600 hover:text-white transition-colors shadow-md"
                >
                  <Twitter size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Kirim Pesan</h2>
            <form className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Masukkan nama Anda"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="nama@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="+62 812 xxxx xxxx"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Subjek
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Topik pesan Anda"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Pesan
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={6}
                  placeholder="Tulis pesan Anda di sini..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full">
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Lokasi Kami</h2>
          <div className="bg-gray-200 rounded-xl overflow-hidden shadow-lg h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.2076489099324!2d115.16339631478256!3d-8.693471793765852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2409b0e5e80db%3A0xe27334e8ccb9b221!2sSeminyak%2C%20Kuta%2C%20Badung%20Regency%2C%20Bali!5e0!3m2!1sen!2sid!4v1621234567890!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
