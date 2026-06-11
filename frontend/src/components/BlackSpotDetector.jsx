import { useState, useEffect } from 'react';
import '../styles/blackspot-detector.css';

export default function BlackSpotDetector({ accidents = [], onSelectBlackSpot }) {
  const [blackSpots, setBlackSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [radiusMeters, setRadiusMeters] = useState(2000);

  // Hitung black spots dengan clustering algorithm (simple grid-based)
  useEffect(() => {
    if (!accidents || accidents.length === 0) {
      setBlackSpots([]);
      return;
    }

    const gridSize = radiusMeters / 1000; // Convert to approximate grid size
    const grid = {};
    const spots = [];

    // Populate grid
    accidents.forEach(feature => {
      if (!feature.geometry?.coordinates) return;
      const [lng, lat] = feature.geometry.coordinates;
      const gridKey = `${Math.floor(lat / gridSize)},${Math.floor(lng / gridSize)}`;

      if (!grid[gridKey]) {
        grid[gridKey] = [];
      }
      grid[gridKey].push(feature);
    });

    // Identify black spots (clusters with 3+ accidents)
    Object.entries(grid).forEach(([key, features]) => {
      if (features.length >= 3) {
        // Calculate center of cluster
        const centerLat = features.reduce((sum, f) => sum + f.geometry.coordinates[1], 0) / features.length;
        const centerLng = features.reduce((sum, f) => sum + f.geometry.coordinates[0], 0) / features.length;

        // Count casualties
        const totalVictims = features.reduce((sum, f) => sum + (f.properties?.total_korban || 0), 0);
        const deaths = features.reduce((sum, f) => {
          const korban = Array.isArray(f.properties?.korban) ? f.properties.korban : [];
          return sum + korban.filter(k => k.kondisi === 'Meninggal Dunia').length;
        }, 0);

        // Determine risk level
        let riskLevel = 'rendah';
        if (deaths > 0) riskLevel = 'sangat_tinggi';
        else if (totalVictims >= 20) riskLevel = 'tinggi';
        else if (totalVictims >= 10) riskLevel = 'sedang';

        spots.push({
          id: key,
          latitude: centerLat,
          longitude: centerLng,
          accidentCount: features.length,
          victimCount: totalVictims,
          deathCount: deaths,
          riskLevel,
          accidents: features
        });
      }
    });

    // Sort by accident count
    spots.sort((a, b) => b.accidentCount - a.accidentCount);
    setBlackSpots(spots);
  }, [accidents, radiusMeters]);

  const handleSelectSpot = (spot) => {
    setSelectedSpot(spot.id);
    if (onSelectBlackSpot) {
      onSelectBlackSpot({
        pusat: {
          latitude: spot.latitude,
          longitude: spot.longitude
        },
        radius_meter: radiusMeters,
        kecelakaan: spot.accidents.map(a => ({
          id: a.properties?.id,
          lokasi_nama: a.properties?.lokasi_nama,
          nama_jalan: a.properties?.nama_jalan,
          kecamatan_nama: a.properties?.kecamatan_nama,
          tanggal_kejadian: a.properties?.tanggal_kejadian,
          kondisi_jalan: a.properties?.kondisi_jalan,
          penyebab: a.properties?.penyebab,
          total_korban: a.properties?.total_korban,
          jumlah_meninggal: Array.isArray(a.properties?.korban) 
            ? a.properties.korban.filter(k => k.kondisi === 'Meninggal Dunia').length 
            : 0,
          jumlah_luka_berat: Array.isArray(a.properties?.korban)
            ? a.properties.korban.filter(k => k.kondisi === 'Luka Berat').length
            : 0,
          jumlah_luka_ringan: Array.isArray(a.properties?.korban)
            ? a.properties.korban.filter(k => k.kondisi === 'Luka Ringan').length
            : 0,
          jarak_meter: 0
        }))
      });
    }
  };

  return (
    <div className="blackspot-detector">
      <div className="detector-header">
        <h3>Deteksi Area Rawan</h3>
        <p className="subtitle">Identifikasi otomatis cluster kecelakaan di seluruh wilayah</p>
      </div>

      {/* Radius Control */}
      <div className="radius-control">
        <label htmlFor="radius-slider">Radius Analisis: <strong>{radiusMeters}m</strong></label>
        <input
          id="radius-slider"
          type="range"
          min="500"
          max="5000"
          step="500"
          value={radiusMeters}
          onChange={(e) => setRadiusMeters(Number(e.target.value))}
          className="radius-slider"
        />
        <div className="radius-labels">
          <span>500m</span>
          <span>5000m</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="detector-summary">
        <div className="summary-item">
          <div className="summary-number">{blackSpots.length}</div>
          <div className="summary-label">Area Rawan Terdeteksi</div>
        </div>
        <div className="summary-item">
          <div className="summary-number">{blackSpots.reduce((sum, s) => sum + s.accidentCount, 0)}</div>
          <div className="summary-label">Total Kejadian</div>
        </div>
        <div className="summary-item">
          <div className="summary-number">{blackSpots.reduce((sum, s) => sum + s.victimCount, 0)}</div>
          <div className="summary-label">Total Korban</div>
        </div>
      </div>

      {/* Black Spots List */}
      <div className="blackspots-list">
        {blackSpots.length === 0 ? (
          <div className="empty-state">
            <p>Tidak ada area rawan terdeteksi dengan kriteria saat ini.</p>
            <small>Pertimbangkan untuk menambah data kecelakaan atau mengubah radius analisis.</small>
          </div>
        ) : (
          blackSpots.map((spot, idx) => (
            <div
              key={spot.id}
              className={`blackspot-card risk-${spot.riskLevel} ${selectedSpot === spot.id ? 'selected' : ''}`}
              onClick={() => handleSelectSpot(spot)}
            >
              <div className="card-header">
                <div className="spot-rank">#{idx + 1}</div>
                <div className="spot-main">
                  <h4>Area Rawan {idx + 1}</h4>
                  <p className="spot-coords">
                    {spot.latitude.toFixed(5)}, {spot.longitude.toFixed(5)}
                  </p>
                </div>
                <div className={`risk-label risk-${spot.riskLevel}`}>
                  {spot.riskLevel.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <div className="card-stats">
                <div className="stat-item">
                  <span className="stat-value">{spot.accidentCount}</span>
                  <span className="stat-name">Kejadian</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{spot.victimCount}</span>
                  <span className="stat-name">Korban</span>
                </div>
                <div className="stat-item meninggal-indicator">
                  <span className="stat-value">{spot.deathCount}</span>
                  <span className="stat-name">Meninggal</span>
                </div>
              </div>

              <div className="card-actions">
                <button className="btn-analyze">
                  Analisis Detail →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {blackSpots.length > 0 && (
        <div className="detector-note">
          <p>💡 Klik pada area rawan untuk melihat analisis detail dan rekomendasi perbaikan.</p>
        </div>
      )}
    </div>
  );
}
