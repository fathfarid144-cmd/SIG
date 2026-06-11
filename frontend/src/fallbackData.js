const kecamatanNames = {
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

// Koordinat diperbarui berdasarkan Google Maps Places API
// Format: [id, tanggal, lokasi_nama, nama_jalan, kecamatan_id, lng, lat]
const seedAccidents2023 = [
  // ── NATAR (centroid: -5.2966, 105.1921) ──────────────────────
  [1,  '2023-01-15T07:30:00+07:00', 'Jl. Lintas Sumatera km 25 - Natar',    'Jl. Lintas Sumatera',      1,  105.1950, -5.2900],
  [2,  '2023-02-08T18:45:00+07:00', 'Jl. Raya Natar - Depan SPBU',          'Jl. Raya Natar',           1,  105.1830, -5.3000],
  [3,  '2023-03-22T08:00:00+07:00', 'Simpang Natar - Jl. Lintas Timur',     'Jl. Lintas Timur',         1,  105.1720, -5.3100],

  // ── JATI AGUNG (centroid: -5.2903, 105.3583) ─────────────────
  [4,  '2023-01-20T14:15:00+07:00', 'Jl. Jati Agung - Depan Pasar',         'Jl. Jati Agung Raya',      2,  105.3583, -5.2903],
  [5,  '2023-04-10T06:30:00+07:00', 'Jl. Raya Jati Agung km 12',            'Jl. Raya Jati Agung',      2,  105.3450, -5.3050],

  // ── TANJUNG BINTANG (centroid: -5.4023, 105.3561) ────────────
  [6,  '2023-02-14T20:00:00+07:00', 'Jl. Lintas Pantai Timur - Tanjung Bintang', 'Jl. Lintas Pantai Timur', 3, 105.3561, -5.4023],
  [7,  '2023-05-18T11:30:00+07:00', 'Simpang Tanjung Bintang - Jl. Industri','Jl. Industri',            3,  105.3700, -5.4150],

  // ── TANJUNG SARI (centroid: -5.3306, 105.4646) ───────────────
  [8,  '2023-03-05T15:00:00+07:00', 'Jl. Raya Tanjung Sari',                'Jl. Raya Tanjung Sari',    4,  105.4646, -5.3306],

  // ── KATIBUNG (centroid: -5.5329, 105.4276) ───────────────────
  [9,  '2023-01-28T09:15:00+07:00', 'Jl. Raya Katibung km 35',              'Jl. Raya Katibung',        5,  105.4276, -5.5200],
  [10, '2023-03-15T17:30:00+07:00', 'Jl. Lintas Sumatera - Katibung',       'Jl. Lintas Sumatera',      5,  105.4100, -5.5329],
  [11, '2023-06-20T07:00:00+07:00', 'Tikungan Tajam Katibung - Jl. Lintas', 'Jl. Lintas Sumatera',      5,  105.4400, -5.5050],

  // ── MERBAU MATARAM (centroid: -5.4556, 105.4857) ─────────────
  [12, '2023-02-25T13:00:00+07:00', 'Jl. Raya Merbau Mataram',              'Jl. Raya Merbau Mataram',  6,  105.4857, -5.4556],

  // ── WAY SULAN (centroid: -5.4717, 105.5472) ──────────────────
  [13, '2023-07-10T16:00:00+07:00', 'Jl. Way Sulan',                        'Jl. Way Sulan',            7,  105.5472, -5.4717],

  // ── SIDOMULYO (centroid: -5.5859, 105.5189) ──────────────────
  [14, '2023-01-10T19:00:00+07:00', 'Jl. Lintas Sumatera - Sidomulyo',      'Jl. Lintas Sumatera',      8,  105.5050, -5.5750],
  [15, '2023-02-22T08:30:00+07:00', 'Simpang Sidomulyo - Pusat Kota',       'Jl. Raya Sidomulyo',       8,  105.5189, -5.5859],
  [16, '2023-04-05T12:00:00+07:00', 'Jl. Raya Sidomulyo km 8',              'Jl. Raya Sidomulyo',       8,  105.5300, -5.5980],

  // ── CANDIPURO (centroid: -5.5430, 105.5891) ──────────────────
  [17, '2023-03-18T10:15:00+07:00', 'Jl. Raya Candipuro',                   'Jl. Raya Candipuro',       9,  105.5891, -5.5430],

  // ── KALIANDA (centroid: -5.7368, 105.5913) ───────────────────
  // id 18 pakai koordinat confirmed dari klik peta: -5.7391, 105.6062
  [18, '2023-01-05T08:00:00+07:00', 'Jl. Raya Kalianda - Pusat Kota',       'Jl. Kalianda Raya',        11, 105.6062, -5.7391],
  [19, '2023-02-12T17:00:00+07:00', 'Jl. Lintas Pantai Barat - Kalianda',   'Jl. Lintas Pantai Barat',  11, 105.5800, -5.7500],
  [20, '2023-05-25T14:30:00+07:00', 'Tikungan Bukit Kalianda',              'Jl. Bukit Kalianda',       11, 105.5950, -5.7420],

  // ── RAJABASA (centroid daratan: -5.7900, 105.6200) ───────────
  [21, '2023-04-20T09:00:00+07:00', 'Jl. Raya Rajabasa',                    'Jl. Raya Rajabasa',        12, 105.6200, -5.7900],

  // ── PALAS (centroid: -5.6226, 105.6935) ──────────────────────
  [22, '2023-03-30T16:45:00+07:00', 'Jl. Raya Palas',                       'Jl. Raya Palas',           13, 105.6935, -5.6226],

  // ── SRAGI (centroid: -5.6276, 105.7225) ──────────────────────
  [23, '2023-06-15T11:00:00+07:00', 'Jl. Sragi Raya',                       'Jl. Sragi Raya',           14, 105.7225, -5.6276],

  // ── PENENGAHAN (centroid: -5.7279, 105.6543) ─────────────────
  [24, '2023-01-18T07:00:00+07:00', 'Jl. Raya Penengahan - Lintas Barat',   'Jl. Lintas Barat Sumatera',15, 105.6543, -5.7279],
  [25, '2023-03-08T18:00:00+07:00', 'Tikungan Penengahan Km 60',            'Jl. Lintas Barat Sumatera',15, 105.6600, -5.7350],

  // ── KETAPANG (centroid: -5.7375, 105.7813) ───────────────────
  [26, '2023-05-10T10:30:00+07:00', 'Jl. Raya Ketapang',                    'Jl. Raya Ketapang',        16, 105.7813, -5.7375],

  // ── BAKAUHENI (centroid: -5.8490, 105.7317) ──────────────────
  [27, '2023-02-05T06:00:00+07:00', 'Jl. Menuju Pelabuhan Bakauheni',       'Jl. Bakauheni Raya',       17, 105.7317, -5.8350],
  [28, '2023-07-20T21:00:00+07:00', 'Jl. Raya Bakauheni - Tikungan Pantai', 'Jl. Bakauheni Pantai',     17, 105.7400, -5.8490],
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
    features: rows.map(([id, tanggal, lokasi, jalan, kecamatan_id, lng, lat]) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      properties: {
        id,
        tanggal_kejadian: tanggal,
        lokasi_nama: lokasi,
        nama_jalan: jalan,
        kecamatan_id,
        kecamatan_nama: kecamatanNames[kecamatan_id] || '-',
        kondisi_jalan: '-',
        cuaca: '-',
        jenis_kendaraan: '-',
        total_korban: null,
        sumber_data: 'fallback-seed-frontend'
      }
    }))
  };
}