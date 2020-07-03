import mapboxgl from 'mapbox-gl';
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LogoOverlay from './LogoOverlay';
import Omnibox from './Omnibox';
import SettingsPane from './SettingsPane';
import { normalizeCategory } from './common';
import CONFIG from './config.json';
import { fetchMapData } from './data-loader';
import { THEME } from './Theme';
import taxonomy from './taxonomy.json';
import insightLogo from './img/insight-white.png';
import './App.css';

const COMPANIES_SOURCE = 'companies';
const MAPS = CONFIG['maps'];
const POINT_LAYER = 'energy-companies-point-layer';
const CATEGORIES = new Set(taxonomy.map(c => c.name).map(normalizeCategory));
// Last entry is fallthrough color
const CIRCLE_COLORS =
  taxonomy.map(c => [c.name, c.color]).flat().concat(['#ccc']);

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
  map.setCenter(MAPS[mapId].center);
  map.setZoom(6);

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

const getUrlFragment = () => window.location.hash.replace('#', '');

function useUrlFragment(fragment, callback) {
  useEffect(() => {
    window.location.hash = '#' + fragment;
    const handleHashChange = () => {
      callback(getUrlFragment());
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    }
  });
}

function getInitialMapId() {
  let initialMapId = getUrlFragment();
  if (MAPS.hasOwnProperty(initialMapId)) {
    return initialMapId;
  }
  return CONFIG['defaultMapId'];
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  mainContent: {
    flexGrow: 1,
    position: 'relative',
  },
  mainControlOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 0,
    margin: 0,
    pointerEvents: 'auto',
    display: 'flex',
    flexDirection: 'row',
  },
  insightLogoContainer: {
    padding: 8,
  },
  titleAndSearch: {
    padding: '4px 8px',
  },
  mapTitle: {
    color: '#fff',
    padding: '4px 0px',
    marginBottom: 4,
  },
}));

export default function App() {
  const classes = useStyles();

  const [thisMap, setThisMap] = useState(null);
  const [selectedMapId, setSelectedMapId] = useState(getInitialMapId());
  const [companiesGeojson, setCompaniesGeojson] = useState({});
  const [selectedCategories, setSelectedCategories] = useState(CATEGORIES);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  function loadGeojsonData(mapId) {
    return fetchMapData(mapId)
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
    setSelectedCategories(CATEGORIES);
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
      setMobileDrawerOpen(false);
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

  useUrlFragment(selectedMapId, urlFragment => {
    if (MAPS.hasOwnProperty(urlFragment)) {
      handleSelectMap(urlFragment);
    }
  });

  return (
    <ThemeProvider theme={THEME}>
      <div className={classes.root}>
        <SettingsPane
          selectedMapId={selectedMapId}
          mobileDrawerOpen={mobileDrawerOpen}
          selectedCategories={selectedCategories}
          onToggleOpen={setMobileDrawerOpen}
          onSelectMap={handleSelectMap}
          onSelectAllCategories={handleSelectAllCategories}
          onDeselectAllCategories={handleDeselectAllCategories}
          onToggleCategory={handleToggleCategory} />
        <main className={classes.mainContent}>
          <div id="map-container" />
          <div className="map-overlay">
            <div className="map-overlay-pane">
              <div className={classes.mainControlOverlay}>
                <Hidden smDown implementation="css">
                  <div className={classes.insightLogoContainer}>
                    <img src={insightLogo} alt="aes insight logo" height="80" />
                  </div>
                </Hidden>
                <div className={classes.titleAndSearch}>
                  <div className={classes.mapTitle}>
                    <Typography variant="h1">{MAPS[selectedMapId].title}</Typography>
                  </div>
                  <Omnibox
                    companies={companiesGeojson.features}
                    onSelectCompany={handleSelectCompany}
                    onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />
                  </div>
              </div>
              <LogoOverlay selectedMapId={selectedMapId} />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
