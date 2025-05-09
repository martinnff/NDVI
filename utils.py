import os
import rasterio as rio
import numpy as np
import json
import webbrowser
import requests

def getIndexInsideCircle(x, y, radio, xmax, ymax):
    # Crear las coordenadas de la cuadrícula en los límites especificados
    x_coords = np.arange(max((x - radio), 0), min((x + radio + 1), xmax + 1))
    y_coords = np.arange(max((y - radio), 0), min((y + radio + 1), ymax + 1))
    xx, yy = np.meshgrid(x_coords, y_coords)
    
    # Aplanar las matrices para obtener una lista de puntos
    points = np.vstack((xx.ravel(), yy.ravel())).T
    
    # Calcular las distancias desde el punto (x, y)
    dists = np.sqrt((points[:, 0] - x) ** 2 + (points[:, 1] - y) ** 2)
    
    # Filtrar los puntos que están dentro del radio
    index = np.where(dists < radio)
    
    return points[index]

def getIndexInsideSquare(x, y, radio, xmax, ymax):
    points = np.array(
        np.meshgrid(
            range(max((x - radio), 0), min((x + radio), xmax)),
            range(max((y - radio), 0), min((y + radio), ymax))
        ))
    points = points.reshape(2, points.shape[1] ** 2).T
    dists = np.zeros(len(points))
    for i in range(len(dists)):
        dists[i] =  np.sqrt(
            (x - points[i, 0]) ** 2 +
            (y - points[i, 1]) ** 2
            )

    index = np.where(dists < radio)
    return points[index, ].squeeze()


def getNDVI(lat, lon, raster, radio):
    
    values = raster.read(1)
    
    rxmin = raster.bounds[0]
    rymin = raster.bounds[1]
    rxmax = raster.bounds[2]
    rymax = raster.bounds[3]

    rangex = abs(rxmax - rxmin)
    rangey = abs(rymax - rymin)

    resx = rangex / raster.width
    resy = rangey / raster.height

    xind = int((lat - rxmin) // resx)
    yind = int((lon - rymin) // resy)
    
    rasterIndex = getIndexInsideCircle(xind, yind, radio, raster.width, raster.height)
    
    coords = np.array([
        [rxmin + rasterIndex[:, 0] * resx],
        [rymin + rasterIndex[:, 1] * resy]
    ])
    
    out = {
        "index" : rasterIndex,
        "coords": coords,
        "values": values[rasterIndex[:,0], rasterIndex[:,1]]
    }
    
    return(out)

def send_request(text_search):
    
    response = requests.get(text_search)
    json_response = json.loads(response.text)
    out = (
        float(json_response[0]["lon"]),
        float(json_response[0]["lat"])
    )
    return(out)
