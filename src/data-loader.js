import { normalizeCategory } from './common';

function getCategory(k, taxonomy) {
  if (k === -1) {
    return '';
  }
  return taxonomy[k]['name'];
}

function toFinalForm(data) {
  let headers = data.table.columns;
  const colidx = {};
  for (var i = 0; i < headers.length; i++) {
    colidx[headers[i]] = i;
  }
  const features = [];
  data.table.data.forEach((row, i) => {
    let feature = {
      'type': 'Feature',
      'properties': {
        'idx': i,
        'company': row[colidx['company']],
        'city': data.cities[row[colidx['city']]],
        'tax1': getCategory(row[colidx['tax1']], data.taxonomy),
        'tax2': getCategory(row[colidx['tax2']], data.taxonomy),
        'tax3': getCategory(row[colidx['tax3']], data.taxonomy),
        'website': row[colidx['website']],
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [row[colidx['lng']], row[colidx['lat']]],
      },
    };
    // canonicalize categories for use as labels
    ['tax1', 'tax2', 'tax3'].forEach(label => {
      const newprop = `${label}sanitized`;
      let category = feature.properties[label];
      feature.properties[newprop] = normalizeCategory(category);
    });
    features.push(feature);
  });
  return {
    geojson: {
      type: 'FeatureCollection',
      features: features,
    },
    taxonomy: data.taxonomy,
  }
}

export function fetchMapData() {
  let url = `https://energymaps.energysociety.org/data/silicon-valley.json`;

  return fetch(url).then(r => r.json()).then(toFinalForm);
}
