import { Award, Users, Heart, MapPin } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-nature-green-600 to-ocean-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Kami</h1>
          <p className="text-xl">Menciptakan pengalaman liburan yang tak terlupakan sejak 2015</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
              alt="Resort View"
              className="rounded-2xl shadow-2xl"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Selamat Datang di Wisata Oboss
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Wisata Oboss adalah destinasi wisata premium yang terletak di jantung keindahan alam Bali. 
              Sejak didirikan pada tahun 2015, kami telah berkomitmen untuk menyediakan pengalaman 
              menginap yang luar biasa dengan menggabungkan kemewahan modern dan keramahan tradisional Bali.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Dengan lebih dari 50 kamar dan villa yang dirancang dengan sempurna, setiap ruangan 
              menawarkan pemandangan menakjubkan dan fasilitas kelas dunia. Kami percaya bahwa setiap 
              tamu adalah bagian dari keluarga kami.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Tim kami yang berdedikasi bekerja tanpa henti untuk memastikan bahwa setiap momen 
              Anda bersama kami adalah momen yang istimewa dan berkesan.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-br from-nature-green-50 to-ocean-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Nilai-Nilai Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow text-center">
              <div className="bg-nature-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-nature-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Kualitas Premium</h3>
              <p className="text-gray-600">
                Kami hanya menyediakan fasilitas dan layanan berkualitas tertinggi untuk kepuasan Anda.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow text-center">
              <div className="bg-ocean-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-ocean-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Pelayanan Ramah</h3>
              <p className="text-gray-600">
                Tim kami siap melayani dengan senyuman dan keramahan khas Bali yang hangat.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow text-center">
              <div className="bg-nature-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-nature-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Kepuasan Tamu</h3>
              <p className="text-gray-600">
                Kepuasan dan kenyamanan Anda adalah prioritas utama dalam setiap hal yang kami lakukan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow text-center">
              <div className="bg-ocean-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-ocean-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Lokasi Strategis</h3>
              <p className="text-gray-600">
                Terletak di lokasi terbaik dengan akses mudah ke berbagai destinasi wisata populer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Tim Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
                alt="Manager"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-1">I Wayan Sukarta</h3>
              <p className="text-nature-green-600 font-semibold mb-2">General Manager</p>
              <p className="text-gray-600 text-sm">
                Memimpin operasional resort dengan pengalaman 15 tahun di industri perhotelan.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
                alt="Head of Operations"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-1">Ni Luh Ayu Putri</h3>
              <p className="text-ocean-blue-600 font-semibold mb-2">Head of Operations</p>
              <p className="text-gray-600 text-sm">
                Memastikan setiap operasional berjalan lancar dengan standar kualitas tertinggi.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"
                alt="Guest Relations Manager"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-1">Made Dharma Putra</h3>
              <p className="text-nature-green-600 font-semibold mb-2">Guest Relations Manager</p>
              <p className="text-gray-600 text-sm">
                Berdedikasi untuk memberikan pengalaman terbaik bagi setiap tamu.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-nature-green-600 to-ocean-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Merasakan Pengalaman Tak Terlupakan?
          </h2>
          <p className="text-xl mb-8">
            Pesan sekarang dan nikmati diskon spesial untuk pemesanan pertama Anda
          </p>
          <a href="/rooms" className="btn-primary bg-white text-nature-green-600 hover:bg-cream-100 inline-block">
            Lihat Kamar & Villa
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
