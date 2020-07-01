import hashlib
import json
import logging
import os
import pandas as pd
import sys
import taxonomy
import validate

USAGE = f"python {__file__} <csv_file> <location_id>"

CONFIG_FILE = '../src/config.json'

COLUMNS_TO_KEEP = (
    "company city fte tax1 tax2 tax3 website lat lng".split(" "))

logging.basicConfig(format='%(message)s')
logging.getLogger().setLevel('INFO')


def read_config():
    with open(CONFIG_FILE) as f:
        return json.load(f)


def write_config(config):
    with open(CONFIG_FILE, 'w') as f:
        print(json.dumps(config, indent=2), file=f)


def lookup(coll):
    return lambda k: coll[k]


def make_final_output(input_df):
    df = input_df.filter(items=COLUMNS_TO_KEEP)

    # Categorize city column
    cities = sorted(df.city.unique())
    city_to_idx = {c: i for i, c in enumerate(cities)}
    df.city = df.city.apply(lookup(city_to_idx))

    # FTE is integer, not float
    df.fte = df.fte.fillna(0).astype('int')

    # Categorize taxonomy columns
    categories = taxonomy.load_categories()

    cat_to_idx = {c: i for i, c in enumerate(categories)}
    cat_to_idx[''] = -1
    for i in (1, 2, 3):
        df['tax%s' % i] = df['tax%s' % i].fillna('').apply(lookup(cat_to_idx))

    # Make sure website is not NaN
    df.website = df.website.fillna('')

    # Round lat/lngs so they print sanely
    df.lat = df.lat.round(6)
    df.lng = df.lng.round(6)

    table = df.to_dict(orient='split')
    table.pop('index')

    return {
      'cities': cities,
      'table': table,
    }


def update_config_file(location_id, hashfrag):
    config = read_config()
    config[location_id]['datasetHash'] = hashfrag
    write_config(config)


def save_final_output(output, location_id):
    strout = json.dumps(output)
    h = hashlib.sha256()
    h.update(strout.encode())
    digest_fragment = h.hexdigest()[:7]
    filename = f'{location_id}-{digest_fragment}.json'
    output_path = f'../public/data/{filename}'
    update_config_file(location_id, digest_fragment)
    with open(output_path, 'w') as f:
        json.dump(output, f)
        logging.info(f"Saved final output to {output_path}")
    old_versions = [v for v in os.listdir('../public/data')
                    if v.startswith(location_id) and v != filename]
    if old_versions:
        logging.info("Make sure to remove old versions:")
        for v in old_versions:
            logging.info(v)


def main():
    if len(sys.argv) != 3:
        print(USAGE)
        sys.exit(1)
    input_csv, location_id = sys.argv[1:3]
    config = read_config()
    if location_id not in config:
        raise RuntimeError(f"Location id '{location_id}' not in config!")
    df = pd.read_csv(input_csv, index_col='idx')
    validate.validate(df)
    save_final_output(make_final_output(df), location_id)


if __name__ == '__main__':
    main()
