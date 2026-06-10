import { useEffect, useMemo, useState } from 'react';

const kondisiJalanOptions = ['Baik', 'Sedang', 'Rusak', 'Rusak Berat'];
const cuacaOptions = ['Cerah', 'Berawan', 'Hujan', 'Kabut'];
const kendaraanOptions = ['Sepeda Motor', 'Mobil', 'Truk', 'Bus', 'Lainnya'];
const korbanOptions = ['Meninggal Dunia', 'Luka Berat', 'Luka Ringan'];

function toNumberOrUndefined(value) {
  if (value === '' || value === null || value === undefined) return undefined;
  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
}

function nowForDatetimeInput() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function datetimeForInput(value) {
  if (!value) return nowForDatetimeInput();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function emptyForm() {
  return {
    tanggal_kejadian: nowForDatetimeInput(),
    lokasi_nama: '',
    nama_jalan: '',
    kondisi_jalan: 'Baik',
    cuaca: 'Cerah',
    jenis_kendaraan: 'Sepeda Motor',
    jumlah_kendaraan: 1,
    kecepatan_perkiraan: '',
    penyebab: '',
    keterangan: '',
    kecamatan_id: '',
    latitude: '',
    longitude: '',
    korban_nama: '',
    korban_usia: '',
    korban_jenis_kelamin: '',
    korban_kondisi: '',
    korban_keterangan_luka: ''
  };
}

function formFromFeature(feature) {
  const p = feature?.properties || {};
  const coordinates = feature?.geometry?.coordinates || [];
  const korban = Array.isArray(p.korban) ? p.korban[0] : null;

  return {
    tanggal_kejadian: datetimeForInput(p.tanggal_kejadian),
    lokasi_nama: p.lokasi_nama || '',
    nama_jalan: p.nama_jalan || '',
    kondisi_jalan: p.kondisi_jalan && p.kondisi_jalan !== '-' ? p.kondisi_jalan : 'Baik',
    cuaca: p.cuaca && p.cuaca !== '-' ? p.cuaca : 'Cerah',
    jenis_kendaraan: p.jenis_kendaraan && p.jenis_kendaraan !== '-' ? p.jenis_kendaraan : 'Sepeda Motor',
    jumlah_kendaraan: p.jumlah_kendaraan || 1,
    kecepatan_perkiraan: p.kecepatan_perkiraan || '',
    penyebab: p.penyebab || '',
    keterangan: p.keterangan || '',
    kecamatan_id: p.kecamatan_id || '',
    latitude: coordinates[1] ?? '',
    longitude: coordinates[0] ?? '',
    korban_nama: korban?.nama_korban || korban?.nama || '',
    korban_usia: korban?.usia || '',
    korban_jenis_kelamin: korban?.jenis_kelamin || '',
    korban_kondisi: korban?.kondisi || '',
    korban_keterangan_luka: korban?.keterangan_luka || ''
  };
}

export default function AccidentForm({
  kecamatanOptions,
  selectedPosition,
  setSelectedPosition,
  onSubmit,
  onCancelEdit,
  editingFeature,
  loading
}) {
  const [form, setForm] = useState(emptyForm);
  const isEditing = Boolean(editingFeature?.properties?.id);

  useEffect(() => {
    if (!editingFeature) return;
    const nextForm = formFromFeature(editingFeature);
    setForm(nextForm);

    const latitude = Number(nextForm.latitude);
    const longitude = Number(nextForm.longitude);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      setSelectedPosition({ lat: latitude, lng: longitude });
    }
  }, [editingFeature, setSelectedPosition]);

  useEffect(() => {
    if (selectedPosition && !editingFeature) {
      setForm((current) => ({
        ...current,
        latitude: selectedPosition.lat.toFixed(6),
        longitude: selectedPosition.lng.toFixed(6)
      }));
    }
  }, [selectedPosition, editingFeature]);

  const canSubmit = useMemo(() => {
    return form.tanggal_kejadian && form.lokasi_nama && form.latitude && form.longitude;
  }, [form]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm());
    setSelectedPosition(null);
  }

  function handleCancel() {
    resetForm();
    onCancelEdit?.();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const latitude = toNumberOrUndefined(form.latitude);
    const longitude = toNumberOrUndefined(form.longitude);

    const korban = form.korban_kondisi
      ? [{
          nama_korban: form.korban_nama || undefined,
          usia: toNumberOrUndefined(form.korban_usia),
          jenis_kelamin: form.korban_jenis_kelamin || undefined,
          kondisi: form.korban_kondisi,
          keterangan_luka: form.korban_keterangan_luka || undefined
        }]
      : [];

    const payload = {
      tanggal_kejadian: form.tanggal_kejadian,
      lokasi_nama: form.lokasi_nama,
      nama_jalan: form.nama_jalan || undefined,
      kondisi_jalan: form.kondisi_jalan || undefined,
      cuaca: form.cuaca || undefined,
      jenis_kendaraan: form.jenis_kendaraan || undefined,
      jumlah_kendaraan: toNumberOrUndefined(form.jumlah_kendaraan),
      kecepatan_perkiraan: toNumberOrUndefined(form.kecepatan_perkiraan),
      penyebab: form.penyebab || undefined,
      keterangan: form.keterangan || undefined,
      kecamatan_id: toNumberOrUndefined(form.kecamatan_id),
      geom: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      korban
    };

    onSubmit(payload, () => {
      resetForm();
      onCancelEdit?.();
    });
  }

  return (
    <section className="panel" id="form-kecelakaan">
      <div className="panel-title form-heading">
        <div>
          <p className="eyebrow">{isEditing ? 'Edit' : 'Input'}</p>
          <h2>{isEditing ? 'Edit Titik Kecelakaan' : 'Tambah Titik Kecelakaan'}</h2>
        </div>
        {isEditing && (
          <button className="secondary small" type="button" onClick={handleCancel}>
            Batal edit
          </button>
        )}
      </div>

      {isEditing && (
        <div className="notice info form-notice">
          Mode edit aktif untuk data ID {editingFeature.properties.id}. Ubah data lalu klik <strong>Update titik kecelakaan</strong>.
        </div>
      )}

      <form className="accident-form" onSubmit={handleSubmit}>
        <div className="form-grid two">
          <div className="field">
            <label>Tanggal kejadian *</label>
            <input
              type="datetime-local"
              value={form.tanggal_kejadian}
              onChange={(event) => updateField('tanggal_kejadian', event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Kecamatan</label>
            <select value={form.kecamatan_id} onChange={(event) => updateField('kecamatan_id', event.target.value)}>
              <option value="">Belum ditentukan</option>
              {kecamatanOptions.map((item) => (
                <option key={item.id} value={item.id}>{item.nama}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label>Nama lokasi *</label>
          <input
            value={form.lokasi_nama}
            onChange={(event) => updateField('lokasi_nama', event.target.value)}
            placeholder="Contoh: Jl. Lintas Sumatera Km 45"
            required
          />
        </div>

        <div className="field">
          <label>Nama jalan</label>
          <input
            value={form.nama_jalan}
            onChange={(event) => updateField('nama_jalan', event.target.value)}
            placeholder="Nama ruas jalan"
          />
        </div>

        <div className="form-grid three">
          <div className="field">
            <label>Kondisi jalan</label>
            <select value={form.kondisi_jalan} onChange={(event) => updateField('kondisi_jalan', event.target.value)}>
              {kondisiJalanOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Cuaca</label>
            <select value={form.cuaca} onChange={(event) => updateField('cuaca', event.target.value)}>
              {cuacaOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Jenis kendaraan</label>
            <select value={form.jenis_kendaraan} onChange={(event) => updateField('jenis_kendaraan', event.target.value)}>
              {kendaraanOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>

        <div className="form-grid two">
          <div className="field">
            <label>Jumlah kendaraan</label>
            <input
              type="number"
              min="1"
              value={form.jumlah_kendaraan}
              onChange={(event) => updateField('jumlah_kendaraan', event.target.value)}
            />
          </div>
          <div className="field">
            <label>Kecepatan perkiraan km/jam</label>
            <input
              type="number"
              min="0"
              value={form.kecepatan_perkiraan}
              onChange={(event) => updateField('kecepatan_perkiraan', event.target.value)}
            />
          </div>
        </div>

        <div className="form-grid two">
          <div className="field">
            <label>Latitude *</label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(event) => {
                updateField('latitude', event.target.value);
                const lat = Number(event.target.value);
                const lng = Number(form.longitude || 0);
                if (Number.isFinite(lat) && Number.isFinite(lng)) setSelectedPosition({ lat, lng });
              }}
              placeholder="Klik peta atau isi manual"
              required
            />
          </div>
          <div className="field">
            <label>Longitude *</label>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(event) => {
                updateField('longitude', event.target.value);
                const lat = Number(form.latitude || 0);
                const lng = Number(event.target.value);
                if (Number.isFinite(lat) && Number.isFinite(lng)) setSelectedPosition({ lat, lng });
              }}
              placeholder="Klik peta atau isi manual"
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Penyebab</label>
          <textarea value={form.penyebab} onChange={(event) => updateField('penyebab', event.target.value)} rows="2" />
        </div>

        <div className="field">
          <label>Keterangan</label>
          <textarea value={form.keterangan} onChange={(event) => updateField('keterangan', event.target.value)} rows="2" />
        </div>

        <div className="sub-form">
          <h3>Data Korban Opsional</h3>
          <div className="form-grid two">
            <div className="field">
              <label>Nama korban</label>
              <input value={form.korban_nama} onChange={(event) => updateField('korban_nama', event.target.value)} />
            </div>
            <div className="field">
              <label>Usia</label>
              <input type="number" min="0" max="120" value={form.korban_usia} onChange={(event) => updateField('korban_usia', event.target.value)} />
            </div>
          </div>
          <div className="form-grid two">
            <div className="field">
              <label>Jenis kelamin</label>
              <select value={form.korban_jenis_kelamin} onChange={(event) => updateField('korban_jenis_kelamin', event.target.value)}>
                <option value="">-</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div className="field">
              <label>Kondisi korban</label>
              <select value={form.korban_kondisi} onChange={(event) => updateField('korban_kondisi', event.target.value)}>
                <option value="">Tidak ada data korban</option>
                {korbanOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Keterangan luka</label>
            <textarea value={form.korban_keterangan_luka} onChange={(event) => updateField('korban_keterangan_luka', event.target.value)} rows="2" />
          </div>
        </div>

        <div className="form-buttons">
          <button className="primary full" type="submit" disabled={!canSubmit || loading}>
            {loading ? 'Menyimpan...' : isEditing ? 'Update titik kecelakaan' : 'Simpan titik kecelakaan'}
          </button>
          {isEditing && (
            <button className="secondary full" type="button" onClick={handleCancel} disabled={loading}>
              Batal
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
