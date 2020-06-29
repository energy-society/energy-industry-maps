import mapboxgl from 'mapbox-gl';
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import Omnibox from './Omnibox';
import SettingsPane from './SettingsPane';
import { CIRCLE_COLORS, DISPLAY_CATEGORIES } from './taxonomy-colors';
import { normalizeCategory } from './common';
import { MAPS } from './config';
import { THEME } from './Theme';
import './App.css';

const COMPANIES_SOURCE = 'companies';
const POINT_LAYER = 'energy-companies-point-layer';
const DATASETS_ENDPOINT = "https://api.mapbox.com/datasets/v1";
const USER = process.env.REACT_APP_MAPBOX_USER;
const ALL_CATEGORIES = new Set(DISPLAY_CATEGORIES.map(normalizeCategory));

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN;

function fetchMapData(datasetId) {
  let url = `${DATASETS_ENDPOINT}/${USER}/${datasetId}/features?access_token=${mapboxgl.accessToken}`;
  return fetch(url)
    .then(response => response.json())
    .then(parsed => {
      parsed.features.forEach(feature => {
        // canonicalize categories for use as labels
        ['tax1', 'tax2', 'tax3'].forEach(label => {
          const newprop = `${label}sanitized`;
          feature.properties[newprop] = normalizeCategory(feature.properties[label]);
        })
      });
      return parsed;
    });
}

function getPopupContent(props) {
  const categoryInfo = ['tax1', 'tax2', 'tax3']
    .map(k => props[k])
    .filter(s => s).join(" | ");
  return `
    <div class="popup">
      <h3 class="company-name">${props['company']}</h3>
      <span class="category-info">${categoryInfo}</span><br />
      <span class="city-info">${props['city']}</span><br />
      <span>
        <a href=${props['website']} target="blank">${props['website']}</a>
      </span>
    </div>`;
}

function clearPopups() {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  // Check if there is already a popup on the map and if so, remove it
  // This prevents multiple popups in the case of overlapping circles
  if (popUps[0]) popUps[0].remove();
}

function displayPopup(map, feature) {
  const coordinates = feature.geometry.coordinates.slice();
  clearPopups();
  new mapboxgl.Popup({})
    .setLngLat(coordinates)
    .setHTML(getPopupContent(feature.properties))
    .setMaxWidth("300px")
    .addTo(map);
}

function populateMapData(map, mapId, mapData) {
  mapData.then(data => {
    map.addSource(COMPANIES_SOURCE, {
      type: 'geojson',
      data: data,
    });

    map.addLayer({
      id: POINT_LAYER,
      type: 'circle',
      source: COMPANIES_SOURCE,
      paint: {
        // make circles larger as the user zooms
        'circle-radius': {
          stops: [[7, 5], [14, 12], [20, 50]]
        },
        'circle-opacity': 0.85,
        // color circles by primary category
        'circle-color': ['match', ['get', 'tax1']].concat(CIRCLE_COLORS),
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 0.4,
      }
    });

    map.on('mouseenter', POINT_LAYER, (e) => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', POINT_LAYER, () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('click', POINT_LAYER, e => displayPopup(map, e.features[0]));

    map.flyTo({
      center: MAPS[mapId].flyTo,
      zoom: 8,
      speed: 0.5,
    });
  });
}

export default function App() {
  const [thisMap, setThisMap] = useState(null);
  const [selectedMapId, setSelectedMapId] = useState('sf'); // FIXME: no default
  const [companiesGeojson, setCompaniesGeojson] = useState({});
  const [selectedCategories, setSelectedCategories] = useState(ALL_CATEGORIES);
  const [settingsPaneOpen, setSettingsPaneOpen] = useState(false);

  function loadGeojsonData(mapId) {
    return fetchMapData(MAPS[mapId].datasetId)
      .then(geojson => {
        setCompaniesGeojson(geojson);
        // initially select all categories
        handleSelectAllCategories();
        return geojson;
    });
  }

  function handleToggleCategory(e) {
    var s = new Set(selectedCategories);
    if (s.has(e.target.name)) {
      s.delete(e.target.name);
    } else {
      s.add(e.target.name);
    }
    setSelectedCategories(s);
  }

  function handleSelectAllCategories() {
    setSelectedCategories(ALL_CATEGORIES);
  }

  function handleDeselectAllCategories() {
    setSelectedCategories(new Set());
  }

  function handleSelectCompany(e) {
    const selectedCompany = companiesGeojson.features.find(
        feature => feature.properties.company === e);
    displayPopup(thisMap, selectedCompany);
    thisMap.flyTo({
      center: selectedCompany.geometry.coordinates,
      zoom: 14,
    });
  }

  function handleSelectMap(mapId) {
    if (mapId !== selectedMapId) {
      clearPopups();
      thisMap.removeLayer(POINT_LAYER);
      thisMap.removeSource(COMPANIES_SOURCE);
      setSelectedMapId(mapId);
      setSettingsPaneOpen(false);
      populateMapData(thisMap, mapId, loadGeojsonData(mapId));
    }
  }

  function initMap() {
    let map = new mapboxgl.Map({
      container: "map-container",
      style: 'mapbox://styles/mapbox/dark-v10',
      center: MAPS[selectedMapId].center,
      zoom: 6,
      minZoom: 6,
    });
    let mapData = loadGeojsonData(selectedMapId);

    map.on('load', () => {
      map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      populateMapData(map, selectedMapId, mapData);
    });
    setThisMap(map);
  }

  useEffect(() => {
    if (!thisMap) {
      initMap();
    }

    if (thisMap) {
      if (thisMap.getLayer(POINT_LAYER)) {
        var filters = ["any"];
        // If ANY of the 3 taxonomies for a company are selected, it should be
        // displayed on the map.
        [1, 2, 3].forEach(i => {
          var filter = ["in", `tax${i}sanitized`];
          selectedCategories.forEach(category => filter.push(category));
          filters.push(filter);
        });
        thisMap.setFilter(POINT_LAYER, filters);
      }
    }
  });

  return (
    <div id="app-container">
      <ThemeProvider theme={THEME}>
        <SettingsPane
          selectedMapId={selectedMapId}
          settingsPaneOpen={settingsPaneOpen}
          selectedCategories={selectedCategories}
          onToggleOpen={setSettingsPaneOpen}
          onSelectMap={handleSelectMap}
          onSelectAllCategories={handleSelectAllCategories}
          onDeselectAllCategories={handleDeselectAllCategories}
          onToggleCategory={handleToggleCategory} />
        <div id="map-container" />
        <div className="map-overlay">
          <div className="map-title-and-search">
            <div className="map-title">{MAPS[selectedMapId].title}</div>
            <Omnibox
              companies={companiesGeojson.features}
              onSelectCompany={handleSelectCompany}
              onOpenSettingsPane={() => setSettingsPaneOpen(true)} />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
