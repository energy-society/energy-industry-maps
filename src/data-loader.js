import mapboxgl from 'mapbox-gl';
import { normalizeCategory } from './common.js';

const DATASETS_ENDPOINT = "https://api.mapbox.com/datasets/v1";
const USER = process.env.REACT_APP_MAPBOX_USER;
// TODO: Parameterize over dataset id, as we will want the flexibility to load
// other datasets.
const DATASET_ID = "ck901ssdl1sxn2mmnj56s9ibm";

function loadGeojsonData() {
  let url = `${DATASETS_ENDPOINT}/${USER}/${DATASET_ID}/features?access_token=${mapboxgl.accessToken}`;
  return fetch(url)
    .then(response => response.text())
    .then(data => JSON.parse(data))
    .then(parsed => {
      parsed.features.forEach(feature => {
        // filter properties (TODO: Can we change this dataset-side?)
        feature.properties = {
          'company': feature.properties.company,
          'city': feature.properties.city,
          'tax1': feature.properties.tax1,
          'tax2': feature.properties.tax2,
          'tax3': feature.properties.tax3,
          'website': feature.properties.website,
        };
        ['tax1', 'tax2', 'tax3'].forEach(label => {
          const newprop = `${label}sanitized`;
          feature.properties[newprop] = normalizeCategory(feature.properties[label]);
        })
      });
      return parsed;
    });
}

export { loadGeojsonData };
