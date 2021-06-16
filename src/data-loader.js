import { normalizeCategory } from './common';

/** @return {...} */
function /** gets a certain category */ getCategory(k, taxonomy) {
  if (k === -1) {
    return '';
  }
  return taxonomy[k]['name'];
}

/** @return {...} */
function /** shapes data for json file */ toFinalForm(data) {
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
        'notes': row[colidx['notes']],
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

/** @return {...} */
export function /** fetches url and shapes to Final form */ fetchMapData(mapId) {
  let url = process.env.PUBLIC_URL + `/data/${mapId}.json`;
  return fetch(url).then(r => r.json()).then(toFinalForm);
}
