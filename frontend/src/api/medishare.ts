import axios from 'axios';

const MEDISHARE_API = import.meta.env.VITE_MEDISHARE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: MEDISHARE_API,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medishare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const medishareService = {
  // Auth
  register: async (data: any) => api.post('/users/register', data),
  login: async (data: any) => {
    const res = await api.post('/users/login', data);
    if (res.data?.token) {
      localStorage.setItem('medishare_token', res.data.token);
      if (res.data?.user) {
        localStorage.setItem('medishare_user', JSON.stringify(res.data.user));
      }
    }
    return res;
  },
  logout: async () => {
    localStorage.removeItem('medishare_token');
    localStorage.removeItem('medishare_user');
    return api.post('/users/logout');
  },
  getProfile: async () => api.get('/users/profile'),

  // Reports (Gemini AI Analysis)
  uploadReport: async (file: File) => {
    const formData = new FormData();
    formData.append('pdfFile', file);
    return api.post('/users/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Verification (Blockchain)
  verifyBatch: async (batchNumber: string) => {
    return api.get(`/chain/api/verify/${batchNumber}`);
  },
  addMedicineBatch: async (data: any) => {
    return api.post('/chain/api/medicines/add', data);
  },
  verifyMedicineBatch: async (batchNumber: string, status: boolean) => {
    return api.patch('/chain/api/medicines/verify', { batchNumber, status });
  },
  mintNFT: async (batchNumber: string) => {
    return api.post('/chain/api/nfts/mint', { batchNumber });
  },

  // Donations
  submitDonation: async (data: any) => api.post('/users/donation/', data),
  getUserDonations: async (userId: string) => api.get(`/users/donation/user/${userId}`),
  getAllDonations: async () => api.get('/users/donation/'),
  updateDonationStatus: async (id: string, status: string, adminResponse?: string) => 
    api.patch(`/users/donation/${id}`, { status, adminResponse }),

  // Store / E-commerce
  getMedicines: async () => api.get('/ecommerce/medicine'),
  addMedicine: async (data: any) => api.post('/ecommerce/medicine', data),
  getMedicineDetails: async (id: string) => api.get(`/ecommerce/ecommerce/medicine/${id}`),

  // Manufacturer AI Audits
  validateEcoCert: async (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);
    return api.post('/manufacturer/validateEcoCertificate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  validateSourcingCert: async (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);
    return api.post('/manufacturer/validateSourcingCertificate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  validateLaborCert: async (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);
    return api.post('/manufacturer/validateLaborCertificate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

