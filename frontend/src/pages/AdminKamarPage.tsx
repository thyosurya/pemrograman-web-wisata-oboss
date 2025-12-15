import { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currency';

interface Room {
  id_kamar: number;
  tipe_kamar: string;
  deskripsi: string;
  harga_permalam: number;
  kapasitas: number;
  jumlah_tersedia: number;
  status_aktif: boolean;
  foto_utama: string | null;
}

export default function AdminKamarPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    tipe_kamar: '',
    deskripsi: '',
    harga_permalam: 0,
    kapasitas: 1,
    jumlah_tersedia: 0,
    status_aktif: true,
    foto_utama: '',
  });

  console.log('AdminKamarPage rendering, rooms:', rooms.length, 'loading:', loading);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching rooms...');
      const data = await api.kamarVilla.getAll();
      console.log('Rooms data:', data);
      setRooms(data);
    } catch (err) {
      setError('Gagal memuat data kamar. Silakan coba lagi.');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
      console.log('Loading finished');
    }
  };

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        ...room,
        // Ensure proper foto_utama URL for existing rooms
        foto_utama: room.foto_utama && room.foto_utama.startsWith('http') 
          ? room.foto_utama 
          : room.foto_utama ? `http://localhost:8000/${room.foto_utama}` : ''
      });
      setPhotoFile(null);
    } else {
      setEditingRoom(null);
      setFormData({
        tipe_kamar: '',
        deskripsi: '',
        harga_permalam: 0,
        kapasitas: 1,
        jumlah_tersedia: 0,
        status_aktif: true,
        foto_utama: '',
      });
      setPhotoFile(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setPhotoFile(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File terlalu besar! Maksimal 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar!');
        return;
      }
      setPhotoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, foto_utama: e.target?.result as string });
      };
      reader.readAsDataURL(file);
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
      if (file.size > 5 * 1024 * 1024) {
        alert('File terlalu besar! Maksimal 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar!');
        return;
      }
      setPhotoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, foto_utama: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    try {
      if (editingRoom) {
        // Update existing room
        const formDataToSend = new FormData();
        formDataToSend.append('tipe_kamar', formData.tipe_kamar);
        formDataToSend.append('deskripsi', formData.deskripsi);
        formDataToSend.append('harga_permalam', formData.harga_permalam.toString());
        formDataToSend.append('kapasitas', formData.kapasitas.toString());
        formDataToSend.append('jumlah_tersedia', formData.jumlah_tersedia.toString());
        formDataToSend.append('status_aktif', formData.status_aktif ? '1' : '0');
        
        // Method spoofing untuk Laravel (PUT via POST)
        formDataToSend.append('_method', 'PUT');
        
        if (photoFile) {
          // Ada file foto baru yang di-upload
          formDataToSend.append('foto_utama', photoFile);
        } else if (formData.foto_utama && 
                   !formData.foto_utama.startsWith('data:') && 
                   !formData.foto_utama.includes('localhost:8000') &&
                   !formData.foto_utama.startsWith('uploads/')) {
          // User memasukkan URL foto baru secara manual
          formDataToSend.append('foto_utama_url', formData.foto_utama);
        }
        // Jika tidak ada perubahan foto, backend akan tetap menggunakan foto lama

        const response = await fetch(`http://localhost:8000/api/kamar-villa/${editingRoom.id_kamar}`, {
          method: 'POST', // Gunakan POST dengan _method spoofing
          body: formDataToSend,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Update error:', errorData);
          throw new Error(errorData.message || 'Gagal mengupdate kamar');
        }
        const updatedRoom = await response.json();
        
        setRooms((prev) =>
          prev.map((room) =>
            room.id_kamar === editingRoom.id_kamar ? updatedRoom : room
          )
        );
        setSuccessMessage('Kamar berhasil diupdate!');
      } else {
        // Add new room
        const formDataToSend = new FormData();
        formDataToSend.append('tipe_kamar', formData.tipe_kamar);
        formDataToSend.append('deskripsi', formData.deskripsi);
        formDataToSend.append('harga_permalam', formData.harga_permalam.toString());
        formDataToSend.append('kapasitas', formData.kapasitas.toString());
        formDataToSend.append('jumlah_tersedia', formData.jumlah_tersedia.toString());
        formDataToSend.append('status_aktif', formData.status_aktif ? '1' : '0');
        
        if (photoFile) {
          formDataToSend.append('foto_utama', photoFile);
        } else if (formData.foto_utama) {
          formDataToSend.append('foto_utama_url', formData.foto_utama);
        }

        const response = await fetch('http://localhost:8000/api/kamar-villa', {
          method: 'POST',
          body: formDataToSend,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Create error:', errorData);
          throw new Error(errorData.message || 'Gagal menambahkan kamar');
        }
        const newRoom = await response.json();
        
        setRooms((prev) => [...prev, newRoom]);
        setSuccessMessage('Kamar berhasil ditambahkan!');
      }
      handleCloseModal();
      fetchRooms(); // Refresh to get updated data with proper image URLs
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal menyimpan data kamar. Silakan coba lagi.';
      setError(errorMsg);
      console.error('Error saving room:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kamar ini?')) {
      try {
        await api.kamarVilla.delete(id);
        setRooms((prev) => prev.filter((room) => room.id_kamar !== id));
      } catch (err) {
        alert('Gagal menghapus kamar. Silakan coba lagi.');
        console.error('Error deleting room:', err);
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
              Data Kamar & Villa
            </h1>
            <p className="text-gray-600">Kelola data kamar dan villa</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Tambah Kamar</span>
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg flex justify-between items-center">
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage(null)} className="text-green-500 hover:text-green-700">
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id_kamar} className="card">
                <img
                  src={room.foto_utama && room.foto_utama.startsWith('http') ? room.foto_utama : room.foto_utama ? `http://localhost:8000/${room.foto_utama}` : 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={room.tipe_kamar}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-800">
                      {room.tipe_kamar}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        room.status_aktif
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {room.status_aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {room.deskripsi}
                  </p>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Harga/malam</span>
                      <span className="font-semibold text-nature-green-600">
                        {formatCurrency(room.harga_permalam)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kapasitas</span>
                      <span className="font-semibold">{room.kapasitas} orang</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tersedia</span>
                      <span className="font-semibold">{room.jumlah_tersedia} unit</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(room)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room.id_kamar)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-600">Belum ada data kamar. Klik tombol "Tambah Kamar" untuk menambahkan.</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingRoom ? 'Edit Kamar' : 'Tambah Kamar Baru'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Room Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Tipe Kamar/Villa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tipe_kamar}
                    onChange={(e) =>
                      setFormData({ ...formData, tipe_kamar: e.target.value })
                    }
                    className="input-field"
                    placeholder="Contoh: Villa Deluxe Ocean View"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) =>
                      setFormData({ ...formData, deskripsi: e.target.value })
                    }
                    className="input-field"
                    rows={4}
                    placeholder="Deskripsi lengkap kamar/villa..."
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Harga Per Malam (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.harga_permalam}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        harga_permalam: parseInt(e.target.value) || 0,
                      })
                    }
                    className="input-field"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                {/* Capacity & Available */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Kapasitas (Orang) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.kapasitas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kapasitas: parseInt(e.target.value) || 1,
                        })
                      }
                      className="input-field"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Jumlah Tersedia <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.jumlah_tersedia}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jumlah_tersedia: parseInt(e.target.value) || 0,
                        })
                      }
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.status_aktif}
                      onChange={(e) =>
                        setFormData({ ...formData, status_aktif: e.target.checked })
                      }
                      className="w-5 h-5 text-nature-green-600 rounded"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Status Aktif
                    </span>
                  </label>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Foto Utama
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
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
                      id="photoUpload"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label htmlFor="photoUpload" className="cursor-pointer block">
                      {formData.foto_utama ? (
                        <div>
                          <img 
                            src={formData.foto_utama} 
                            alt="Preview" 
                            className="mx-auto mb-2 h-32 object-cover rounded-lg"
                          />
                          <p className="text-sm text-nature-green-600 font-semibold">
                            {photoFile ? photoFile.name : 'Foto sudah ada'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Klik untuk mengganti foto
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600 font-semibold">
                            Klik untuk upload atau drag & drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, JPEG (Max. 5MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.foto_utama}
                    onChange={(e) =>
                      setFormData({ ...formData, foto_utama: e.target.value })
                    }
                    className="input-field mt-2"
                    placeholder="Atau masukkan URL foto"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 btn-outline"
                  >
                    Batal
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    {editingRoom ? 'Simpan Perubahan' : 'Tambah Kamar'}
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
