/*  Script to run in the google earth engine code editor

    TODO

    Modify the script in a way that generates bounding boxex containing 
    all the query locations without exceeding the max download size of 
    the engine.

    Options:
    
        1. Making a grid containing the full map, with a grid resolution that doesnt exceedes 
         the max download size and extract only the areas with ovservations.

        2. Define a max image size and cluster observations that fit inside that size,
            then download all the boxes defined in that way.
    
    Create a python script to build the instructions to export all the images using this template

*/
var data = ee.ImageCollection("LANDSAT/LC8_L1T_32DAY_NDVI"),
    geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-9.409242143287331, 43.79677586109648],
          [-9.409242143287331, 41.74560228213778],
          [-6.70660542453733, 41.74560228213778],
          [-6.70660542453733, 43.79677586109648]]], null, false);


var image = data.filterDate('2023-06-03','2023-08-30');
var NDVI = data.filterBounds(geometry).select('NDVI').median();

Map.addLayer(NDVI)

Export.image.toDrive({
image: NDVI,
scale: 40,
region: geometry
})
          
          