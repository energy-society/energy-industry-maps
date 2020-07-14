import json


TAXONOMY = None


def ensure_taxonomy_loaded(fn):
    def with_taxonomy(*args, **kwargs):
        global TAXONOMY
        if TAXONOMY is None:
            with open('../src/taxonomy.json') as f:
                TAXONOMY = json.load(f)
        return fn(*args, **kwargs)
    return with_taxonomy


@ensure_taxonomy_loaded
def load_categories(filter_obsolete=True):
    categories = sorted([v for v in TAXONOMY], key=lambda v: v['name'])
    if filter_obsolete:
        return [v['name'] for v in categories if not v.get('obsolete', False)]
    return [v['name'] for v in categories]


@ensure_taxonomy_loaded
def load_category_mapping():
    mapping = {}
    for category in TAXONOMY:
        for alias in category.get('aliases', []):
            mapping[alias] = category['name']
    return mapping
