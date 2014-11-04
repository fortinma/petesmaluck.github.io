import json
import requests
import numpy as np


def flip_geojson_coordinates(geo):
    if isinstance(geo, dict):
        for k, v in geo.iteritems():
            if k == "coordinates":
                z = np.asarray(geo[k])
                f = z.flatten()
                geo[k] = np.dstack((f[1::2], f[::2])).reshape(z.shape).tolist()
            else:
                flip_geojson_coordinates(v)
    elif isinstance(geo, list):
        for k in geo:
            flip_geojson_coordinates(k)

url = "http://thespecgraphics-hamilton.com/namesakeMap/coote.json"
resp = requests.get(url)
gj = json.loads(resp.text)

print gj
flip_geojson_coordinates(gj)
print gj