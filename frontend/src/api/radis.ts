import axios from 'axios';

const RADIS_API = import.meta.env.VITE_RADIS_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: RADIS_API,
});

export interface ScanMetadata {
  PatientID?: string;
  StudyInstanceUID?: string;
  SeriesInstanceUID?: string;
  SOPInstanceUID?: string;
  Modality?: string;
  BodyPartExamined?: string;
  SliceThickness?: number | string;
  PixelSpacing?: any;
  RescaleIntercept?: number;
  RescaleSlope?: number;
  Rows?: number;
  Columns?: number;
  [key: string]: any;
}

export interface ScanSummaryItem {
  scan_id: string;
  filename: string;
  status: string;
  uploaded_at: string;
  severity_level?: string | null;
  urgency_level?: string | null;
  metadata?: ScanMetadata;
}

export interface ScanDetail {
  scan_id: string;
  filename: string;
  file_path?: string;
  status: string;
  uploaded_at: string;
  analyzed_at?: string;
  metadata?: ScanMetadata;
  analysis?: any;
  image_data_url?: string;
}

export const radisService = {
  checkHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },
  uploadScan: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ScanDetail>('/scans/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  loadDemoScan: async () => {
    const res = await api.post<ScanDetail>('/scans/load_demo');
    return res.data;
  },
  getScans: async () => {
    const res = await api.get<ScanSummaryItem[]>('/scans');
    return res.data;
  },
  getScanDetails: async (scanId: string, preset: string = 'brain') => {
    const res = await api.get<ScanDetail>(`/scans/${scanId}?preset=${preset}`);
    return res.data;
  },
  getScanImage: async (scanId: string, preset: string = 'brain') => {
    const res = await api.get<{ scan_id: string; preset: string; image_data_url: string }>(`/scans/${scanId}/image?preset=${preset}`);
    return res.data;
  },
  analyzeScan: async (scanId: string) => {
    const res = await api.post(`/scans/${scanId}/analyze`);
    return res.data;
  },
  deleteScan: async (scanId: string) => {
    const res = await api.delete<{ status: string; scan_id: string }>(`/scans/${scanId}`);
    return res.data;
  }
};

