import logging
import sys
import numpy as np
import pandas as pd

USAGE = f"python {__file__} <input_csv>"

COLUMNS_OF_INTEREST = (
    "company city fte tax1 tax2 tax3 website lat lng".split(" "))

logging.basicConfig(format='%(message)s')
logging.getLogger().setLevel('INFO')


# TODO: DON'T REPEAT YOURSELF! SYNCHRONIZE WITH JS TAXONOMY COLORS.
CATEGORIES = frozenset([
    'Academia/Research',
    'Accelerator/Incubator',
    'Biofuels',
    'Buildings',
    'Chemistry',
    'Circular Economy',
    'Construction',
    'Enabling Technology/Components',
    'Energy Systems/Management',
    'Engineering',
    'Environmental Remediation',
    'Evaluation/Compliance',
    'Finance',
    'Generation/Transmission',
    'Geology',
    'Hydrogen',
    'IIoT/IoT',
    'Lighting',
    'Manufacturing',
    'Materials',
    'Media',
    'Mobility as a Service',
    'Nuclear',
    'Oil and Gas',
    'Policy',
    'Professional Services',
    'Security/Cybersecurity',
    'Sensors',
    'Solar',
    'Storage',
    'Sustainable Agriculture',
    'Thermal Energy',
    'Utility/Grid',
    'Wave/Water/Hydro',
    'Wind',
])


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
    return not (v is np.nan or v in CATEGORIES)


def check_valid_taxonomy_values(df):
    valid = True
    for col in ('tax1', 'tax2', 'tax3'):
        invalid_category = df[df[col].apply(is_invalid_category)]
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

    if not valid:
        raise RuntimeError("Invalid data! Please fix and retry.")
    logging.info("Success! Data validated.")


def main():
    if len(sys.argv) != 2:
        print(USAGE)
        sys.exit()
    validate(pd.read_csv(sys.argv[1], index_col='idx'))


if __name__ == '__main__':
    main()
