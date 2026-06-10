export default function FilterBar({ tahun, setTahun, kecamatanId, setKecamatanId, kecamatanOptions, onRefresh }) {
  return (
    <section className="panel filter-bar">
      <div className="field compact">
        <label>Tahun</label>
        <input
          type="number"
          min="2000"
          max="2100"
          value={tahun}
          onChange={(event) => setTahun(event.target.value)}
          placeholder="Contoh: 2023"
        />
      </div>

      <div className="field wide">
        <label>Kecamatan</label>
        <select value={kecamatanId} onChange={(event) => setKecamatanId(event.target.value)}>
          <option value="">Semua Kecamatan</option>
          {kecamatanOptions.map((item) => (
            <option key={item.id} value={item.id}>{item.nama}</option>
          ))}
        </select>
      </div>

      <button className="primary" onClick={onRefresh}>Tampilkan data</button>
    </section>
  );
}
