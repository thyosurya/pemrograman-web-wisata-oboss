import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-nature-green-600">
              Wisata Oboss
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-nature-green-600 transition-colors">
              Beranda
            </Link>
            <Link to="/rooms" className="text-gray-700 hover:text-nature-green-600 transition-colors">
              Kamar & Villa
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-nature-green-600 transition-colors">
              Tentang Kami
            </Link>
            <Link to="/check-booking" className="btn-outline">
              Cek Booking
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-nature-green-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              to="/rooms"
              className="block text-gray-700 hover:text-nature-green-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Kamar & Villa
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 hover:text-nature-green-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tentang Kami
            </Link>
            <Link
              to="/check-booking"
              className="block text-nature-green-600 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Cek Booking
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
