import { useState } from 'react';
import '../styles/blackspot-analyzer.css';

export default function BlackSpotAnalyzer({ blackSpot, onRadiusChange }) {
  const [expandedItem, setExpandedItem] = useState(null);

  if (!blackSpot) {
    return null;
  }

  const accidents = blackSpot.kecelakaan || [];
  const totalAccidents = accidents.length;
  
  // Hitung statistik korban
  const victimStats = {
    total: 0,
    meninggal: 0,
    berat: 0,
    ringan: 0
  };

  accidents.forEach(item => {
    victimStats.total += item.total_korban || 0;
    victimStats.meninggal += item.jumlah_meninggal || 0;
    victimStats.berat += item.jumlah_luka_berat || 0;
    victimStats.ringan += item.jumlah_luka_ringan || 0;
  });

  // Hitung rata-rata jarak
  const avgDistance = accidents.length > 0
    ? Math.round(accidents.reduce((sum, a) => sum + (a.jarak_meter || 0), 0) / accidents.length)
    : 0;

  // Tentukan tingkat risiko
  const getRiskLevel = (count, victims) => {
    if (count >= 10 && victims >= 20) return { level: 'SANGAT TINGGI', class: 'risk-critical' };
    if (count >= 7 && victims >= 15) return { level: 'TINGGI', class: 'risk-high' };
    if (count >= 4 && victims >= 8) return { level: 'SEDANG', class: 'risk-medium' };
    return { level: 'RENDAH', class: 'risk-low' };
  };

  const riskAssessment = getRiskLevel(totalAccidents, victimStats.total);

  return (
    <div className="blackspot-analyzer">
      {/* Risk Assessment Card */}
      <div className={`risk-card ${riskAssessment.class}`}>
        <div className="risk-header">
          <h3>Penilaian Risiko Area</h3>
          <div className={`risk-badge ${riskAssessment.class}`}>
            {riskAssessment.level}
          </div>
        </div>
        
        <div className="risk-details">
          <p className="risk-description">
            Area dengan radius <strong>{blackSpot.radius_meter}m</strong> dari koordinat 
            <strong className="coords">{blackSpot.pusat?.latitude?.toFixed?.(5)}, {blackSpot.pusat?.longitude?.toFixed?.(5)}</strong>
          </p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="statistics-grid">
        <div className="stat-box">
          <div className="stat-number">{totalAccidents}</div>
          <div className="stat-label">Kejadian</div>
          <div className="stat-percent">dalam {blackSpot.radius_meter}m</div>
        </div>
        
        <div className="stat-box">
          <div className="stat-number">{victimStats.total}</div>
          <div className="stat-label">Total Korban</div>
          <div className="stat-percent">{totalAccidents > 0 ? (victimStats.total / totalAccidents).toFixed(1) : 0} per kejadian</div>
        </div>
        
        <div className="stat-box">
          <div className="stat-number">{avgDistance}</div>
          <div className="stat-label">Jarak Rata-rata</div>
          <div className="stat-percent">dari pusat area</div>
        </div>
      </div>

      {/* Victim Breakdown */}
      <div className="victim-breakdown">
        <h4>Breakdown Korban</h4>
        <div className="breakdown-grid">
          <div className={`breakdown-item victim-meninggal ${victimStats.meninggal > 0 ? 'active' : ''}`}>
            <div className="breakdown-number">{victimStats.meninggal}</div>
            <div className="breakdown-label">Meninggal</div>
          </div>
          <div className={`breakdown-item victim-berat ${victimStats.berat > 0 ? 'active' : ''}`}>
            <div className="breakdown-number">{victimStats.berat}</div>
            <div className="breakdown-label">Luka Berat</div>
          </div>
          <div className={`breakdown-item victim-ringan ${victimStats.ringan > 0 ? 'active' : ''}`}>
            <div className="breakdown-number">{victimStats.ringan}</div>
            <div className="breakdown-label">Luka Ringan</div>
          </div>
        </div>
      </div>

      {/* Accidents List */}
      <div className="blackspot-accidents">
        <h4>Daftar Kejadian dalam Area ({totalAccidents})</h4>
        
        {accidents.length === 0 ? (
          <p className="empty-message">Tidak ada kejadian dalam radius area ini.</p>
        ) : (
          <div className="accidents-list">
            {accidents.map((item, idx) => (
              <div key={item.id || idx} className="accident-item">
                <div className="accident-header" onClick={() => setExpandedItem(expandedItem === idx ? null : idx)}>
                  <div className="accident-info">
                    <strong>{item.lokasi_nama}</strong>
                    <span className="distance-badge">{item.jarak_meter}m</span>
                  </div>
                  <div className="accident-meta">
                    <span className="victim-count">{item.total_korban || 0} korban</span>
                    <span className="expand-icon">{expandedItem === idx ? '▼' : '▶'}</span>
                  </div>
                </div>
                
                {expandedItem === idx && (
                  <div className="accident-details">
                    <p><strong>Jalan:</strong> {item.nama_jalan || '-'}</p>
                    <p><strong>Tanggal:</strong> {item.tanggal_kejadian ? new Date(item.tanggal_kejadian).toLocaleDateString('id-ID') : '-'}</p>
                    <p><strong>Kecamatan:</strong> {item.kecamatan_nama || '-'}</p>
                    <p><strong>Kondisi Jalan:</strong> {item.kondisi_jalan || '-'}</p>
                    <p><strong>Penyebab:</strong> {item.penyebab || '-'}</p>
                    <div className="victim-detail">
                      <span className="v-meninggal">{item.jumlah_meninggal || 0} meninggal</span>
                      <span className="v-berat">{item.jumlah_luka_berat || 0} luka berat</span>
                      <span className="v-ringan">{item.jumlah_luka_ringan || 0} luka ringan</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {totalAccidents > 0 && (
        <div className="recommendations">
          <h4>Rekomendasi</h4>
          <ul>
            {totalAccidents >= 5 && (
              <li>🚨 Area ini teridentifikasi sebagai area rawan. Pertimbangkan peningkatan patroli dan penindakan lalu lintas.</li>
            )}
            {victimStats.meninggal > 0 && (
              <li>☠️ Area ini memiliki korban meninggal. Perbaikan infrastruktur jalan sangat direkomendasikan.</li>
            )}
            {accidents.some(a => (a.penyebab || '').toLowerCase().includes('kecepatan')) && (
              <li>⚡ Banyak kecelakaan terjadi karena kecepatan tinggi. Instalasi traffic calming devices diperlukan.</li>
            )}
            {accidents.some(a => (a.kondisi_jalan || '').includes('Rusak')) && (
              <li>🛣️ Kondisi jalan yang rusak berkontribusi pada kecelakaan. Perbaikan jalan mendesak dilakukan.</li>
            )}
            <li>📊 Monitor area ini secara berkala dan update data kecelakaan untuk analisis tren.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
