import logging
import sys
import pandas as pd
import taxonomy

logging.basicConfig(format='%(message)s')
logging.getLogger().setLevel('INFO')


USAGE = f"python {__file__} <csv_file>"

COLUMNS_OF_INTEREST = (
    "company city tax1 tax2 tax3 website lat lng".split(" "))


def lookup(coll):
    return lambda k: coll[k]


def check_no_missing(df, col):
    valid = True
    col_na = list(df[df[col].isna()].index)
    if col_na:
        valid = False
        for idx in col_na:
            logging.warning(f"Missing column '{col}' for record {idx}")
    return valid


def is_invalid_category(v):
    return v not in taxonomy.load_categories()


def check_valid_taxonomy_values(df):
    valid = True
    for col in ('tax1', 'tax2', 'tax3'):
        series = df[col].dropna()
        invalid_category = series[series.apply(is_invalid_category)]
        if len(invalid_category):
            valid = False
            for idx in invalid_category.index:
                record = df.loc[idx]
                logging.warning(
                    f"Invalid category value '{record[col]}' in column '{col}'"
                    f" for record {idx} with name '{record['company']}'")
    return valid


def check_uncommon_city_names(df):
    vcs = df.city.value_counts()
    occurring_once = frozenset(vcs[vcs == 1].index.values)

    def warn_if_city_occurs_once(row):
        if row.city in occurring_once:
            logging.warning(
                f"City '{row.city}' only occurs once, for '{row.company}'."
                f" Please ensure it's spelled correctly.")
    df.apply(warn_if_city_occurs_once, axis=1)


def validate(input_df):
    df = input_df.filter(items=COLUMNS_OF_INTEREST)
    valid = True

    valid = check_no_missing(df, 'company') and valid
    valid = check_no_missing(df, 'lat') and valid
    valid = check_no_missing(df, 'lng') and valid
    valid = check_no_missing(df, 'tax1') and valid
    valid = check_valid_taxonomy_values(df) and valid

    check_uncommon_city_names(df)

    return valid


def main():
    if len(sys.argv) != 2:
        print(USAGE)
        sys.exit()
    df = pd.read_csv(sys.argv[1], index_col='idx')
    if validate(df):
        logging.info("Success! Data validated.")
    else:
        raise RuntimeError("Invalid data! Please fix and retry.")


if __name__ == '__main__':
    main()
