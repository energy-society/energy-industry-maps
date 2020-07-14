import CONFIG from './config.json';
import taxonomy from './taxonomy.json';

export const normalizeCategory = s => s.toLowerCase().replace(/[/ ]/g, '-');

export function getFilteredTaxonomy(mapId) {
  if (CONFIG['maps'][mapId].includeObsoleteCategories) {
    return taxonomy;
  }
  return taxonomy.filter(c => !c.obsolete);
}

export function getAllCategories(mapId) {
  return new Set(getFilteredTaxonomy(mapId).map(c => normalizeCategory(c.name)));
}
