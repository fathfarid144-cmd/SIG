import { formatNumber } from '../utils/formatters.js';

export default function KecamatanTable({ data = [] }) {
  return (
    <section className="panel table-panel">
      <div className="panel-title">
        <div>
          <p className="eyebrow">Wilayah</p>
          <h2>Statistik per Kecamatan</h2>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Kecamatan</th>
              <th>Kejadian</th>
              <th>Korban</th>
              <th>Meninggal</th>
              <th>Luka Berat</th>
              <th>Luka Ringan</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-cell">Belum ada data statistik.</td>
              </tr>
            )}
            {data.map((item) => (
              <tr key={item.kecamatan_id}>
                <td>{item.nama_kecamatan}</td>
                <td>{formatNumber(item.total_kecelakaan)}</td>
                <td>{formatNumber(item.total_korban)}</td>
                <td>{formatNumber(item.total_meninggal)}</td>
                <td>{formatNumber(item.total_luka_berat)}</td>
                <td>{formatNumber(item.total_luka_ringan)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
