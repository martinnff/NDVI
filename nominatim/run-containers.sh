#!/bin/bash
docker run -it \
  -e PBF_URL=https://download.geofabrik.de/europe/spain/castilla-y-leon-latest.osm.pbf \
  -e REPLICATION_URL=https://download.geofabrik.de/europe/spain/castilla-y-leon-updates/ \
  -p 8080:8080 \
  -d --name nominatim \
  mediagis/nominatim:4.2
