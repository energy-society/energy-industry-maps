# script to adjust lng and lat such that the points dont overlap
# requires arg1 = original file name
#			arg2 = new file name

import sys
import pandas as pd
import math
import time

start_time = time.time()

def get_closest(df, idx_current):
	if idx_current == 0:
		closest_idx = 1
	else:
		closest_idx = 0
	closest_distance = get_distance(df, idx_current, closest_idx)
	for i in range(0, len(df['idx'])):
		if i != idx_current:
			val = get_distance(df, idx_current, i)
			if val < closest_distance:
				closest_idx = i
				closest_distance = val
	return closest_idx

def get_distance(df, idx1, idx2):
	return round(math.sqrt((df.iloc[idx1]['lat'] - df.iloc[idx2]['lat']) ** 2 +
			 (df.iloc[idx1]['lng'] - df.iloc[idx2]['lng']) ** 2), 6)

def move(og_df, df, idx_current, idx_closest, tether_dist, move_dist, moves):

	def norm(lat, lng):
		return round(math.sqrt(lat ** 2 + lng ** 2), 6)

	def check_tether(og_df, idx_current, lat_new, lng_new):
		dist = round(math.sqrt((og_df.iloc[idx_current]['lat'] - lat_new) ** 2 +
			 (og_df.iloc[idx_current]['lng'] - lng_new) ** 2), 6)
		if dist <= tether_dist:
			return True 
		else:
			return False

	def on_top(lat, lng, move_dist, moves):
		surr_id = moves % 8
		lap = moves / 8 + 1
		if surr_id == 0:
			lat_new = lat + move_dist*lap
			lng_new = lng + move_dist*lap
		elif surr_id == 1:
			lat_new = lat + move_dist*lap
			lng_new = lng
		elif surr_id == 2:
			lat_new = lat + move_dist*lap
			lng_new = lng - move_dist*lap
		elif surr_id == 3:
			lat_new = lat
			lng_new = lng - move_dist*lap
		elif surr_id == 4:
			lat_new = lat - move_dist*lap
			lng_new = lng - move_dist*lap
		elif surr_id == 5:
			lat_new = lat - move_dist*lap
			lng_new = lng
		elif surr_id == 6:
			lat_new = lat - move_dist*lap
			lng_new = lng + move_dist*lap
		else:
			lat_new = lat
			lng_new = lng + move_dist*lap
		return lat_new, lng_new

	lat0 = df.iloc[idx_closest]['lat']
	lng0 = df.iloc[idx_closest]['lng']
	lat1 = df.iloc[idx_current]['lat']
	lng1 = df.iloc[idx_current]['lng']

	#add a check to see if the points are on top of one another
	if lat0 == lat1 and lng0 == lng1:
		lat_new, lng_new = on_top(lat1, lng1, move_dist, moves)
		df_copy = df.copy()
		df_copy.at[idx_current, 'lat'] = lat_new
		df_copy.at[idx_current, 'lng'] = lng_new
		print('checking tether: ')
		print(df_copy.at[idx_current, 'lat'])
		print(df_copy.at[idx_current, 'lng'])
		print('moved')
		return df_copy, True

	
	lat_v = (lat1 - lat0)
	lng_v = (lng1 - lng0)
	
	lat_u = lat_v / norm(lat_v, lng_v)
	lng_u = lng_v / norm(lat_v, lng_v)

	lat_new = lat1 + move_dist * lat_u
	lng_new = lng1 + move_dist * lng_u

	if check_tether(original_df, idx_current, lat_new, lng_new):
		df_copy = df.copy()
		df_copy.at[idx_current, 'lat'] = lat_new
		df_copy.at[idx_current, 'lng'] = lng_new
		print('checking tether: ')
		print(df_copy.at[idx_current, 'lat'])
		print(df_copy.at[idx_current, 'lng'])
		print('moved')
		return df_copy, True
	else:
		print('did not move')
		return df, False



input_file = sys.argv[1]
output_file = sys.argv[2]

original_df = pd.read_csv(input_file)
# print(list(df.columns))

MAX_MOVES = 100
_DISTANCE = 0.002
TETHER_DISTANCE = 0.002
_MOVE = 0.00015

df = original_df.copy()
print(df)
for idx_current in df['idx']:
	print('working on this idx: ', idx_current)
	idx_closest = get_closest(df, idx_current)
	dist_closest = get_distance(df, idx_current, idx_closest)
	print('first idx closest: ', idx_closest)
	print('first dist closest: ', dist_closest)
	moves = 0
	while moves < MAX_MOVES and dist_closest < _DISTANCE:
		df, stop = move(original_df, df, idx_current, idx_closest, TETHER_DISTANCE, _DISTANCE, moves)
		idx_closest = get_closest(df, idx_current)
		dist_closest = get_distance(df, idx_current, idx_closest)
		#print(idx_closest)
		moves = moves + 1
		if stop == False:
			break
	print('moves: ', moves)
	print('final idx closest: ', idx_closest)
	print('final dist closest: ', dist_closest)
	print('+======================+')

df.lat = df.lat.astype(float).round(6)
df.lng = df.lng.astype(float).round(6)
print('======lat=====')
print(original_df['lat'])
print(df['lat'])
print('======lng=====')
print(original_df['lng'])
print(df['lng'])
df.to_csv(output_file)

print('time elapsed: ' , time.time() - start_time)