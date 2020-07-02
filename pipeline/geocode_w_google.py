import logging
import random
import sys
import time

import numpy as np
import pandas as pd
import requests

USAGE = "python geocode_w_google.py <input_csv_to_geocode> <output_csv>"

API_KEY = ""  # your API key here
HOST = "https://maps.googleapis.com/maps/api/geocode/json"

logging.basicConfig(level='INFO', format='%(levelname)s: %(message)s')


def geocode(row):
    if row.address and isinstance(row.address, str):
        sanitized_address = row.address.replace(" ", "+")
        requesturl = f"{HOST}?key={API_KEY}&address={sanitized_address}"
        logging.info(requesturl)
        r = requests.get(requesturl)
        r.raise_for_status()
        api_status = r.json()['status']
        if api_status not in ('OK', 'ZERO_RESULTS'):
            raise RuntimeError(f'Status: {api_status}')
        results = r.json().get('results', [])
        # throttle
        time.sleep(random.random() / 8)
        if results:
            latlng = results[0].get('geometry', {}).get('location', None)
            if latlng is not None:
                logging.info(f"Got lat/lng from Google: ({latlng})")
                return latlng
        logging.warning(f"No lat/lng for address '{row.address}'!")
    logging.warning(f"No lat/lng or address present for '{row.company}'!")
    return None


def fill_missing_geocodes(df):
    needing_latlng = df[(df.lat.isna()) | (df.lng.isna())]
    latlngs = needing_latlng.apply(geocode, axis=1)
    for idx in latlngs.index:
        latlng = latlngs.loc[idx] or {}
        lat, lng = latlng.get('lat', np.nan), latlng.get('lng', np.nan)
        df.loc[idx, 'lat'] = lat
        df.loc[idx, 'lng'] = lng
    return df


def main():
    if len(sys.argv) != 3:
        print(USAGE)
        sys.exit(1)
    input_file, output_file = sys.argv[1:3]

    df = pd.read_csv(input_file, index_col='idx')
    if 'address' not in df:
        logging.error(
            'Script requires input data to have an "address" column!')
        print(USAGE)
        sys.exit(1)

    fill_missing_geocodes(df).round(6).to_csv(output_file)


if __name__ == '__main__':
    main()
