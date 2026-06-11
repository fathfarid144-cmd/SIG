import { formatNumber } from '../utils/formatters.js';
import '../styles/statistics-panel.css';

export default function StatisticsPanel({ 
  accidents = [], 
  statistikKecamatan = [] 
}) {
  // Hitung statistik per penyebab
  const causeCounts = {};
  const vehicleTypeCounts = {};
  const roadConditionCounts = {};

  accidents.forEach(feature => {
    const props = feature.properties || {};
    
    // Penyebab
    if (props.penyebab) {
      causeCounts[props.penyebab] = (causeCounts[props.penyebab] || 0) + 1;
    }
    
    // Jenis Kendaraan
    if (props.jenis_kendaraan) {
      vehicleTypeCounts[props.jenis_kendaraan] = (vehicleTypeCounts[props.jenis_kendaraan] || 0) + 1;
    }
    
    // Kondisi Jalan
    if (props.kondisi_jalan) {
      roadConditionCounts[props.kondisi_jalan] = (roadConditionCounts[props.kondisi_jalan] || 0) + 1;
    }
  });

  const sortedCauses = Object.entries(causeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const sortedVehicles = Object.entries(vehicleTypeCounts)
    .sort((a, b) => b[1] - a[1]);

  const sortedRoadConditions = Object.entries(roadConditionCounts)
    .sort((a, b) => b[1] - a[1]);

  // Hitung district dengan korban terbanyak
  const topDistricts = [...statistikKecamatan]
    .sort((a, b) => b.total_korban - a.total_korban)
    .slice(0, 5);

  return (
    <div className="statistics-panels">
      {/* Panel Penyebab Utama */}
      <section className="stat-panel">
        <div className="panel-title">
          <h3>Top 5 Penyebab Kecelakaan</h3>
        </div>
        <div className="stat-list">
          {sortedCauses.length === 0 ? (
            <p className="empty-message">Tidak ada data penyebab</p>
          ) : (
            sortedCauses.map(([cause, count], idx) => (
              <div key={idx} className="stat-item">
                <div className="stat-label">{cause}</div>
                <div className="stat-bar-wrapper">
                  <div 
                    className="stat-bar" 
                    style={{ width: `${(count / sortedCauses[0][1]) * 100}%` }}
                  />
                </div>
                <div className="stat-value">{count}</div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Panel Jenis Kendaraan */}
      <section className="stat-panel">
        <div className="panel-title">
          <h3>Jenis Kendaraan Terlibat</h3>
        </div>
        <div className="stat-list">
          {sortedVehicles.length === 0 ? (
            <p className="empty-message">Tidak ada data kendaraan</p>
          ) : (
            sortedVehicles.map(([vehicle, count], idx) => (
              <div key={idx} className="stat-item">
                <div className="stat-label">{vehicle}</div>
                <div className="stat-bar-wrapper">
                  <div 
                    className="stat-bar vehicle-bar" 
                    style={{ width: `${(count / sortedVehicles[0][1]) * 100}%` }}
                  />
                </div>
                <div className="stat-value">{count}</div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Panel Kondisi Jalan */}
      <section className="stat-panel">
        <div className="panel-title">
          <h3>Kondisi Jalan saat Kejadian</h3>
        </div>
        <div className="condition-grid">
          {sortedRoadConditions.length === 0 ? (
            <p className="empty-message">Tidak ada data kondisi jalan</p>
          ) : (
            sortedRoadConditions.map(([condition, count], idx) => {
              const conditionClass = condition.toLowerCase().replace(/\s+/g, '-');
              return (
                <div key={idx} className={`condition-card condition-${conditionClass}`}>
                  <div className="condition-label">{condition}</div>
                  <div className="condition-count">{count}</div>
                  <div className="condition-percent">
                    {((count / accidents.length) * 100).toFixed(1)}%
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Panel Kecamatan dengan Korban Terbanyak */}
      <section className="stat-panel full-width">
        <div className="panel-title">
          <h3>Top 5 Kecamatan dengan Korban Terbanyak</h3>
        </div>
        <div className="district-list">
          {topDistricts.length === 0 ? (
            <p className="empty-message">Tidak ada data kecamatan</p>
          ) : (
            topDistricts.map((district, idx) => (
              <div key={idx} className="district-item">
                <div className="district-rank">#{idx + 1}</div>
                <div className="district-info">
                  <p className="district-name">{district.nama_kecamatan}</p>
                  <p className="district-meta">
                    {district.total_kecelakaan} kejadian | {district.total_korban} korban
                  </p>
                </div>
                <div className="district-breakdown">
                  <span className="breakdown-item meninggal" title="Meninggal">
                    {district.total_meninggal}
                  </span>
                  <span className="breakdown-item berat" title="Luka Berat">
                    {district.total_luka_berat}
                  </span>
                  <span className="breakdown-item ringan" title="Luka Ringan">
                    {district.total_luka_ringan}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
