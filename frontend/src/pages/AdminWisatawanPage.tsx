import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { api } from '../services/api';

interface Wisatawan {
  id_wisatawan: number;
  nama: string;
  email: string;
  no_telp: string;
  alamat: string;
  created_at?: string;
}

export default function AdminWisatawanPage() {
  const [wisatawan, setWisatawan] = useState<Wisatawan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWisatawan, setEditingWisatawan] = useState<Wisatawan | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_telp: '',
    alamat: '',
  });

  useEffect(() => {
    fetchWisatawan();
  }, []);

  const fetchWisatawan = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.wisatawan.getAll();
      setWisatawan(data);
    } catch (err) {
      setError('Gagal memuat data wisatawan. Silakan coba lagi.');
      console.error('Error fetching wisatawan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: Wisatawan) => {
    if (item) {
      setEditingWisatawan(item);
      setFormData({
        nama: item.nama,
        email: item.email,
        no_telp: item.no_telp,
        alamat: item.alamat,
      });
    } else {
      setEditingWisatawan(null);
      setFormData({
        nama: '',
        email: '',
        no_telp: '',
        alamat: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWisatawan(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWisatawan) {
        // Update existing wisatawan
        await api.wisatawan.update(editingWisatawan.id_wisatawan, formData);
        setWisatawan((prev) =>
          prev.map((w) =>
            w.id_wisatawan === editingWisatawan.id_wisatawan ? { ...w, ...formData } : w
          )
        );
      } else {
        // Add new wisatawan
        const newWisatawan = await api.wisatawan.create(formData);
        setWisatawan((prev) => [...prev, newWisatawan]);
      }
      handleCloseModal();
    } catch (err) {
      alert('Gagal menyimpan data wisatawan. Silakan coba lagi.');
      console.error('Error saving wisatawan:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus wisatawan ini?')) {
      try {
        await api.wisatawan.delete(id);
        setWisatawan((prev) => prev.filter((w) => w.id_wisatawan !== id));
      } catch (err) {
        alert('Gagal menghapus wisatawan. Silakan coba lagi.');
        console.error('Error deleting wisatawan:', err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-grow p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Data Wisatawan
            </h1>
            <p className="text-gray-600">Kelola data wisatawan terdaftar</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Tambah Wisatawan</span>
          </button>
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nature-green-600"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        )}

        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    No. Telepon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tanggal Daftar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {wisatawan.map((item) => (
                  <tr key={item.id_wisatawan} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{item.id_wisatawan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.no_telp}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.alamat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id_wisatawan)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {!loading && !error && wisatawan.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-600">Belum ada data wisatawan. Data akan muncul setelah ada tamu yang melakukan booking.</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingWisatawan ? 'Edit Wisatawan' : 'Tambah Wisatawan Baru'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    No. Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.no_telp}
                    onChange={(e) =>
                      setFormData({ ...formData, no_telp: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Alamat
                  </label>
                  <textarea
                    value={formData.alamat}
                    onChange={(e) =>
                      setFormData({ ...formData, alamat: e.target.value })
                    }
                    className="input-field"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 btn-outline"
                  >
                    Batal
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    {editingWisatawan ? 'Simpan Perubahan' : 'Tambah Wisatawan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
