export const normalizeCategory = s => s.toLowerCase().replace(/[/ ]/g, '-');

export function getAllCategories(taxonomy) {
  return new Set(taxonomy.map(c => normalizeCategory(c.name)));
}
