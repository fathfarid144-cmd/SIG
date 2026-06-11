import { useState } from 'react';
import '../styles/victims-list.css';

export default function VictimsList({ 
  accidents = [],
  filter = 'all' // 'all', 'meninggal', 'berat', 'ringan'
}) {
  const [expandedAccident, setExpandedAccident] = useState(null);

  // Aggregate all victims from all accidents
  const allVictims = [];
  accidents.forEach((feature, accidentIdx) => {
    const props = feature.properties || {};
    const korban = Array.isArray(props.korban) ? props.korban : [];
    
    korban.forEach((victim, victimIdx) => {
      allVictims.push({
        ...victim,
        accidentId: props.id,
        accidentIdx,
        accidentLocation: props.lokasi_nama,
        accidentDate: props.tanggal_kejadian,
        victimIdx
      });
    });
  });

  // Apply filter
  const filteredVictims = filter === 'all' 
    ? allVictims
    : allVictims.filter(v => v.kondisi?.toLowerCase().includes(filter.toLowerCase()));

  // Group by condition
  const groupedByCondition = {
    'Meninggal Dunia': filteredVictims.filter(v => v.kondisi === 'Meninggal Dunia'),
    'Luka Berat': filteredVictims.filter(v => v.kondisi === 'Luka Berat'),
    'Luka Ringan': filteredVictims.filter(v => v.kondisi === 'Luka Ringan')
  };

  return (
    <div className="victims-list-container">
      <div className="victims-summary-stats">
        <div className="summary-stat meninggal">
          <div className="stat-number">{groupedByCondition['Meninggal Dunia'].length}</div>
          <div className="stat-label">Meninggal</div>
        </div>
        <div className="summary-stat berat">
          <div className="stat-number">{groupedByCondition['Luka Berat'].length}</div>
          <div className="stat-label">Luka Berat</div>
        </div>
        <div className="summary-stat ringan">
          <div className="stat-number">{groupedByCondition['Luka Ringan'].length}</div>
          <div className="stat-label">Luka Ringan</div>
        </div>
        <div className="summary-stat total">
          <div className="stat-number">{filteredVictims.length}</div>
          <div className="stat-label">Total Korban</div>
        </div>
      </div>

      {['Meninggal Dunia', 'Luka Berat', 'Luka Ringan'].map((condition) => {
        const victims = groupedByCondition[condition];
        if (victims.length === 0) return null;

        return (
          <div key={condition} className="victims-by-condition">
            <div className={`condition-header condition-${condition.toLowerCase().replace(/\s+/g, '-')}`}>
              <h3>
                {condition}
                <span className="count">{victims.length}</span>
              </h3>
            </div>

            <div className="victims-grid">
              {victims.map((victim, idx) => (
                <div 
                  key={`${victim.accidentIdx}-${victim.victimIdx}`}
                  className={`victim-card condition-${victim.kondisi.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="victim-card-content">
                    <div className="victim-main-info">
                      <p className="victim-name">{victim.nama_korban || `Korban ${idx + 1}`}</p>
                      <div className="victim-details">
                        <span className="detail-item">
                          <strong>Umur:</strong> {victim.usia || '-'} tahun
                        </span>
                        <span className="detail-item">
                          <strong>Jenis Kelamin:</strong> {victim.jenis_kelamin || '-'}
                        </span>
                      </div>
                    </div>

                    {victim.keterangan_luka && (
                      <div className="victim-injury-details">
                        <strong>Detail Luka:</strong>
                        <p>{victim.keterangan_luka}</p>
                      </div>
                    )}

                    <div className="victim-accident-info">
                      <small>
                        <strong>Lokasi:</strong> {victim.accidentLocation}
                      </small>
                      <small>
                        <strong>Tanggal:</strong> {new Date(victim.accidentDate).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </small>
                    </div>
                  </div>

                  <div className={`victim-status-badge status-${victim.kondisi.toLowerCase().replace(/\s+/g, '-')}`}>
                    {victim.kondisi}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filteredVictims.length === 0 && (
        <div className="empty-state">
          <p>Tidak ada data korban untuk filter yang dipilih</p>
        </div>
      )}
    </div>
  );
}
