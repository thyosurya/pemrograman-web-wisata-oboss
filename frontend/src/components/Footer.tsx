import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Wisata Oboss</h3>
            <p className="text-sm leading-relaxed">
              Nikmati pengalaman menginap yang tak terlupakan di tengah keindahan alam. 
              Villa dan kamar dengan fasilitas terbaik untuk liburan sempurna Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Link Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-nature-green-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-nature-green-400 transition-colors">
                  Kamar & Villa
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-nature-green-400 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-ocean-blue-400 transition-colors text-ocean-blue-300">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span className="text-sm">Jl. Wisata Alam No. 123, Malang, Jawa Timur</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={20} />
                <span className="text-sm">+62 812-3456-7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={20} />
                <span className="text-sm">info@wisataoboss.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Wisata Oboss. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
