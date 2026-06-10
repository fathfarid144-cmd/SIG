import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import {
  Circle,
  CircleMarker,
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents
} from 'react-leaflet';
import { formatDateTime } from '../utils/formatters.js';

const selectedIcon = L.divIcon({
  className: 'selected-location-icon',
  html: '<span></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function safeLatLngFromFeature(feature) {
  const coordinates = feature?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

  let lng = Number(coordinates[0]);
  let lat = Number(coordinates[1]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  // Jika koordinat kebalik [lat, lng], perbaiki untuk area Lampung Selatan.
  if (lng >= -7 && lng <= -4 && lat >= 104 && lat <= 107) {
    const temp = lng;
    lng = lat;
    lat = temp;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return [lat, lng];
}

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(event) {
      onMapClick({ lat: event.latlng.lat, lng: event.latlng.lng });
    }
  });
  return null;
}

function FitMapBounds({ kecamatanGeojson, accidentMarkers }) {
  const map = useMap();

  useEffect(() => {
    const group = L.featureGroup();

    if (kecamatanGeojson?.features?.length) {
      L.geoJSON(kecamatanGeojson).eachLayer((layer) => group.addLayer(layer));
    }

    for (const marker of accidentMarkers || []) {
      group.addLayer(L.marker(marker.position));
    }

    if (group.getLayers().length === 0) return;

    const bounds = group.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.35), { maxZoom: 14, animate: false });
    }
  }, [map, kecamatanGeojson, accidentMarkers]);

  return null;
}

function PopupBody({ feature }) {
  const p = feature?.properties || {};

  return (
    <div className="map-popup">
      <strong>{p.lokasi_nama || 'Lokasi tidak diketahui'}</strong>
      <span>{p.nama_jalan || '-'}</span>
      <hr />
      <p><b>Tanggal:</b> {formatDateTime(p.tanggal_kejadian)}</p>
      <p><b>Kecamatan:</b> {p.kecamatan_nama || '-'}</p>
      <p><b>Cuaca:</b> {p.cuaca || '-'}</p>
      <p><b>Kondisi jalan:</b> {p.kondisi_jalan || '-'}</p>
      <p><b>Total korban:</b> {p.total_korban ?? '-'}</p>
      {p.sumber_data?.includes('fallback') && <p><b>Sumber:</b> data contoh frontend</p>}
    </div>
  );
}

export default function MapView({
  kecamatanGeojson,
  kecelakaanGeojson,
  selectedPosition,
  setSelectedPosition,
  blackSpot,
  onSearchBlackSpot
}) {
  const center = [-5.75, 105.52];

  const kecamatanKey = useMemo(
    () => `kecamatan-${(kecamatanGeojson?.features || []).map((f) => f.properties?.id).join('-')}`,
    [kecamatanGeojson]
  );

  const accidentMarkers = useMemo(() => (
    (kecelakaanGeojson?.features || [])
      .map((feature, index) => ({
        id: feature.properties?.id ?? index,
        feature,
        position: safeLatLngFromFeature(feature)
      }))
      .filter((item) => item.position)
  ), [kecelakaanGeojson]);

  return (
    <section className="panel map-panel">
      <div className="panel-title map-title">
        <div>
          <p className="eyebrow">Peta</p>
          <h2>Sebaran Titik Kecelakaan</h2>
        </div>
        <div className="map-actions">
          <span className="marker-legend"><i></i> Titik kecelakaan</span>
          <button
            className="secondary"
            onClick={onSearchBlackSpot}
            disabled={!selectedPosition}
            title={!selectedPosition ? 'Klik lokasi di peta terlebih dahulu' : 'Cek area rawan dari titik terpilih'}
          >
            Cek area rawan
          </button>
        </div>
      </div>

      <MapContainer center={center} zoom={10} scrollWheelZoom className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitMapBounds kecamatanGeojson={kecamatanGeojson} accidentMarkers={accidentMarkers} />
        <ClickHandler onMapClick={setSelectedPosition} />

        {kecamatanGeojson?.features?.length > 0 && (
          <GeoJSON
            key={kecamatanKey}
            data={kecamatanGeojson}
            style={() => ({
              color: '#1f5f9f',
              weight: 2,
              fillColor: '#8bb8dd',
              fillOpacity: 0.06
            })}
            onEachFeature={(feature, layer) => {
              const p = feature.properties || {};
              layer.bindPopup(`
                <div class="map-popup">
                  <strong>${p.nama || 'Kecamatan'}</strong>
                  <p><b>Kode:</b> ${p.kode_kecamatan || '-'}</p>
                  <p><b>Luas:</b> ${p.luas_km2 || '-'} km²</p>
                  <p><b>Penduduk:</b> ${p.jumlah_penduduk || '-'}</p>
                </div>
              `);
            }}
          />
        )}

        {accidentMarkers.map((marker) => (
          <CircleMarker
            key={`accident-${marker.id}`}
            center={marker.position}
            radius={11}
            pathOptions={{
              color: '#ffffff',
              weight: 4,
              fillColor: '#dc2626',
              fillOpacity: 1,
              opacity: 1
            }}
          >
            <Popup>
              <PopupBody feature={marker.feature} />
            </Popup>
          </CircleMarker>
        ))}

        {selectedPosition && (
          <Marker position={[selectedPosition.lat, selectedPosition.lng]} icon={selectedIcon}>
            <Popup>
              Titik dipilih<br />
              Lat: {selectedPosition.lat.toFixed(6)}<br />
              Lng: {selectedPosition.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}

        {blackSpot?.pusat && (
          <Circle
            center={[blackSpot.pusat.latitude, blackSpot.pusat.longitude]}
            radius={Number(blackSpot.radius_meter || 1000)}
            pathOptions={{ color: '#f97316', fillColor: '#fb923c', fillOpacity: 0.10 }}
          />
        )}
      </MapContainer>

      <div className="map-footer">
        <span>
          {accidentMarkers.length > 0
            ? `${accidentMarkers.length} titik kecelakaan ditampilkan pada peta.`
            : 'Tidak ada titik kecelakaan pada filter yang dipilih.'}
        </span>
        {blackSpot && (
          <strong>{blackSpot.total_ditemukan || 0} kejadian ditemukan dalam radius {blackSpot.radius_meter} meter.</strong>
        )}
      </div>
    </section>
  );
}
