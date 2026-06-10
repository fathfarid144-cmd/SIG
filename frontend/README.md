# Sistem Monitoring Kecelakaan Lalu Lintas - Lampung Selatan

# Frontend (React + Leaflet)

## Fitur sesuai ketentuan proyek

- Peta interaktif dengan `react-leaflet`.
- Layer polygon batas kecamatan dari endpoint GeoJSON.
- Marker titik kecelakaan dalam bentuk `CircleMarker` merah.
- Popup detail saat marker kecelakaan atau polygon kecamatan diklik.
- Filter tahun dan kecamatan.
- Pencarian pada tabel titik kecelakaan.
- Form tambah data kecelakaan.
- Form edit data kecelakaan melalui tombol `Edit` pada tabel.
- Hapus data kecelakaan melalui tombol `Hapus` pada tabel.
- Cek area rawan kecelakaan berdasarkan titik yang diklik di peta.
- Tampilan responsif untuk desktop dan layar kecil.

## Menjalankan frontend

```bash
npm install
copy .env.example .env
npm run dev
```

Isi `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Backend harus berjalan di `http://localhost:8000`.

## Catatan integrasi

Default tahun menggunakan `2023` karena data contoh/seed backend berada pada tahun 2023. Jika endpoint titik kecelakaan backend belum stabil, frontend tetap mencoba memuat titik dari endpoint lain atau fallback data.


## Catatan fitur area rawan

Tombol **Cek area rawan** sengaja dibuat aktif setelah pengguna klik titik/lokasi pada peta. 
Alurnya: klik lokasi pada peta, lalu tekan **Cek area rawan** untuk menjalankan analisis pada radius 1 km dari titik tersebut.
