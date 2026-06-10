export default function BlackSpotPanel({ blackSpot }) {
  if (!blackSpot) {
    return (
      <section className="panel blackspot-panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Analisis</p>
            <h2>Area Rawan</h2>
          </div>
        </div>
        <p className="muted">Pilih titik pada peta, lalu tekan tombol cek area rawan.</p>
      </section>
    );
  }

  return (
    <section className="panel blackspot-panel">
      <div className="panel-title">
        <div>
          <p className="eyebrow">Analisis</p>
          <h2>Area Rawan</h2>
        </div>
        <strong>{blackSpot.total_ditemukan || 0} kejadian</strong>
      </div>

      <p className="muted">
        Radius {blackSpot.radius_meter} meter dari titik {blackSpot.pusat?.latitude?.toFixed?.(5)}, {blackSpot.pusat?.longitude?.toFixed?.(5)}.
      </p>

      <div className="blackspot-list">
        {(blackSpot.kecelakaan || []).slice(0, 6).map((item) => (
          <article key={item.id}>
            <strong>{item.lokasi_nama}</strong>
            <small>{item.jarak_meter} meter dari titik pusat</small>
          </article>
        ))}
        {(blackSpot.kecelakaan || []).length === 0 && <p className="muted">Tidak ada kejadian dalam radius tersebut.</p>}
      </div>
    </section>
  );
}
