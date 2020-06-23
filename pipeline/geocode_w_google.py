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


def main():
    logging.getLogger().setLevel(logging.INFO)

    if len(sys.argv) != 3:
        print(USAGE)
        sys.exit(1)
    input_file, output_file = sys.argv[1:3]

    df = pd.read_csv(input_file, index_col='idx')

    if 'address' not in df:
        print('Script requires input data to have an "address" column!')
        print(USAGE)
        sys.exit(1)

    lats, lngs = [], []
    for address in df.address:
        lat, lng = np.nan, np.nan
        if address and address is not np.nan:
            sanitized_address = address.replace(" ", "+")
            requesturl = f"{HOST}?key={API_KEY}&address={sanitized_address}"
            logging.info(requesturl)
            r = requests.get(requesturl)
            r.raise_for_status()
            api_status = r.json()['status']
            if api_status != 'OK':
                raise RuntimeError(f'Status: {api_status}')
            results = r.json().get('results', [])
            if results:
                latlng = results[0].get('geometry', {}).get('location', None)
                if latlng is not None:
                    logging.info(f"Got {latlng=}")
                    lat = latlng['lat']
                    lng = latlng['lng']
        lats.append(lat)
        lngs.append(lng)
        time.sleep(random.random() / 8)

    df['lat'] = lats
    df['lng'] = lngs
    df.to_csv(output_file)


if __name__ == '__main__':
    main()
