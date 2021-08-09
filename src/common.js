export const /** formats category */ normalizeCategory = s => s.toLowerCase().replace(/[/ ]/g, '-');

export function /** gets all normalized categories */  getAllCategories(taxonomy) {
  return new Set(taxonomy.map(c => normalizeCategory(c.name)));
}
