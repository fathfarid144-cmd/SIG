import { api } from '../api.js';

export default function Header({ healthStatus }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">WebGIS</p>
        <h1>Sistem Monitoring Kecelakaan Lalu Lintas</h1>
        <p className="subtitle">Pemetaan titik kecelakaan, wilayah kecamatan, dan ringkasan statistik Lampung Selatan.</p>
      </div>
      <div className="header-card">
        <span className={`status-dot ${healthStatus === 'ok' ? 'online' : 'offline'}`} />
        <div>
          <strong>{healthStatus === 'ok' ? 'API tersambung' : 'API belum tersambung'}</strong>
          <small>{api.baseUrl}</small>
        </div>
      </div>
    </header>
  );
}
