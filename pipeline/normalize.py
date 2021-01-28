import argparse
import logging
import pandas as pd
import taxonomy
from collections import Counter


logging.basicConfig(level='INFO', format='%(levelname)s: %(message)s')


COUNTERS = Counter()


def normalize_category_names(df, mapping):
    def map_category_name(c):
        if c in mapping:
            COUNTERS[c] += 1
            return mapping[c]
        return c
    for col in ('tax1', 'tax2', 'tax3'):
        df[col] = df[col].apply(map_category_name)
    return df


def strip_whitespace(df, col):
    df[col] = df[col].str.strip()
    return df


def main():
    parser = argparse.ArgumentParser(description='Validate map data.')
    parser.add_argument(
        'input_file',
        metavar='<csv_input_file>',
        type=str,
        help='Name of the CSV input file to normalize')
    parser.add_argument(
        'output_file',
        metavar='<csv_output_file>',
        type=str,
        help='Name of the file to write normalized output CSV to')
    parser.add_argument(
        '--taxonomy',
        type=str,
        default="default",
        choices=taxonomy.get_available_taxonomies(),
        help='Which taxonomy to use')
    args = parser.parse_args()

    df = pd.read_csv(args.input_file, index_col='idx')
    df = df.dropna(how='all').dropna(how='all', axis=1)
    category_mapping = taxonomy.load_category_mapping(args.taxonomy)
    df = normalize_category_names(df, category_mapping)
    df = strip_whitespace(df, 'company')
    df = strip_whitespace(df, 'city')
    df = strip_whitespace(df, 'tax1')
    df = strip_whitespace(df, 'tax2')
    df = strip_whitespace(df, 'tax3')
    df.lat = df.lat.astype(float).round(6)
    df.lng = df.lng.astype(float).round(6)

    for k in COUNTERS:
        logging.info(
            f"Replaced {COUNTERS[k]} instances of '{k}' with "
            f"'{category_mapping[k]}'")
    df.round(6).to_csv(args.output_file)
    logging.info(f"Wrote output to {args.output_file}")


if __name__ == '__main__':
    main()
