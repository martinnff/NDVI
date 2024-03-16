#!/bin/bash
docker run -it \
  -e PBF_URL=https://download.geofabrik.de/europe/spain/galicia-latest.osm.pbf \
  -e REPLICATION_URL=https://download.geofabrik.de/europe/spain/galicia-updates/ \
  -p 8080:8080 \
  --name nominatim \
  mediagis/nominatim:4.2