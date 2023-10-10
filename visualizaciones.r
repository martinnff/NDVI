library(raster)
str_name <- 'NDVI.tif' 
raster <- raster(str_name)



getIndexInsideCircle <- function (x, y, radio, xmax, ymax) {
  points <- expand.grid(
    c(max((x - radio), 0):min((x + radio), xmax)),
      c(max((y - radio), 0):min((y + radio), ymax))
      )
  dists <- 0
  for (i in seq_len(nrow(points))) {

    dists[i] <- sqrt(
      (x - points[i, 1]) ^ 2 +
      (y - points[i, 2]) ^ 2
      )
  }
  index <- which(dists < radio)
  return(points[index, ])
}



getNDVI <- function(lat, lon, raster, radio) {

  rxmin <- raster@extent@xmin
  rymin <- raster@extent@ymin
  rxmax <- raster@extent@xmax
  rymax <- raster@extent@ymax
  
  rangex <- rxmax - rxmin
  rangey <- rymax - rymin
  
  resx <- rangex / raster@ncols
  resy <- rangey / raster@nrows
  
  xind <- ((lat - rxmin) %/% resx) + 1
  yind <- ((lon - rymin) %/% resy) + 1

  rasterIndex <- as.matrix(
    getIndexInsideCircle(xind, yind, radio, raster@ncols, raster@nrows)
  )
  out <- list(index = rasterIndex, values = raster[rasterIndex])
  return(out)
}



point <- c(-9,43)

out <- getNDVI(lat = point[1], lon =  point[2], raster = raster, radio = 5)
length(out)

plot(raster, asp=F)
points(out$index, lwd=1)



points <- getIndexInsideCircle(x = 50, y = 50, radio = 15, xmax = 100, ymax = 100)

points(points, col = 4, lwd = 10)



mat <- matrix(round(runif(100,min=0,max=10)),ncol=10,nrow=10)
ind <- as.matrix(expand.grid(c(1,4,5),c(3,6)))

raster[1,3]
library(httr2)
ip <- "192.168.0.5"
port <- "8080"
query <- "Escairón doutor jose portela 4"
url <- paste('http://', ip, ':', port, '/search?q=',query, sep = '')
url <- sub(" ", "%20", url)

getInfoInJson <- httr2::request(url)

 #
jsonInfoImg <- content(getInfoInJson, type="application/json")

jsonInfoImg[[1]]$lat
jsonInfoImg[[1]]$lon







