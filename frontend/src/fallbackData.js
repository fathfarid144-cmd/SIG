// frontend/src/fallbackData.js

export const kecamatanNames = {
  1: 'Natar',
  2: 'Jati Agung',
  3: 'Tanjung Bintang',
  4: 'Tanjung Sari',
  5: 'Katibung',
  6: 'Merbau Mataram',
  7: 'Way Sulan',
  8: 'Sidomulyo',
  9: 'Candipuro',
  10: 'Way Panji',
  11: 'Kalianda',
  12: 'Rajabasa',
  13: 'Palas',
  14: 'Sragi',
  15: 'Penengahan',
  16: 'Ketapang',
  17: 'Bakauheni'
};

// Data Koordinat Detail Sesuai Google Maps Koridor Utama Lampung Selatan
const seedAccidents2023 = [
  // ── NATAR (Jalan Lintas Sumatera - Detail Akurat) ──
  [1, '2023-01-15T07:30:00+07:00', 'Jl. Lintas Sumatera km 25 - Natar', 'Jl. Lintas Sumatera', 1, 105.1612, -5.2635, 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Tidak mematuhi rambu'],
  [2, '2023-02-08T18:45:00+07:00', 'Jl. Raya Natar - Depan SPBU', 'Jl. Raya Natar', 1, 105.1685, -5.2814, 'Baik', 'Berawan', 'Mobil', 2, 'Kecepatan berlebih'],
  [3, '2023-03-22T08:00:00+07:00', 'Simpang Natar - Jl. Lintas Timur', 'Jl. Lintas Timur', 1, 105.1824, -5.3195, 'Sedang', 'Hujan', 'Sepeda Motor', 3, 'Jalan licin saat hujan'],

  // ── JATI AGUNG (Koridor Jalan Terusan Ryacudu / Karang Anyar) ──
  [4, '2023-01-20T14:15:00+07:00', 'Jl. Jati Agung - Depan Pasar', 'Jl. Jati Agung Raya', 2, 105.2915, -5.3412, 'Baik', 'Cerah', 'Mobil', 2, 'Menerobos lampu merah'],
  [5, '2023-04-10T06:30:00+07:00', 'Jl. Raya Jati Agung km 12', 'Jl. Raya Jati Agung', 2, 105.3120, -5.3285, 'Sedang', 'Berawan', 'Truk', 2, 'Kelelahan pengemudi'],

  // ── TANJUNG BINTANG (Kawasan Industri Jalan Ir. Sutami) ──
  [6, '2023-02-14T20:00:00+07:00', 'Jl. Lintas Pantai Timur - Tanjung Bintang', 'Jl. Lintas Pantai Timur', 3, 105.4124, -5.4182, 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Berkendara malam tanpa lampu'],
  [7, '2023-05-18T11:30:00+07:00', 'Simpang Tanjung Bintang - Jl. Industri', 'Jl. Industri', 3, 105.3985, -5.4015, 'Baik', 'Cerah', 'Truk', 4, 'Blind spot kendaraan besar'],

  // ── TANJUNG SARI ──
  [8, '2023-03-05T15:00:00+07:00', 'Jl. Raya Tanjung Sari', 'Jl. Raya Tanjung Sari', 4, 105.4646, -5.3306, 'Sedang', 'Hujan', 'Sepeda Motor', 2, 'Jalan licin saat hujan'],

  // ── KATIBUNG ──
  [9, '2023-01-28T09:15:00+07:00', 'Jl. Raya Katibung km 35', 'Jl. Raya Katibung', 5, 105.4276, -5.5200, 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Tidak menjaga jarak aman'],
  [10, '2023-03-15T17:30:00+07:00', 'Jl. Lintas Sumatera - Katibung', 'Jl. Lintas Sumatera', 5, 105.4100, -5.5329, 'Baik', 'Berawan', 'Mobil', 2, 'Kecepatan berlebih'],
  [11, '2023-06-20T07:00:00+07:00', 'Tikungan Tajam Katibung - Jl. Lintas', 'Jl. Lintas Sumatera', 5, 105.4400, -5.5050, 'Rusak', 'Hujan', 'Bus', 1, 'Jalan rusak dan licin'],

  // ── MERBAU MATARAM ──
  [12, '2023-02-25T13:00:00+07:00', 'Jl. Raya Merbau Mataram', 'Jl. Raya Merbau Mataram', 6, 105.4857, -5.4556, 'Sedang', 'Cerah', 'Sepeda Motor', 2, 'Mendahului di tikungan'],

  // ── WAY SULAN ──
  [13, '2023-07-10T16:00:00+07:00', 'Jl. Way Sulan', 'Jl. Way Sulan', 7, 105.5472, -5.4717, 'Sedang', 'Cerah', 'Sepeda Motor', 2, 'Lalai saat berkendara'],

  // ── SIDOMULYO ──
  [14, '2023-01-10T19:00:00+07:00', 'Jl. Lintas Sumatera - Sidomulyo', 'Jl. Lintas Sumatera', 8, 105.5050, -5.5750, 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Berkendara malam hari'],
  [15, '2023-02-22T08:30:00+07:00', 'Simpang Sidomulyo - Pusat Kota', 'Jl. Raya Sidomulyo', 8, 105.5189, -5.5859, 'Baik', 'Cerah', 'Mobil', 2, 'Menerobos persimpangan'],
  [16, '2023-04-05T12:00:00+07:00', 'Jl. Raya Sidomulyo km 8', 'Jl. Raya Sidomulyo', 8, 105.5300, -5.5980, 'Sedang', 'Berawan', 'Truk', 2, 'Kelebihan muatan'],

  // ── CANDIPURO ──
  [17, '2023-03-18T10:15:00+07:00', 'Jl. Raya Candipuro', 'Jl. Raya Candipuro', 9, 105.5891, -5.5430, 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Tidak memakai helm'],

  // ── KALIANDA ──
  [18, '2023-01-05T08:00:00+07:00', 'Jl. Raya Kalianda - Pusat Kota', 'Jl. Kalianda Raya', 11, 105.6062, -5.7391, 'Baik', 'Cerah', 'Sepeda Motor', 3, 'Kecepatan berlebih'],
  [19, '2023-02-12T17:00:00+07:00', 'Jl. Lintas Pantai Barat - Kalianda', 'Jl. Lintas Pantai Barat', 11, 105.5865, -5.7485, 'Baik', 'Berawan', 'Mobil', 2, 'Mengantuk saat mengemudi'],
  [20, '2023-05-25T14:30:00+07:00', 'Tikungan Bukit Kalianda', 'Jl. Bukit Kalianda', 11, 105.5950, -5.7420, 'Sedang', 'Kabut', 'Sepeda Motor', 2, 'Jarak pandang terbatas'],

  // ── RAJABASA ──
  [21, '2023-04-20T09:00:00+07:00', 'Jl. Raya Rajabasa', 'Jl. Raya Rajabasa', 12, 105.6200, -5.7900, 'Sedang', 'Cerah', 'Sepeda Motor', 2, 'Tidak menjaga jarak'],

  // ── PALAS ──
  [22, '2023-03-30T16:45:00+07:00', 'Jl. Raya Palas', 'Jl. Raya Palas', 13, 105.6935, -5.6226, 'Rusak', 'Hujan', 'Sepeda Motor', 2, 'Jalan berlubang'],

  // ── SRAGI ──
  [23, '2023-06-15T11:00:00+07:00', 'Jl. Sragi Raya', 'Jl. Sragi Raya', 14, 105.7225, -5.6276, 'Sedang', 'Cerah', 'Sepeda Motor', 2, 'Lalai saat berkendara'],

  // ── PENENGAHAN ──
  [24, '2023-01-18T07:00:00+07:00', 'Jl. Raya Penengahan - Lintas Barat', 'Jl. Lintas Barat Sumatera', 15, 105.6543, -5.7279, 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Kecepatan berlebih'],
  [25, '2023-03-08T18:00:00+07:00', 'Tikungan Penengahan Km 60', 'Jl. Lintas Barat Sumatera', 15, 105.6600, -5.7350, 'Sedang', 'Berawan', 'Truk', 1, 'Tikungan tajam'],

  // ── KETAPANG ──
  [26, '2023-05-10T10:30:00+07:00', 'Jl. Raya Ketapang', 'Jl. Raya Ketapang', 16, 105.7813, -5.7375, 'Baik', 'Cerah', 'Sepeda Motor', 2, 'Tidak mematuhi rambu'],

  // ── BAKAUHENI ──
  [27, '2023-02-05T06:00:00+07:00', 'Jl. Menuju Pelabuhan Bakauheni', 'Jl. Bakauheni Raya', 17, 105.7317, -5.8350, 'Baik', 'Cerah', 'Mobil', 2, 'Antrian panjang'],
  [28, '2023-07-20T21:00:00+07:00', 'Jl. Raya Bakauheni - Tikungan Pantai', 'Jl. Bakauheni Pantai', 17, 105.7400, -5.8490, 'Sedang', 'Berawan', 'Bus', 1, 'Mengantuk malam hari']
];

export function getFallbackAccidentGeojson({ tahun, kecamatanId } = {}) {
  const rows = seedAccidents2023.filter((row) => {
    const rowYear = new Date(row[1]).getFullYear().toString();
    const matchYear = !tahun || rowYear === String(tahun);
    const matchKecamatan = !kecamatanId || String(row[4]) === String(kecamatanId);
    return matchYear && matchKecamatan;
  });

  return {
    type: 'FeatureCollection',
    features: rows.map(([id, tanggal, lokasi, jalan, kecamatan_id, lng, lat, kondisi_jalan, cuaca, jenis_kendaraan, jumlah_kendaraan, penyebab]) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(lng), Number(lat)]
      },
      properties: {
        id: Number(id),
        tanggal_kejadian: tanggal,
        lokasi_nama: lokasi,
        nama_jalan: jalan,
        kecamatan_id: Number(kecamatan_id),
        kecamatan_nama: kecamatanNames[kecamatan_id] || '-',
        kondisi_jalan: kondisi_jalan || '-',
        cuaca: cuaca || '-',
        jenis_kendaraan: jenis_kendaraan || '-',
        
        // Pemetaan ganda variabel jumlah kendaraan agar dibaca StatsCards & TrendChart
        jumlah_kendaraan: Number(jumlah_kendaraan || 0),
        jumlahKendaraan: Number(jumlah_kendaraan || 0), 
        
        penyebab: penyebab || '-',
        total_korban: Math.floor(Math.random() * 2) + 1,
        korban: [
          { nama: "Korban Laka", usia: 21, jenis_kelamin: "Laki-laki", kondisi: "Luka Ringan" }
        ],
        sumber_data: 'fallback-seed-frontend'
      }
    }))
  };
}