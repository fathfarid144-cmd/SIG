import { formatNumber } from '../utils/formatters.js';

export default function StatsCards({ ringkasan }) {
  const cards = [
    { label: 'Total Kejadian', value: ringkasan?.total_kejadian || 0 },
    { label: 'Total Korban', value: ringkasan?.total_korban || 0 },
    { label: 'Meninggal Dunia', value: ringkasan?.total_meninggal || 0 },
    { label: 'Luka Berat', value: ringkasan?.total_luka_berat || 0 },
    { label: 'Luka Ringan', value: ringkasan?.total_luka_ringan || 0 }
  ];

  return (
    <section className="stats-grid">
      {cards.map((card) => (
        <article className="stat-card" key={card.label}>
          <span>{card.label}</span>
          <strong>{formatNumber(card.value)}</strong>
        </article>
      ))}
    </section>
  );
}
