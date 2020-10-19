import logging
import pandas as pd
import sys
import taxonomy
from collections import Counter


USAGE = f"python {__file__} <csv_input_file> <csv_output_file>"

logging.basicConfig(level='INFO', format='%(levelname)s: %(message)s')


CATEGORY_MAPPING = taxonomy.load_category_mapping()
COUNTERS = Counter()


def map_category_name(c):
    if c in CATEGORY_MAPPING:
        COUNTERS[c] += 1
        return CATEGORY_MAPPING[c]
    return c


def normalize_category_names(df):
    for col in ('tax1', 'tax2', 'tax3'):
        df[col] = df[col].apply(map_category_name)
    return df


def strip_whitespace(df, col):
    df[col] = df[col].str.strip()
    return df


def main():
    if len(sys.argv) != 3:
        print(USAGE)
        sys.exit()
    input_file, output_file = sys.argv[1], sys.argv[2]
    df = pd.read_csv(input_file, index_col='idx')
    df = df.dropna(how='all').dropna(how='all', axis=1)
    df = normalize_category_names(df)
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
            f"'{CATEGORY_MAPPING[k]}'")
    df.round(6).to_csv(output_file)
    logging.info(f"Wrote output to {output_file}")


if __name__ == '__main__':
    main()
