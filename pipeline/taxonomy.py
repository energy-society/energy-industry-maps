import json


TAXONOMY, TAXONOMY_SV = None, None


def ensure_taxonomy_loaded(fn):
    def with_taxonomy(*args, **kwargs):
        global TAXONOMY
        global TAXONOMY_SV
        if TAXONOMY is None:
            with open('../src/taxonomy.json') as f:
                TAXONOMY = json.load(f)
        if TAXONOMY_SV is None:
            with open('../src/taxonomy-sv.json') as f:
                TAXONOMY_SV = json.load(f)
        return fn(*args, **kwargs)
    return with_taxonomy


@ensure_taxonomy_loaded
def load_taxonomy(use_sv_taxonomy):
    if use_sv_taxonomy:
        return TAXONOMY_SV
    return TAXONOMY


@ensure_taxonomy_loaded
def load_categories(use_sv_taxonomy=False):
    taxonomy_to_use = load_taxonomy(use_sv_taxonomy)
    categories = sorted([v for v in taxonomy_to_use], key=lambda v: v['name'])
    return [v['name'] for v in categories]


@ensure_taxonomy_loaded
def load_category_mapping(use_sv_taxonomy=False):
    mapping = {}
    for category in load_taxonomy(use_sv_taxonomy):
        for alias in category.get('aliases', []):
            mapping[alias] = category['name']
    return mapping
