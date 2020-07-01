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
def load_categories():
    return sorted(list(TAXONOMY.keys()))
