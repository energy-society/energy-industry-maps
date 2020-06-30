import json
import logging
import pandas as pd
import sys
import validate

USAGE = f"python {__file__} <input_csv> <location_id>"

COLUMNS_TO_KEEP = (
    "company city fte tax1 tax2 tax3 website lat lng".split(" "))


logging.basicConfig(format='%(message)s')
logging.getLogger().setLevel('INFO')


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
    categories = set([])
    for i in (1, 2, 3):
        categories |= set(df['tax%s' % i].fillna('').unique())

    cat_to_idx = {c: i for i, c in enumerate(categories)}
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


def save_final_output(output, location_id):
    output_location = f'../public/data/{location_id}.json'
    with open(output_location, 'w') as f:
        json.dump(output, f)
        logging.info(f"Saved final output to {output_location}")


def main():
    if len(sys.argv) != 3:
        print(USAGE)
        sys.exit()
    input_csv, location_id = sys.argv[1:3]
    df = pd.read_csv(input_csv, index_col='idx')
    validate.validate(df)
    save_final_output(make_final_output(df), location_id)


if __name__ == '__main__':
    main()
