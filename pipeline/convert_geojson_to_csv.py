import json
import pandas as pd
import sys

USAGE = f"python {__file__} <input_geojson> <output_csv>"


def convert(geojson):
    records = []
    for feature in geojson['features']:
        record = {}
        for prop, val in feature['properties'].items():
            if prop:
                record[prop] = val
        coords = feature['geometry']['coordinates']
        record['lat'] = coords[1]
        record['lng'] = coords[0]
        records.append(record)

    df = pd.DataFrame.from_records(records)
    df.index = df.idx
    df = df.drop(['idx'], axis=1)
    return df.to_csv()


def main():
    if len(sys.argv) != 3:
        print(USAGE)
        sys.exit(1)

    geojson_input, csv_output = sys.argv[1:3]
    with open(geojson_input) as f:
        geojson = json.load(f)
    with open(csv_output, 'w') as f:
        f.write(convert(geojson))


if __name__ == '__main__':
    main()
