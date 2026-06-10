import { useMemo, useState } from 'react';
import { formatDateTime } from '../utils/formatters.js';

function rowFromFeature(feature) {
  return {
    feature,
    id: feature.properties?.id,
    latitude: feature.geometry?.coordinates?.[1],
    longitude: feature.geometry?.coordinates?.[0],
    ...feature.properties
  };
}

export default function AccidentTable({ geojson, onEdit, onDelete, deletingId }) {
  const [search, setSearch] = useState('');

  const rows = useMemo(() => (
    geojson?.features?.map(rowFromFeature) || []
  ), [geojson]);

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;

    return rows.filter((row) => [
      row.lokasi_nama,
      row.nama_jalan,
      row.kecamatan_nama,
      row.kondisi_jalan,
      row.cuaca,
      row.jenis_kendaraan
    ].some((value) => String(value || '').toLowerCase().includes(keyword)));
  }, [rows, search]);

  return (
    <section className="panel table-panel">
      <div className="panel-title table-title">
        <div>
          <p className="eyebrow">Data</p>
          <h2>Daftar Titik Kecelakaan</h2>
        </div>
        <div className="table-search">
          <label htmlFor="search-accident">Pencarian</label>
          <input
            id="search-accident"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari lokasi, jalan, kecamatan"
          />
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Lokasi</th>
              <th>Tanggal</th>
              <th>Kecamatan</th>
              <th>Kondisi</th>
              <th>Korban</th>
              <th>Koordinat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-cell">
                  {rows.length === 0 ? 'Belum ada titik kecelakaan untuk filter ini.' : 'Data tidak ditemukan dari kata kunci pencarian.'}
                </td>
              </tr>
            )}
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.lokasi_nama}</strong>
                  <small>{row.nama_jalan || '-'}</small>
                </td>
                <td>{formatDateTime(row.tanggal_kejadian)}</td>
                <td>{row.kecamatan_nama || '-'}</td>
                <td>{row.kondisi_jalan || '-'} / {row.cuaca || '-'}</td>
                <td>{row.total_korban ?? 0}</td>
                <td>
                  <small>{Number(row.latitude || 0).toFixed(5)}, {Number(row.longitude || 0).toFixed(5)}</small>
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      className="secondary small"
                      type="button"
                      onClick={() => onEdit(row.feature)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger small"
                      type="button"
                      onClick={() => onDelete(row.id)}
                      disabled={deletingId === row.id}
                    >
                      {deletingId === row.id ? 'Menghapus...' : 'Hapus'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
