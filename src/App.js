import React from 'react';
import mapboxgl from 'mapbox-gl';
import CompanyFilter from './CompanyFilter.js';
import CompanySelector from './CompanySelector.js';
import { CIRCLE_COLORS, DISPLAY_CATEGORIES } from './taxonomy-colors.js';
import { loadGeojsonData } from './data-loader.js';
import { normalizeCategory } from './common.js';
import './App.css';

const POINT_LAYER = 'energy-companies-point-layer'

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
      <span><a href=${props['website']} target="blank">${props['website']}</a></span>
    </div>`;
}

function compileCategoryList(companiesGeojson) {
  const c = new Set(companiesGeojson.features.map(f => f.properties['tax1']));
  return Object.values(Array.from(c)).sort();
}

class App extends React.Component {
  map;
  state = {
    center: [-121, 36.5],
    zoom: 6,
    minZoom: 6,
    companiesGeojson: {},
    selectedCategories: new Set(),
  };

  constructor(props) {
    super(props);
    this.handleToggleCategory = this.handleToggleCategory.bind(this);
    this.handleSelectAllCategories = this.handleSelectAllCategories.bind(this);
    this.handleDeselectAllCategories = this.handleDeselectAllCategories.bind(this);
    this.handleSelectCompany = this.handleSelectCompany.bind(this);
    this.displayPopup = this.displayPopup.bind(this);
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
      .setMaxWidth("40vw")
      .addTo(this.map);
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: this.state.center,
      zoom: this.state.zoom,
      minZoom: this.state.minZoom,
    });

    this.map.on('move', () => {
      this.setState({
        lng: this.map.getCenter().lng.toFixed(4),
        lat: this.map.getCenter().lat.toFixed(4),
        zoom: this.map.getZoom().toFixed(2)
      });
    });

    const geojsonLoaded = loadGeojsonData().then(companiesGeojson => {
      this.setState({
        companiesGeojson: companiesGeojson,
        categories: compileCategoryList(companiesGeojson),
      });

      // initially select all categories
      this.handleSelectAllCategories();

      return companiesGeojson;
    });

    this.map.on('load', () => {
      this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
      this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      geojsonLoaded.then(companiesGeojson => {
        this.map.addSource('companies', {
          type: 'geojson',
          data: companiesGeojson,
        });

        this.map.addLayer({
          id: POINT_LAYER,
          type: 'circle',
          source: 'companies',
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
      });
    });

    this.map.flyTo({
      center: [-122.21, 37.65], // [lng, lat]
      zoom: 8,
      speed: 0.5,
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

  componentDidUpdate() {
    if (this.map.getLayer(POINT_LAYER)) {
      var filters = ["any"];
      // If ANY of the 3 taxonomies for a company are selected, they should be
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
        <div ref={el => this.mapContainer = el} id="map-container" />
        <div id="map-overlay">
          <div id="title-and-search">
            <div id="map-title">Silicon Valley Energy Ecosystem, 2019</div>
            <CompanySelector
              companies={this.state.companiesGeojson.features}
              onSelectCompany={this.handleSelectCompany}/>
          </div>
          <CompanyFilter
            selectedCategories={this.state.selectedCategories}
            onSelectAllCategories={this.handleSelectAllCategories}
            onDeselectAllCategories={this.handleDeselectAllCategories}
            onToggleCategory={this.handleToggleCategory} />
        </div>
      </div>
    );
  }
}

export default App;
