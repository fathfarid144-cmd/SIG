export default function TrendChart({ data = [] }) {
  const max = Math.max(...data.map((item) => Number(item.total || 0)), 1);

  return (
    <section className="panel">
      <div className="panel-title">
        <div>
          <p className="eyebrow">Tren</p>
          <h2>Kecelakaan per Bulan</h2>
        </div>
      </div>

      <div className="bar-chart" aria-label="Grafik tren bulanan">
        {data.map((item) => {
          const height = Math.max((Number(item.total || 0) / max) * 100, item.total ? 8 : 2);
          return (
            <div className="bar-item" key={item.bulan}>
              <div className="bar-track">
                <div className="bar-fill" style={{ height: `${height}%` }} title={`${item.bulan}: ${item.total}`} />
              </div>
              <small>{item.bulan}</small>
              <strong>{item.total}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
