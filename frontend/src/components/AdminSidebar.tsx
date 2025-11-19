import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  CreditCard,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminSidebar() {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>(['master', 'transaksi']);

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="bg-gray-900 text-gray-300 w-64 min-h-screen p-4">
      {/* Logo */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        <p className="text-sm text-gray-400">Wisata Oboss</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {/* Dashboard */}
        <Link
          to="/admin"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin')
              ? 'bg-nature-green-600 text-white'
              : 'hover:bg-gray-800'
          }`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        {/* Master Data */}
        <div>
          <button
            onClick={() => toggleMenu('master')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FileText size={20} />
              <span>Master Data</span>
            </div>
            {openMenus.includes('master') ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
          {openMenus.includes('master') && (
            <div className="ml-4 mt-2 space-y-1">
              <Link
                to="/admin/wisatawan"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin/wisatawan')
                    ? 'bg-nature-green-600 text-white'
                    : 'hover:bg-gray-800'
                }`}
              >
                <Users size={18} />
                <span>Data Wisatawan</span>
              </Link>
              <Link
                to="/admin/kamar"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin/kamar')
                    ? 'bg-nature-green-600 text-white'
                    : 'hover:bg-gray-800'
                }`}
              >
                <Home size={18} />
                <span>Data Kamar & Villa</span>
              </Link>
            </div>
          )}
        </div>

        {/* Transaksi */}
        <div>
          <button
            onClick={() => toggleMenu('transaksi')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <CreditCard size={20} />
              <span>Transaksi</span>
            </div>
            {openMenus.includes('transaksi') ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
          {openMenus.includes('transaksi') && (
            <div className="ml-4 mt-2 space-y-1">
              <Link
                to="/admin/pemesanan"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin/pemesanan')
                    ? 'bg-nature-green-600 text-white'
                    : 'hover:bg-gray-800'
                }`}
              >
                <FileText size={18} />
                <span>Pemesanan</span>
              </Link>
              <Link
                to="/admin/pembayaran"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin/pembayaran')
                    ? 'bg-nature-green-600 text-white'
                    : 'hover:bg-gray-800'
                }`}
              >
                <CreditCard size={18} />
                <span>Pembayaran</span>
              </Link>
            </div>
          )}
        </div>

        {/* Laporan */}
        <Link
          to="/admin/laporan"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/laporan')
              ? 'bg-nature-green-600 text-white'
              : 'hover:bg-gray-800'
          }`}
        >
          <FileText size={20} />
          <span>Laporan</span>
        </Link>
      </nav>
    </aside>
  );
}
