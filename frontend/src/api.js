// frontend/src/api.js

import { getFallbackAccidentGeojson } from './fallbackData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_V1 = `${API_BASE_URL}/api/v1`;

// Fungsi dasar pembaca Fetch API ke backend FastAPI
async function request(path, options = {}) {
  const response = await fetch(`${API_V1}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  // Karena response format teks/JSON, kita buat parser yang aman
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return data;
}

function parseJsonMaybe(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// 1. Normalisasi Titik Koordinat Spasial Lampung Selatan
function normalizePointCoordinates(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

  let lng = Number(coordinates[0]);
  let lat = Number(coordinates[1]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  // Jika nilai longitude berada di rentang negatif (berarti tertukar dengan latitude Lampung -5 s.d -6)
  // dan nilai latitude berada di rentang 105 (tertukar dengan bujur Lampung 105 s.d 106)
  if (lng >= -10 && lng <= 0 && lat >= 90 && lat <= 140) {
    const temp = lng;
    lng = lat;
    lat = temp;
  }

  return [lng, lat];
}

function extractGeometry(item = {}) {
  const directGeometry = item.geometry || item.geom || item.geom_geojson || item.geojson || item.lokasi_geojson;
  const parsed = parseJsonMaybe(directGeometry);

  if (parsed?.type === 'Feature') return parsed.geometry || null;
  if (parsed?.type === 'Point') {
    const coordinates = normalizePointCoordinates(parsed.coordinates);
    return coordinates ? { type: 'Point', coordinates } : null;
  }

  if (typeof directGeometry === 'object' && directGeometry?.type === 'Point') {
    const coordinates = normalizePointCoordinates(directGeometry.coordinates);
    return coordinates ? { type: 'Point', coordinates } : null;
  }

  const longitude = Number(
    item.longitude ??
    item.lon ??
    item.lng ??
    item.x ??
    item.bujur ??
    item.long ??
    item.st_x
  );
  const latitude = Number(
    item.latitude ??
    item.lat ??
    item.y ??
    item.lintang ??
    item.st_y
  );

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const coordinates = normalizePointCoordinates([longitude, latitude]);
  return coordinates ? { type: 'Point', coordinates } : null;
}

// 2. Normalisasi per single objek Feature GeoJSON (Memetakan data agar tidak bernilai 0)
function normalizeFeature(f, extra = {}) {
  if (!f || typeof f !== 'object') return null;

  const geom = f.geometry || {};
  let coords = geom.coordinates;

  if (!coords && f.geom) {
    coords = typeof f.geom === 'string' ? null : f.geom?.coordinates;
  }

  const finalCoords = normalizePointCoordinates(coords);
  if (!finalCoords) return null;

  const props = f.properties || f;
  
  // Deteksi jumlah kendaraan dari berbagai variasi penamaan key database/mock
  const cleanJumlahKendaraan = props.jumlah_kendaraan ?? props.jumlahKendaraan ?? props.jumlah ?? 0;

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: finalCoords
    },
    properties: {
      ...props,
      id: props.id,
      tanggal_kejadian: props.tanggal_kejadian || props.tanggal,
      lokasi_nama: props.lokasi_nama || props.lokasi,
      nama_jalan: props.nama_jalan || props.jalan,
      kecamatan_id: props.kecamatan_id || extra.kecamatan_id,
      kecamatan_nama: props.kecamatan_nama || props.kecamatan_name || extra.kecamatan_nama || '-',
      kondisi_jalan: props.kondisi_jalan || '-',
      cuaca: props.cuaca || '-',
      jenis_kendaraan: props.jenis_kendaraan || '-',
      
      // SINKRONISASI VARIABLE AGAR PANEL TIDAK 0
      jumlah_kendaraan: Number(cleanJumlahKendaraan),
      jumlahKendaraan: Number(cleanJumlahKendaraan),
      
      penyebab: props.penyebab || '-',
      korban: props.korban || [],
      sumber_data: props.sumber_data || extra.sumber_data || 'geojson-api'
    }
  };
}

function rowToAccidentFeature(item = {}, extra = {}) {
  const geometry = extractGeometry(item);
  const coordinates = normalizePointCoordinates(geometry?.coordinates);

  if (!coordinates) return null;

  const cleanJumlahKendaraan = item.jumlah_kendaraan ?? item.jumlahKendaraan ?? item.jumlah ?? 0;

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates
    },
    properties: {
      id: item.id ?? `${coordinates[1]}-${coordinates[0]}`,
      lokasi_nama: item.lokasi_nama || item.lokasi || item.nama_lokasi || 'Lokasi kecelakaan',
      nama_jalan: item.nama_jalan || item.jalan || '-',
      tanggal_kejadian: item.tanggal_kejadian || item.tanggal || item.created_at || null,
      kecamatan_id: item.kecamatan_id ?? extra.kecamatan_id ?? null,
      kecamatan_nama: item.kecamatan_nama || item.nama_kecamatan || extra.kecamatan_nama || '-',
      kondisi_jalan: item.kondisi_jalan || '-',
      cuaca: item.cuaca || '-',
      jenis_kendaraan: item.jenis_kendaraan || '-',
      
      // SINKRONISASI PADA BARIS ROW DATABASE MENTAH
      jumlah_kendaraan: Number(cleanJumlahKendaraan),
      jumlahKendaraan: Number(cleanJumlahKendaraan),
      
      kecepatan_perkiraan: item.kecepatan_perkiraan ?? null,
      penyebab: item.penyebab || '',
      keterangan: item.keterangan || '',
      korban: item.korban || item.korban_kecelakaan || [],
      total_korban: item.total_korban ?? item.jumlah_korban ?? null,
      sumber_data: extra.sumber_data || item.sumber_data || 'api'
    }
  };
}

// 3. Mengubah baris tabel mentah (Array Rows) menjadi format koleksi Feature GeoJSON
function accidentRowsToGeojson(rows, extra = {}) {
  const cleanRows = Array.isArray(rows) ? rows : [];
  return {
    type: 'FeatureCollection',
    features: cleanRows.map((row) => normalizeFeature(row, extra)).filter(Boolean)
  };
}

// 4. Router penentu tipe data GeoJSON 
export function normalizeAccidentGeojson(data, extra = {}) {
  if (!data) return { type: 'FeatureCollection', features: [] };

  if (data.type === 'FeatureCollection') {
    return {
      type: 'FeatureCollection',
      features: (data.features || [])
        .map((feature) => normalizeFeature(feature, extra))
        .filter(Boolean)
    };
  }

  if (data.type === 'Feature') {
    const feature = normalizeFeature(data, extra);
    return { type: 'FeatureCollection', features: feature ? [feature] : [] };
  }

  if (Array.isArray(data)) return accidentRowsToGeojson(data, extra);

  const rows =
    data.kecelakaan ||
    data.data ||
    data.results ||
    data.items ||
    data.titik_kecelakaan ||
    data.features ||
    [];

  const kecamatan = data.kecamatan || data.wilayah || {};

  return accidentRowsToGeojson(rows, {
    ...extra,
    kecamatan_id: extra.kecamatan_id ?? kecamatan.id ?? data.kecamatan_id,
    kecamatan_nama: extra.kecamatan_nama || kecamatan.nama || data.kecamatan_nama || data.nama_kecamatan,
    sumber_data: extra.sumber_data || 'spasial-dalam-kecamatan'
  });
}

function blackSpotRowsToGeojson(results) {
  const byId = new Map();

  for (const result of results) {
    const rows = result?.kecelakaan || result?.data || [];
    for (const item of rows) {
      const feature = rowToAccidentFeature(item, { sumber_data: 'fallback-black-spot' });
      if (!feature || byId.has(feature.properties.id)) continue;
      byId.set(feature.properties.id, feature);
    }
  }

  return {
    type: 'FeatureCollection',
    features: Array.from(byId.values())
  };
}

// 5. Ekspor Utama Handler Komunikasi API (TERPADU & ANTI-DUPLIKAT)
export const api = {
  baseUrl: API_BASE_URL,

  getHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Backend belum aktif atau health check gagal.');
    return response.json();
  },

  getRingkasan: (tahun) => request(`/statistik/ringkasan${tahun ? `?tahun=${tahun}` : ''}`),

  getStatistikKecamatan: (tahun) => request(`/statistik/per-kecamatan${tahun ? `?tahun=${tahun}` : ''}`),

  getTrenBulanan: (tahun) => request(`/statistik/tren-bulanan?tahun=${tahun}`),

  getKecamatan: () => request('/kecamatan/'),

  getKecamatanGeojson: () => request('/kecamatan/geojson'),

  getKecelakaanGeojson: async ({ tahun, kecamatanId, kecamatanNama } = {}) => {
    try {
      const params = new URLSearchParams();
      if (tahun) params.set('tahun', tahun);
      if (kecamatanId) params.set('kecamatan_id', kecamatanId);
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const data = await request(`/kecelakaan/geojson${suffix}`);
      return normalizeAccidentGeojson(data, { kecamatan_id: kecamatanId, kecamatan_nama: kecamatanNama });
    } catch (error) {
      console.warn("⚠️ Database Server Offline. Aplikasi beralih menggunakan Mode Fallback Google Maps.");
      return getFallbackAccidentGeojson({ tahun, kecamatanId });
    }
  },

  getKecelakaanDalamKecamatan: async (kecamatanId, kecamatanNama) => {
    try {
      const data = await request(`/kecelakaan/spasial/dalam-kecamatan/${kecamatanId}`);
      return normalizeAccidentGeojson(data, {
        kecamatan_id: kecamatanId,
        kecamatan_nama: kecamatanNama,
        sumber_data: 'spasial-dalam-kecamatan'
      });
    } catch (error) {
      return getFallbackAccidentGeojson({ kecamatanId });
    }
  },

  getKecamatanStatistik: async ({ tahun } = {}) => {
    try {
      const params = new URLSearchParams();
      if (tahun) params.set('tahun', tahun);
      const suffix = params.toString() ? `?${params.toString()}` : '';
      return await request(`/statistik/kecamatan${suffix}`);
    } catch (error) {
      console.error("Gagal memuat statistik kecamatan riil:", error);
      return [];
    }
  },

  getKecelakaanFallbackFromBlackSpot: async () => {
    const centers = [
      { latitude: -5.75, longitude: 105.50 },
      { latitude: -5.90, longitude: 105.20 },
      { latitude: -5.75, longitude: 105.85 },
      { latitude: -5.60, longitude: 105.20 },
      { latitude: -5.90, longitude: 105.70 }
    ];

    const settled = await Promise.allSettled(
      centers.map((center) => api.getBlackSpot({
        latitude: center.latitude,
        longitude: center.longitude,
        radiusMeter: 50000
      }))
    );

    const successful = settled
      .filter((item) => item.status === 'fulfilled')
      .map((item) => item.value);

    if (successful.length === 0) {
      throw new Error('Endpoint kecelakaan belum dapat dimuat. Periksa endpoint GeoJSON atau black-spot pada backend.');
    }

    return blackSpotRowsToGeojson(successful);
  },

  getAllKecelakaan: () => request('/kecelakaan/'),

  getBlackSpotList: (radius = 1000) => request(`/kecelakaan/spasial/black-spot?radius_meter=${radius}`),

  getBlackSpot: ({ latitude, longitude, radiusMeter }) => {
    const params = new URLSearchParams({
      latitude,
      longitude,
      radius_meter: radiusMeter || 1000
    });
    return request(`/kecelakaan/spasial/black-spot?${params.toString()}`);
  },

  createKecelakaan: (payload) => request('/kecelakaan/', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  updateKecelakaan: (id, payload) => request(`/kecelakaan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),

  deleteKecelakaan: (id) => request(`/kecelakaan/${id}`, {
    method: 'DELETE'
  })
};