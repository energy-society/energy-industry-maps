import json


TAXONOMIES = {}


def ensure_taxonomy_loaded(fn):
    def with_taxonomy(*args, **kwargs):
        global TAXONOMIES
        if not TAXONOMIES:
            with open('../src/config.json') as f:
                config = json.load(f)

            for alias, filename in config["taxonomies"].items():
                with open(f'../src/{filename}') as f:
                    TAXONOMIES[alias] = json.load(f)
        return fn(*args, **kwargs)

    return with_taxonomy


@ensure_taxonomy_loaded
def get_available_taxonomies():
    return list(TAXONOMIES.keys())


@ensure_taxonomy_loaded
def load_taxonomy(taxonomy):
    return TAXONOMIES[taxonomy]


@ensure_taxonomy_loaded
def load_categories(taxonomy="default"):
    taxonomy_to_use = load_taxonomy(taxonomy)
    categories = sorted([v for v in taxonomy_to_use], key=lambda v: v['name'])
    return [v['name'] for v in categories]


@ensure_taxonomy_loaded
def load_category_mapping(taxonomy="default"):
    mapping = {}
    for category in load_taxonomy(taxonomy):
        for alias in category.get('aliases', []):
            mapping[alias] = category['name']
    return mapping
