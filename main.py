#!./venv/bin/python3
import sys
import os
import rasterio as rio
import numpy as np
import json
import webbrowser
import requests
import utils 
import pandas as pd

def main(raster_path,input_file,output_file,ip,port):
    # Read raster image
    raster = rio.open(raster_path)
    # Read directions file
    direcciones = pd.read_table(input_file,sep=",",header=None)

    #Get pixel values for each location
    pixels_ndvi = []
    for i in range(len(direcciones)):
        api_url = 'http://{}:{}/search?q={}'.format(ip,port,direcciones.iloc[i,0])
        coords = utils.send_request(api_url)
        pixels_ndvi.append(utils.getNDVI(coords[0],coords[1],raster,3)['values'])

    # Get descriptive statistics of each set of pixel values
    nrows = len(direcciones)
    ncols = 5
    nvdi_features = np.ndarray((nrows,ncols))
    for i in range(len(pixels_ndvi)):
        nvdi_features[i][0] = np.mean(pixels_ndvi[i])
        nvdi_features[i][1] = np.max(pixels_ndvi[i])
        nvdi_features[i][2] = np.min(pixels_ndvi[i])
        nvdi_features[i][3] = np.var(pixels_ndvi[i])
        nvdi_features[i][4] = np.median(pixels_ndvi[i])

    nvdi_features = pd.DataFrame(nvdi_features, columns=['Mean', 'Max', 'Min','Var','Median'])

    # Save the output
    nvdi_features.to_csv(output_file, sep=',')


if __name__ == "__main__":

    raster_path = sys.argv[1]#"./rasterImages/NDVI.tif"
    input_file = sys.argv[2]# 'input/direcciones_galicia.txt'
    output_file = sys.argv[3]# 'output/NVDI.csv'
    if (len(sys.argv) > 4): ip = sys.argv[4]
    else: ip = 'localhost'
    if (len(sys.argv) > 5): ip = sys.argv[5]
    else: port = '8080'

    main(raster_path,input_file,output_file,ip,port)