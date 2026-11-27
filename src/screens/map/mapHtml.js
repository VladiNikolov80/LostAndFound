import { CARTO_API_KEY } from '../../config/maps';
import { colors } from '../../constants/colors';

// Прави малка уеб страница с Leaflet карта и точките на обявите.
// Тя се показва в WebView на екрана „Карта“.
//
// Плочките на картата са от OpenStreetMap през CARTO – безплатни, с безплатен API ключ.
// Когато натиснеш „Отвори“ в балончето, страницата праща id на обявата
// обратно към приложението с window.ReactNativeWebView.postMessage().
export function buildMapHtml(markers) {
  // „<“ се заменя, за да не може заглавие на обява да затвори <script> тага.
  const data = JSON.stringify(markers).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { height: 100%; margin: 0; }
    body { font-family: -apple-system, Roboto, sans-serif; }
    .popup-title { font-size: 15px; font-weight: 700; color: ${colors.ink}; margin-bottom: 2px; }
    .popup-place { font-size: 13px; color: ${colors.muted}; margin-bottom: 8px; }
    .popup-button {
      display: block; width: 100%; padding: 10px 0; border: 0; border-radius: 10px;
      background: ${colors.ink}; color: #fff; font-size: 14px; font-weight: 700;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var markers = ${data};
    var map = L.map('map', { zoomControl: false });
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${encodeURIComponent(CARTO_API_KEY)}', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    function popupContent(m) {
      // Текстът се слага с textContent, не като HTML – безопасно за всякакви заглавия.
      var box = document.createElement('div');
      var title = document.createElement('div');
      title.className = 'popup-title';
      title.textContent = (m.type === 'lost' ? 'Изгубено: ' : 'Намерено: ') + m.title;
      var place = document.createElement('div');
      place.className = 'popup-place';
      place.textContent = m.place || '';
      var button = document.createElement('button');
      button.className = 'popup-button';
      button.textContent = 'Отвори обявата';
      button.onclick = function () { window.ReactNativeWebView.postMessage(m.id); };
      box.appendChild(title);
      box.appendChild(place);
      box.appendChild(button);
      return box;
    }

    var points = [];
    markers.forEach(function (m) {
      var color = m.type === 'lost' ? '${colors.lost}' : '${colors.found}';
      L.circleMarker([m.lat, m.lng], {
        radius: 11, color: '#ffffff', weight: 3, fillColor: color, fillOpacity: 1
      }).addTo(map).bindPopup(popupContent(m));
      points.push([m.lat, m.lng]);
    });

    if (points.length > 0) {
      // Мащабът се избира така, че всички точки да се виждат.
      map.fitBounds(points, { padding: [60, 60], maxZoom: 15 });
    } else {
      // Няма точки – показваме България.
      map.setView([42.7, 25.3], 7);
    }
  </script>
</body>
</html>`;
}
