import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import Header from './components/Header.jsx';
import FilterBar from './components/FilterBar.jsx';
import StatsCards from './components/StatsCards.jsx';
import MapView from './components/MapView.jsx';
import AccidentForm from './components/AccidentForm.jsx';
import AccidentTable from './components/AccidentTable.jsx';
import AccidentDetail from './components/AccidentDetail.jsx';
import KecamatanTable from './components/KecamatanTable.jsx';
import TrendChart from './components/TrendChart.jsx';
import BlackSpotPanel from './components/BlackSpotPanel.jsx';
import BlackSpotAnalyzer from './components/BlackSpotAnalyzer.jsx';
import BlackSpotDetector from './components/BlackSpotDetector.jsx';
import StatisticsPanel from './components/StatisticsPanel.jsx';
import VictimsList from './components/VictimsList.jsx';
import { getFallbackAccidentGeojson } from './fallbackData.js';

function featureCollection(features = []) {
  return { type: 'FeatureCollection', features };
}

function kecamatanOptionsFromGeojson(geojson) {
  return (geojson?.features || [])
    .map((feature) => ({
      id: feature.properties?.id,
      nama: feature.properties?.nama,
      kode_kecamatan: feature.properties?.kode_kecamatan
    }))
    .filter((item) => item.id && item.nama)
    .sort((a, b) => a.nama.localeCompare(b.nama));
}

function filterKecamatanLayer(geojson, kecamatanId) {
  const features = geojson?.features || [];
  if (!kecamatanId) return featureCollection(features);
  return featureCollection(features.filter((feature) => String(feature.properties?.id) === String(kecamatanId)));
}

function filterAccidentLayer(geojson, tahun, kecamatanId) {
  const features = geojson?.features || [];

  return featureCollection(features.filter((feature) => {
    const properties = feature.properties || {};
    const tanggal = properties.tanggal_kejadian;
    const tahunData = tanggal ? new Date(tanggal).getFullYear().toString() : '';

    const cocokTahun = !tahun || !tanggal || tahunData === String(tahun);

    // Jika backend mengirim kecamatan_id, pakai filter yang ketat.
    // Jika backend tidak mengirim kecamatan_id, jangan langsung buang titiknya,
    // karena beberapa endpoint spasial hanya mengembalikan koordinat/lokasi.
    const hasKecamatanId = properties.kecamatan_id !== undefined && properties.kecamatan_id !== null && properties.kecamatan_id !== '';
    const cocokKecamatan = !kecamatanId || !hasKecamatanId || String(properties.kecamatan_id) === String(kecamatanId);

    return cocokTahun && cocokKecamatan;
  }));
}

function summaryFromPerKecamatan(rows = [], tahun) {
  return rows.reduce(
    (acc, row) => ({
      ...acc,
      total_kejadian: acc.total_kejadian + Number(row.total_kecelakaan || 0),
      total_korban: acc.total_korban + Number(row.total_korban || 0),
      total_meninggal: acc.total_meninggal + Number(row.total_meninggal || 0),
      total_luka_berat: acc.total_luka_berat + Number(row.total_luka_berat || 0),
      total_luka_ringan: acc.total_luka_ringan + Number(row.total_luka_ringan || 0)
    }),
    {
      tahun: tahun || 'Semua',
      total_kejadian: 0,
      total_korban: 0,
      total_meninggal: 0,
      total_luka_berat: 0,
      total_luka_ringan: 0
    }
  );
}

function trendFromAccidentLayer(geojson, tahun) {
  const bulanLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const counts = Array(12).fill(0);

  for (const feature of geojson?.features || []) {
    const tanggal = feature.properties?.tanggal_kejadian;
    if (!tanggal) continue;
    const date = new Date(tanggal);
    if (Number.isNaN(date.getTime())) continue;
    if (tahun && date.getFullYear().toString() !== String(tahun)) continue;
    counts[date.getMonth()] += 1;
  }

  return bulanLabels.map((bulan, index) => ({ bulan, total: counts[index] }));
}


