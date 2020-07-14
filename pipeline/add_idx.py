# script that adds an 'idx' column to a csv

import pandas as pd
import sys

input_file = sys.argv[1]
df = pd.read_csv(input_file)
df.index.name = 'idx'
df.round(6).to_csv(input_file)
