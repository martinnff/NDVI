import os
import rasterio as rio
import numpy as np

# read raster data

path = "NDVI.tif"

with rio.open(path) as src:
    raster_arr = src.read(1)

print(raster_arr)

def getIndexInsideCircle(x, y, radio, xmax, ymax):
  points = np.array(
     np.meshgrid(
    range(max((x - radio), 0), min((x + radio), xmax)),
      range(max((y - radio), 0),min((y + radio), ymax))
      ))
  points = points.reshape(2,points.shape[1]**2).T
  dists = np.zeros(len(points))
  for i in range(len(dists)):
    dists[i] =  np.sqrt(
      (x - points[i, 0]) ^ 2 +
      (y - points[i, 1]) ^ 2
      )
  
  index = np.where(dists < radio)
  return(points[index, ])

out = getIndexInsideCircle(50,50,10,100,100)
print(out)
