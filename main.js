import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Vector as VectorSource} from 'ol/source.js';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj.js';
import GeoJSON from 'ol/format/GeoJSON';
import { Icon, Style } from 'ol/style.js';
import Overlay from 'ol/Overlay.js';

const riau = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: 'data/polygon_riau.json'
  })
});

// Untuk menampilkan titik banjir dan icon
const banjir = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: 'data/banjir.json'
  }),
  style: new Style({
    image: new Icon(({
      anchor: [0.5, 46],
      anchorXUnits: 'flaticon',
      anchorYUnits: 'pixels',
      src: 'icon/flood2.png',
      width: 32,
      height: 32
    }))
  })
});

const container = document.getElementById('popup');
const content_element = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');   

// Create overlay popup
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

const map = new Map({
  target: 'map',
  overlays: [overlay], // Add overlay popup
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    riau,
    banjir // Call data variables
  ],
  view: new View({
    center: fromLonLat([101.438309, 0.510440]),
    zoom: 7
  })
});

// Add overlay after map is initialized
map.addOverlay(overlay);

// JS for click popup
map.on('singleclick', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  if (!feature) {
    return;
  }
  const coordinate = evt.coordinate;
  const content = '<h3>Nama Daerah: ' + feature.get('Nama_Pemetaan') +
    '</h3>' + '<p>Jumlah Korban: ' + feature.get(
      'Jumlah_Korban') + '</p>';
  content_element.innerHTML = content;
  overlay.setPosition(coordinate);
});

// Click handler to hide popup
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};