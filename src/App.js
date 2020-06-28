import mapboxgl from 'mapbox-gl';
import React from 'react';
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

function compileCategoryList(companiesGeojson) {
  const c = new Set(companiesGeojson.features.map(f => f.properties['tax1']));
  return Object.values(Array.from(c)).sort();
}

class App extends React.Component {
  map;

  state = {
    selectedMapId: 'sf', // FIXME (shouldn't need a default)
    companiesGeojson: {},
    selectedCategories: new Set(),
    settingsPaneOpen: false,
  };

  constructor(props) {
    super(props);
    this.getSelectedMap = this.getSelectedMap.bind(this);
    this.displayPopup = this.displayPopup.bind(this);
    this.populateMapData = this.populateMapData.bind(this);
    this.handleToggleCategory = this.handleToggleCategory.bind(this);
    this.handleSelectAllCategories = this.handleSelectAllCategories.bind(this);
    this.handleDeselectAllCategories = this.handleDeselectAllCategories.bind(this);
    this.handleSelectCompany = this.handleSelectCompany.bind(this);
    this.handleSelectMap = this.handleSelectMap.bind(this);
  }

  getSelectedMap() {
    return MAPS[this.state.selectedMapId];
  }

  displayPopup(feature) {
    const coordinates = feature.geometry.coordinates.slice();
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    // Check if there is already a popup on the map and if so, remove it
    // This prevents multiple popups in the case of overlapping circles
    if (popUps[0]) popUps[0].remove();

    new mapboxgl.Popup({})
      .setLngLat(coordinates)
      .setHTML(getPopupContent(feature.properties))
      .setMaxWidth("300px")
      .addTo(this.map);
  }

  populateMapData(mapId) {
    const selectedMap = MAPS[mapId];
    const geojsonLoaded = loadGeojsonData(selectedMap.datasetId)
      .then(companiesGeojson => {
        this.setState({
          companiesGeojson: companiesGeojson,
          categories: compileCategoryList(companiesGeojson),
        });

        // initially select all categories
        this.handleSelectAllCategories();

        return companiesGeojson;
    });

    geojsonLoaded.then(companiesGeojson => {
      this.map.addSource(COMPANIES_SOURCE, {
        type: 'geojson',
        data: companiesGeojson,
      });

      this.map.addLayer({
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

      this.map.on('mouseenter', POINT_LAYER, (e) => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', POINT_LAYER, () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('click', POINT_LAYER, e => this.displayPopup(e.features[0]));

      this.map.flyTo({
        center: selectedMap.flyTo,
        zoom: 8,
        speed: 0.5,
      });
    });
  }

  handleToggleCategory(e) {
    var s = this.state.selectedCategories;
    if (s.has(e.target.name)) {
      s.delete(e.target.name);
    } else {
      s.add(e.target.name);
    }
    this.setState({selectedCategories: s});
  }

  handleSelectAllCategories() {
    let normalized = DISPLAY_CATEGORIES.map(normalizeCategory);
    this.setState({selectedCategories: new Set(normalized)});
  }

  handleDeselectAllCategories() {
    this.setState({selectedCategories: new Set()});
  }

  handleSelectCompany(e) {
    const selectedCompany = this.state.companiesGeojson.features.find(
        feature => feature.properties.company === e);
    this.displayPopup(selectedCompany);
    this.map.flyTo({
      center: selectedCompany.geometry.coordinates,
      zoom: 14,
    });
  }

  handleSelectMap(mapId) {
    if (mapId !== this.state.selectedMapId) {
      this.map.removeLayer(POINT_LAYER);
      this.map.removeSource(COMPANIES_SOURCE);
      this.setState({
        selectedMapId: mapId,
        settingsPaneOpen: false,
      });
      this.populateMapData(mapId);
    }
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: this.getSelectedMap().center,
      zoom: 6,
      minZoom: 6,
    });

    this.map.on('move', () => {
      this.setState({
        lng: this.map.getCenter().lng.toFixed(4),
        lat: this.map.getCenter().lat.toFixed(4),
        zoom: this.map.getZoom().toFixed(2)
      });
    });

    this.map.on('load', () => {
      this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
      this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      this.populateMapData(this.state.selectedMapId);
    });
  }

  componentDidUpdate() {
    if (this.map.getLayer(POINT_LAYER)) {
      var filters = ["any"];
      // If ANY of the 3 taxonomies for a company are selected, it should be
      // displayed on the map.
      const selectedCategories = this.state.selectedCategories;
      [1, 2, 3].forEach(i => {
        var filter = ["in", `tax${i}sanitized`];
        selectedCategories.forEach(category => filter.push(category));
        filters.push(filter);
      });
      this.map.setFilter(POINT_LAYER, filters);
    }
  }

  render() {
    return (
      <div id="app-container">
        <SettingsPane
          onToggleOpen={isOpen => this.setState({settingsPaneOpen: isOpen})}
          onSelectMap={this.handleSelectMap}
          selectedMapId={this.state.selectedMapId}
          settingsPaneOpen={this.state.settingsPaneOpen}
          selectedCategories={this.state.selectedCategories}
          onSelectAllCategories={this.handleSelectAllCategories}
          onDeselectAllCategories={this.handleDeselectAllCategories}
          onToggleCategory={this.handleToggleCategory} />
        <div ref={el => this.mapContainer = el} id="map-container" />
        <div className="map-overlay">
          <div className="map-title-and-search">
            <div className="map-title">{this.getSelectedMap().title}</div>
            <Omnibox
              companies={this.state.companiesGeojson.features}
              onSelectCompany={this.handleSelectCompany}
              onOpenSettingsPane={() => this.setState({settingsPaneOpen: true})} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
