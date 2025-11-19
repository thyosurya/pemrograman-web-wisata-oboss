const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Wisatawan endpoints
  wisatawan: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/wisatawan`);
      return response.json();
    },
    getById: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/wisatawan/${id}`);
      return response.json();
    },
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/wisatawan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    update: async (id: number, data: any) => {
      const response = await fetch(`${API_BASE_URL}/wisatawan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/wisatawan/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },

  // Kamar Villa endpoints
  kamarVilla: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/kamar-villa`);
      return response.json();
    },
    getById: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/kamar-villa/${id}`);
      return response.json();
    },
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/kamar-villa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    update: async (id: number, data: any) => {
      const response = await fetch(`${API_BASE_URL}/kamar-villa/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/kamar-villa/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },

  // Pemesanan endpoints
  pemesanan: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/pemesanan`);
      return response.json();
    },
    getById: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/pemesanan/${id}`);
      return response.json();
    },
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/pemesanan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    update: async (id: number, data: any) => {
      const response = await fetch(`${API_BASE_URL}/pemesanan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/pemesanan/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },
};
