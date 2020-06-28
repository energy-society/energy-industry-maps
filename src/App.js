import mapboxgl from 'mapbox-gl';
import React, { useState, useEffect } from 'react';
import Omnibox from './Omnibox.js';
import SettingsPane from "./SettingsPane.js";
import { CIRCLE_COLORS, DISPLAY_CATEGORIES } from './taxonomy-colors.js';
import { loadGeojsonData } from './data-loader.js';
import { normalizeCategory } from './common.js';
import { MAPS } from './config.js';
import './App.css';

const COMPANIES_SOURCE = 'companies';
const POINT_LAYER = 'energy-companies-point-layer';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN;

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

export default function App() {
  const [thisMap, setThisMap] = useState(null);
  const [selectedMapId, setSelectedMapId] = useState('sf'); // FIXME: no default
  const [companiesGeojson, setCompaniesGeojson] = useState({});
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [settingsPaneOpen, setSettingsPaneOpen] = useState(false);

  function displayPopup(map, feature) {
    const coordinates = feature.geometry.coordinates.slice();
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    // Check if there is already a popup on the map and if so, remove it
    // This prevents multiple popups in the case of overlapping circles
    if (popUps[0]) popUps[0].remove();

    new mapboxgl.Popup({})
      .setLngLat(coordinates)
      .setHTML(getPopupContent(feature.properties))
      .setMaxWidth("300px")
      .addTo(map);
  }

  function populateMapData(m, mapId) {
    const selectedMap = MAPS[mapId];
    const geojsonLoaded = loadGeojsonData(selectedMap.datasetId)
      .then(geojson => {
        setCompaniesGeojson(geojson);
        // initially select all categories
        handleSelectAllCategories();
        return geojson;
    });

    geojsonLoaded.then(companiesGeojson => {
      m.addSource(COMPANIES_SOURCE, {
        type: 'geojson',
        data: companiesGeojson,
      });

      m.addLayer({
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

      m.on('mouseenter', POINT_LAYER, (e) => {
        m.getCanvas().style.cursor = 'pointer';
      });

      m.on('mouseleave', POINT_LAYER, () => {
        m.getCanvas().style.cursor = '';
      });

      m.on('click', POINT_LAYER, e => displayPopup(m, e.features[0]));

      m.flyTo({
        center: selectedMap.flyTo,
        zoom: 8,
        speed: 0.5,
      });
    });
  }

  function handleToggleCategory(e) {
    var s = selectedCategories;
    if (s.has(e.target.name)) {
      s.delete(e.target.name);
    } else {
      s.add(e.target.name);
    }
    setSelectedCategories(s);
  }

  function handleSelectAllCategories() {
    let normalized = DISPLAY_CATEGORIES.map(normalizeCategory);
    setSelectedCategories(new Set(normalized));
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
      thisMap.removeLayer(POINT_LAYER);
      thisMap.removeSource(COMPANIES_SOURCE);
      setSelectedMapId(mapId);
      setSettingsPaneOpen(false);
      populateMapData(thisMap, mapId);
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

    map.on('load', () => {
      map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      populateMapData(map, selectedMapId);
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
    </div>
  );
}
