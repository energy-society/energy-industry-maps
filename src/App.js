import mapboxgl from 'mapbox-gl';
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LogoOverlay from './LogoOverlay';
import Omnibox from './Omnibox';
import SettingsPane from './SettingsPane';
import { getAllCategories } from './common';
import CONFIG from './config.json';
import { fetchMapData } from './data-loader';
import { THEME } from './Theme';
import insightLogo from './img/insight-white.png';
import './App.css';

const COMPANIES_SOURCE = 'companies';
const MAPS = CONFIG['maps'];
const POINT_LAYER = 'energy-companies-point-layer';

// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN;
mapboxgl.accessToken='pk.eyJ1IjoidG90b3JvLWRha2UiLCJhIjoiY2tiNzJuZmQ3MDFudDJxa2N1ZG91YzBzciJ9.5qJpYzti2W7avnuM9rCiKA'

/** @return {html code for the popup } */
function getPopupContent(props) {
  const categoryInfo = ['tax1', 'tax2', 'tax3']
    .map(k => props[k])
    .filter(s => s).join(", ");
  var extraNotes = "";
  if (props.hasOwnProperty("notes") && props["notes"] !== "") {
    extraNotes = `Focus: <span>${props['notes']}</span><br />`;
  }
  return `
    <div class="popup" style = "color: 626262">
      <h3 class="company-name">
        <a href=${props['website']} class="popup-link" target="blank">${props['company']}</a>
      </h3>
      Sector(s): <span class="category-info">${categoryInfo}</span><br />
      City: <span class="city-info">${props['city']}</span><br />
      ${extraNotes}
    </div>`;
}

function clearPopups() {
  // Check if there is already a popup on the map and if so, remove it
  // This prevents multiple popups in the case of overlapping circles
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();
}

function displayPopup(map, feature) {
  // clears the open popup and creates the new one 
  const coordinates = feature.geometry.coordinates.slice();
  clearPopups();
  new mapboxgl.Popup({})
    .setLngLat(coordinates)
    .setHTML(getPopupContent(feature.properties))
    .setMaxWidth("600px")
    .addTo(map);
}
//79ddf2

function populateMapData(map, mapId, mapData) {
  // adds the data to the map
  // sets correct initial view of the map
  map.setCenter(MAPS[mapId].center);
  map.setZoom(6);

  mapData.then(data => {
    map.addSource(COMPANIES_SOURCE, {
      type: 'geojson',
      data: data['geojson'],
    });

    // Last entry is fallthrough color
    let circleColors =
      data['taxonomy'].map(c => [c.name, c.color]).flat().concat(['#ccc']);

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
        'circle-color': ['match', ['get', 'tax1']].concat(circleColors),
        'circle-stroke-color': '#000',
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
      zoom: MAPS[mapId].flyToZoom || 8,
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

/** @return {mapId} */
function getInitialMapId() {
  let initialMapId = getUrlFragment();
  if (MAPS.hasOwnProperty(initialMapId)) {
    return initialMapId;
  }
  return CONFIG['defaultMapId'];
}

// sets the styles for the material-ui components
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  mainContent: {
    flexGrow: 1,
    position: 'relative',
  },
  mapContainer: {
    height: '100vh',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#333',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 0,
    pointerEvents: 'none',
  },
  mapOverlayInner: {
    display: 'block',
    position: 'relative',
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
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
  mainControlOverlayShifted: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 0,
    margin: 0,
    pointerEvents: 'auto',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 320,
  },
  insightLogoContainer: {
    padding: 8,
    marginTop: 23,
    marginLeft: 8,
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

/** @return {html code for the app } */
export default function App() {
  const classes = useStyles();

  const [thisMap, setThisMap] = useState(null);
  const [selectedMapId, setSelectedMapId] = useState(getInitialMapId());
  const [taxonomy, setTaxonomy] = useState([]);
  const [companiesGeojson, setCompaniesGeojson] = useState({});
  const [selectedCategories, setSelectedCategories] = useState(new Set([]));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);


  function handleToggleCategory(e) {
    // called when categories are individually changed
    var s = new Set(selectedCategories);
    if (s.has(e.target.name)) {
      s.delete(e.target.name);
    } else {
      s.add(e.target.name);
    }
    setSelectedCategories(s);
  }

  function handleSelectAllCategories(txnomy) {
    // takes argument instead of using taxonomy directly because taxonomy
    // state update can lag behind
    setSelectedCategories(getAllCategories(txnomy));
  }

  function handleDeselectAllCategories() {
    setSelectedCategories(new Set());
  }

  function handleSelectCompany(e) {
    // called when you select from the search bar
    const selectedCompany = companiesGeojson.features[e.idx];
    displayPopup(thisMap, selectedCompany);
    thisMap.flyTo({
      center: selectedCompany.geometry.coordinates,
      zoom: 14,
    });
  }

  function handleSelectMap(mapId) {
    // called when you change the mapId
    if (mapId !== selectedMapId) {
      clearPopups();
      thisMap.removeLayer(POINT_LAYER);
      thisMap.removeSource(COMPANIES_SOURCE);
      setSelectedMapId(mapId);
      setMobileDrawerOpen(false);
      let mapData = fetchMapData(mapId);
      mapData.then(setUpMap);
      populateMapData(thisMap, mapId, mapData);
      handleSelectAllCategories(taxonomy);
    }
  }

  function handleShift() {
    // called when you open the mobile drawer
    if (!mobileDrawerOpen) {
      return classes.mainControlOverlay;
    } else {
      return classes.mainControlOverlayShifted;
    }
  }

  function setUpMap(data) {
    // changes the data in the map
    setTaxonomy(data['taxonomy']);
    setCompaniesGeojson(data['geojson']);
    // initially select all categories
    handleSelectAllCategories(data['taxonomy']);
  }

  function initMap() {
    // creates the map
    let map = new mapboxgl.Map({
      container: "map-container",
      style: 'mapbox://styles/mapbox/dark-v10',
      attributionControl: false,
      center: MAPS[selectedMapId].center,
      zoom: 6,
      minZoom: 6,
    });
    let mapData = fetchMapData(selectedMapId);
    mapData.then(setUpMap);

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
        taxonomy={taxonomy}
        onSelectAllCategories={() => handleSelectAllCategories(taxonomy)}
        onDeselectAllCategories={handleDeselectAllCategories}
        onToggleCategory={handleToggleCategory} />
      <main className={classes.mainContent}>
        <div id="map-container" className={classes.mapContainer} />
          <LogoOverlay selectedMapId={selectedMapId} />
        <div className={classes.mapOverlay}>
          <div className={classes.mapOverlayInner}>
            <div className={handleShift()}>
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
); }