function getFirstAccidentPosition(geojson) {
  const first = (geojson?.features || []).find((feature) => {
    const coords = feature?.geometry?.coordinates;
    return Array.isArray(coords) && coords.length >= 2;
  });

  if (!first) return null;

  let lng = Number(first.geometry.coordinates[0]);
  let lat = Number(first.geometry.coordinates[1]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  // Jika koordinat kebalik [lat, lng], perbaiki untuk area Lampung Selatan.
  if (lng >= -7 && lng <= -4 && lat >= 104 && lat <= 107) {
    const temp = lng;
    lng = lat;
    lat = temp;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

async function safeLoad(label, task, fallbackValue, warnings) {
  try {
    return await task();
  } catch (error) {
    warnings.push(`${label}: ${error.message}`);
    return fallbackValue;
  }
}

export default function App() {
  const currentYear = useMemo(() => '2023', []);

  const [healthStatus, setHealthStatus] = useState('offline');
  const [tahun, setTahun] = useState(currentYear);
  const [kecamatanId, setKecamatanId] = useState('');
  const [kecamatanOptions, setKecamatanOptions] = useState([]);
  const [kecamatanGeojson, setKecamatanGeojson] = useState(null);
  const [kecelakaanGeojson, setKecelakaanGeojson] = useState(null);
  const [ringkasan, setRingkasan] = useState(null);
  const [statistikKecamatan, setStatistikKecamatan] = useState([]);
  const [trenBulanan, setTrenBulanan] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [blackSpot, setBlackSpot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingFeature, setEditingFeature] = useState(null);
  const [selectedDetailFeature, setSelectedDetailFeature] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState([]);

  const selectedYearForQuery = tahun || undefined;
  const selectedKecamatan = useMemo(
    () => kecamatanOptions.find((item) => String(item.id) === String(kecamatanId)),
    [kecamatanOptions, kecamatanId]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    setWarnings([]);

    try {
      const health = await api.getHealth();
      setHealthStatus(health?.status || 'ok');
    } catch {
      setHealthStatus('offline');
    }

    const nextWarnings = [];

    const allKecamatanLayer = await safeLoad(
      'Layer kecamatan gagal dimuat',
      () => api.getKecamatanGeojson(),
      { type: 'FeatureCollection', features: [] },
      nextWarnings
    );

    const displayKecamatanLayer = filterKecamatanLayer(allKecamatanLayer, kecamatanId);
    const optionsFromGeojson = kecamatanOptionsFromGeojson(allKecamatanLayer);

    const [perKecamatanSemua, trenSemua] = await Promise.all([
      safeLoad(
        'Statistik per kecamatan gagal dimuat',
        () => api.getStatistikKecamatan(selectedYearForQuery),
        [],
        nextWarnings
      ),
      safeLoad(
        'Tren bulanan gagal dimuat',
        () => api.getTrenBulanan(tahun || currentYear),
        { data: [] },
        nextWarnings
      )
    ]);

    const perKecamatanFiltered = kecamatanId
      ? (perKecamatanSemua || []).filter((row) => String(row.kecamatan_id) === String(kecamatanId))
      : (perKecamatanSemua || []);

    // Urutan pengambilan titik dibuat mengikuti backend yang sudah ada.
    // 1) GeoJSON utama memakai filter tahun + kecamatan_id, karena ini mengikuti relasi database.
    // 2) Jika kosong/error, coba endpoint spasial dalam kecamatan.
    // 3) Jika tetap kosong, pakai fallback data seed 2023 di frontend agar marker tetap tampil saat demo.
    let rawAccidentLayer = await safeLoad(
      'GeoJSON kecelakaan utama gagal dimuat',
      () => api.getKecelakaanGeojson({
        tahun: selectedYearForQuery,
        kecamatanId,
        kecamatanNama: selectedKecamatan?.nama
      }),
      null,
      nextWarnings
    );

    if (!rawAccidentLayer || rawAccidentLayer.features?.length === 0) {
      rawAccidentLayer = kecamatanId
        ? await safeLoad(
            'Endpoint spasial dalam kecamatan gagal dimuat',
            () => api.getKecelakaanDalamKecamatan(kecamatanId, selectedKecamatan?.nama),
            null,
            nextWarnings
          )
        : rawAccidentLayer;
    }

    if (!rawAccidentLayer || rawAccidentLayer.features?.length === 0) {
      const fallbackSeedLayer = getFallbackAccidentGeojson({
        tahun: selectedYearForQuery,
        kecamatanId
      });

      if (fallbackSeedLayer.features.length > 0) {
        rawAccidentLayer = fallbackSeedLayer;
        nextWarnings.push('Titik kecelakaan memakai fallback data seed 2023 di frontend karena endpoint titik kecelakaan backend kosong/error.');
      }
    }

    if (!rawAccidentLayer || rawAccidentLayer.features?.length === 0) {
      rawAccidentLayer = await safeLoad(
        'Fallback titik kecelakaan dari black-spot gagal dimuat',
        () => api.getKecelakaanFallbackFromBlackSpot(),
        { type: 'FeatureCollection', features: [] },
        nextWarnings
      );
    }

    const displayAccidentLayer = filterAccidentLayer(rawAccidentLayer, selectedYearForQuery, kecamatanId);

    const summary = kecamatanId
      ? summaryFromPerKecamatan(perKecamatanFiltered, selectedYearForQuery)
      : await safeLoad(
          'Ringkasan gagal dimuat, memakai hasil hitung dari statistik per kecamatan',
          () => api.getRingkasan(selectedYearForQuery),
          summaryFromPerKecamatan(perKecamatanFiltered, selectedYearForQuery),
          nextWarnings
        );

    const trend = kecamatanId
      ? trendFromAccidentLayer(displayAccidentLayer, selectedYearForQuery)
      : (trenSemua?.data || []);

    setKecamatanOptions(optionsFromGeojson);
    setKecamatanGeojson(displayKecamatanLayer);
    setKecelakaanGeojson(displayAccidentLayer);
    setRingkasan(summary || summaryFromPerKecamatan(perKecamatanFiltered, selectedYearForQuery));
    setStatistikKecamatan(perKecamatanFiltered);
    setTrenBulanan(trend);
    setWarnings(nextWarnings);

    if (nextWarnings.length && !displayKecamatanLayer?.features?.length && !displayAccidentLayer?.features?.length) {
      setError('Data belum dapat dimuat dari API. Periksa koneksi backend atau endpoint yang digunakan.');
    }

    setLoading(false);
  }, [currentYear, kecamatanId, selectedKecamatan?.nama, selectedYearForQuery, tahun]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSubmitAccident(payload, onSuccess) {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      if (editingFeature?.properties?.id) {
        const response = await api.updateKecelakaan(editingFeature.properties.id, payload);
        setMessage(response?.message || 'Data kecelakaan berhasil diperbarui.');
      } else {
        const response = await api.createKecelakaan(payload);
        setMessage(response?.message || 'Data kecelakaan berhasil disimpan.');
      }

      onSuccess?.();
      setEditingFeature(null);
      await loadData();
    } catch (err) {
      setError(err.message || (editingFeature ? 'Gagal memperbarui data kecelakaan.' : 'Gagal menyimpan data kecelakaan.'));
    } finally {
      setSaving(false);
    }
  }

  function handleEditAccident(feature) {
    setEditingFeature(feature);
    setMessage('Mode edit aktif. Data terpilih sudah dimasukkan ke form.');
    setError('');
    requestAnimationFrame(() => {
      document.getElementById('form-kecelakaan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function handleCancelEdit() {
    setEditingFeature(null);
    setMessage('');
    setError('');
  }

  async function handleDeleteAccident(id) {
    const confirmed = window.confirm('Hapus data kecelakaan ini?');
    if (!confirmed) return;

    setDeletingId(id);
    setError('');
    setMessage('');

    try {
      const response = await api.deleteKecelakaan(id);
      setMessage(response?.message || 'Data berhasil dihapus.');
      if (String(editingFeature?.properties?.id) === String(id)) setEditingFeature(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Gagal menghapus data.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSearchBlackSpot() {
    if (!selectedPosition) {
      setError('Klik salah satu titik/lokasi di peta terlebih dahulu untuk menentukan titik acuan area rawan.');
      setMessage('');
      return;
    }

    setError('');
    setMessage('');

    try {
      const result = await api.getBlackSpot({
        latitude: selectedPosition.lat,
        longitude: selectedPosition.lng,
        radiusMeter: 1000
      });
      setBlackSpot(result);
      setMessage('Analisis area rawan berhasil dijalankan berdasarkan titik yang dipilih pada peta.');
    } catch (err) {
      setError(err.message || 'Gagal menjalankan analisis area rawan.');
    }
  }

  return (
    <main className="app-shell">
      <Header healthStatus={healthStatus} />

      {(message || error) && (
        <div className={`notice ${error ? 'error' : 'success'}`}>
          {error || message}
        </div>
      )}


      <FilterBar
        tahun={tahun}
        setTahun={setTahun}
        kecamatanId={kecamatanId}
        setKecamatanId={setKecamatanId}
        kecamatanOptions={kecamatanOptions}
        onRefresh={loadData}
      />

      {loading && <div className="notice info">Memuat data...</div>}

      <StatsCards ringkasan={ringkasan} />

      <div className="layout-grid">
        <MapView
          kecamatanGeojson={kecamatanGeojson}
          kecelakaanGeojson={kecelakaanGeojson}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          blackSpot={blackSpot}
          onSearchBlackSpot={handleSearchBlackSpot}
        />

        <aside className="right-column">
          <AccidentForm
            kecamatanOptions={kecamatanOptions}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
            onSubmit={handleSubmitAccident}
            onCancelEdit={handleCancelEdit}
            editingFeature={editingFeature}
            loading={saving}
          />
          {blackSpot ? (
            <BlackSpotAnalyzer 
              blackSpot={blackSpot}
            />
          ) : (
            <BlackSpotPanel blackSpot={blackSpot} />
          )}
        </aside>
      </div>

      <div className="bottom-grid">
        <TrendChart data={trenBulanan} />
        <KecamatanTable data={statistikKecamatan} />
      </div>

      <AccidentTable
        geojson={kecelakaanGeojson}
        onEdit={handleEditAccident}
        onDelete={handleDeleteAccident}
        deletingId={deletingId}
        onDetail={setSelectedDetailFeature}
      />

      {selectedDetailFeature && (
        <AccidentDetail
          feature={selectedDetailFeature}
          onClose={() => setSelectedDetailFeature(null)}
        />
      )}

      <StatisticsPanel
        accidents={kecelakaanGeojson?.features || []}
        statistikKecamatan={statistikKecamatan}
      />

      <section className="panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Data Korban</p>
            <h2>Daftar Korban Kecelakaan</h2>
          </div>
        </div>
        <VictimsList
          accidents={kecelakaanGeojson?.features || []}
          filter="all"
        />
      </section>

      <section className="panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Deteksi Otomatis</p>
            <h2>Identifikasi Area Rawan</h2>
          </div>
        </div>
        <BlackSpotDetector
          accidents={kecelakaanGeojson?.features || []}
          onSelectBlackSpot={(spot) => setBlackSpot(spot)}
        />
      </section>
    </main>
  );
}
