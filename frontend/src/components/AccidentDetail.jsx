import { formatDateTime, formatNumber } from '../utils/formatters.js';
import '../styles/accident-detail.css';

export default function AccidentDetail({ feature, onClose }) {
  if (!feature) return null;

  const props = feature.properties || {};
  const coords = feature.geometry?.coordinates || [];
  const korban = Array.isArray(props.korban) ? props.korban : [];

  const victimsByCondition = {
    'Meninggal Dunia': korban.filter(k => k.kondisi === 'Meninggal Dunia').length,
    'Luka Berat': korban.filter(k => k.kondisi === 'Luka Berat').length,
    'Luka Ringan': korban.filter(k => k.kondisi === 'Luka Ringan').length
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content accident-detail" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detail Kecelakaan</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Lokasi dan Waktu */}
          <section className="detail-section">
            <h3>Lokasi & Waktu</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Nama Lokasi</label>
                <p>{props.lokasi_nama || '-'}</p>
              </div>
              <div className="detail-item">
                <label>Nama Jalan</label>
                <p>{props.nama_jalan || '-'}</p>
              </div>
              <div className="detail-item">
                <label>Kecamatan</label>
                <p>{props.kecamatan_nama || '-'}</p>
              </div>
              <div className="detail-item">
                <label>Tanggal & Waktu</label>
                <p>{formatDateTime(props.tanggal_kejadian) || '-'}</p>
              </div>
            </div>
          </section>

          {/* Kondisi Jalan & Cuaca */}
          <section className="detail-section">
            <h3>Kondisi Jalan & Cuaca</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Kondisi Jalan</label>
                <p>{props.kondisi_jalan || '-'}</p>
              </div>
              <div className="detail-item">
                <label>Cuaca</label>
                <p>{props.cuaca || '-'}</p>
              </div>
              <div className="detail-item">
                <label>Penyebab</label>
                <p>{props.penyebab || '-'}</p>
              </div>
              <div className="detail-item">
                <label>Keterangan</label>
                <p>{props.keterangan || '-'}</p>
              </div>
            </div>
          </section>

          {/* Kendaraan */}
          <section className="detail-section">
            <h3>Kendaraan</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Jenis Kendaraan</label>
                <p>{props.jenis_kendaraan || '-'}</p>
              </div>
              <div className="detail-item">
                <label>Jumlah Kendaraan</label>
                <p>{props.jumlah_kendaraan || '-'}</p>
              </div>
              <div className="detail-item">
                <label>Kecepatan Perkiraan (km/h)</label>
                <p>{props.kecepatan_perkiraan || '-'}</p>
              </div>
            </div>
          </section>

          {/* Ringkasan Korban */}
          <section className="detail-section">
            <h3>Ringkasan Korban</h3>
            <div className="victim-summary">
              <div className={`victim-card victim-meninggal ${victimsByCondition['Meninggal Dunia'] > 0 ? 'active' : ''}`}>
                <div className="victim-count">{victimsByCondition['Meninggal Dunia']}</div>
                <div className="victim-label">Meninggal</div>
              </div>
              <div className={`victim-card victim-berat ${victimsByCondition['Luka Berat'] > 0 ? 'active' : ''}`}>
                <div className="victim-count">{victimsByCondition['Luka Berat']}</div>
                <div className="victim-label">Luka Berat</div>
              </div>
              <div className={`victim-card victim-ringan ${victimsByCondition['Luka Ringan'] > 0 ? 'active' : ''}`}>
                <div className="victim-count">{victimsByCondition['Luka Ringan']}</div>
                <div className="victim-label">Luka Ringan</div>
              </div>
              <div className="victim-card victim-total">
                <div className="victim-count">{korban.length}</div>
                <div className="victim-label">Total Korban</div>
              </div>
            </div>
          </section>

          {/* Daftar Korban */}
          {korban.length > 0 && (
            <section className="detail-section">
              <h3>Daftar Korban</h3>
              <div className="victims-list">
                {korban.map((victim, idx) => (
                  <div key={idx} className={`victim-item victim-${victim.kondisi?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}>
                    <div className="victim-info">
                      <p className="victim-name">{victim.nama_korban || `Korban ${idx + 1}`}</p>
                      <p className="victim-meta">
                        Umur: {victim.usia || '-'} | {victim.jenis_kelamin || '-'}
                      </p>
                      {victim.keterangan_luka && (
                        <p className="victim-note">{victim.keterangan_luka}</p>
                      )}
                    </div>
                    <span className={`victim-status status-${victim.kondisi?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}>
                      {victim.kondisi || 'Tidak Diketahui'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Koordinat */}
          <section className="detail-section">
            <h3>Koordinat Lokasi</h3>
            <div className="detail-grid">
              <div className="detail-item full">
                <label>Latitude</label>
                <p className="monospace">{Number(coords[1] || 0).toFixed(6)}</p>
              </div>
              <div className="detail-item full">
                <label>Longitude</label>
                <p className="monospace">{Number(coords[0] || 0).toFixed(6)}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <button className="primary" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}
