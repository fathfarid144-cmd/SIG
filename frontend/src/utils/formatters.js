export function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(Number(value || 0));
}

export function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export function getFeatureLatLng(feature) {
  const coordinates = feature?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  return {
    lat: Number(coordinates[1]),
    lng: Number(coordinates[0])
  };
}
