// Importar la colección de OpenStreetMap Administrative Boundaries
var osm = ee.FeatureCollection('OSM/MUNICIPAL');

// Función para obtener el límite municipal con buffer
var getMunicipalityWithBuffer = function(municipalityName, margin) {
  var municipality = osm.filter(ee.Filter.eq('name', municipalityName)).first();
  if (municipality) {
    return municipality.geometry().buffer(margin);
  }
  return null;
};

// Lista de municipios por región
var municipalities = {
  baleares: ['Palma', 'Calvià', 'Andratx', 'Puigpunyent', 'Ferreries', 'Es Migjorn Gran'],
  
  catalunya_girona: ['Girona', 'Salt', 'Sarrià de Ter', 'Sant Julià de Ramis', 'Porqueres', 
                    'Vilablareix', 'Llambilles', 'Caldes de Malavella', 'Vilobí d\'Onyar', 
                    'Lloret de Mar'],
                    
  catalunya_barcelona: ['Barcelona', 'Cornellà de Llobregat', 'Gavà', 'Viladecans', 
                       'L\'Hospitalet de Llobregat', 'Vallirana', 'Esplugues de Llobregat',
                       'Sant Just Desvern', 'Sitges', 'Sant Cugat del Vallès', 'Sant Joan Despí'],
                       
  castilla_leon_salamanca: ['Salamanca', 'Almenara de Tormes', 'Villares de la Reina',
                           'San Esteban de la Sierra', 'Fresnedoso', 'Valero', 'Guijuelo',
                           'Los Santos', 'Puente del Congosto', 'Santibáñez de Béjar',
                           'Fuentes de Béjar', 'Endrinal', 'Membribe de la Sierra',
                           'Linares de Riofrío', 'Santibáñez de la Sierra', 'El Tornadizo',
                           'Monleón', 'San Miguel de Valero', 'Escurial de la Sierra'],
                           
  castilla_leon_valladolid: ['Valladolid', 'Tudela de Duero', 'Pesquera de Duero', 'Peñafiel',
                            'Cogeces del Monte', 'Padilla de Duero', 'Quintanilla de Onésimo',
                            'Campaspero', 'Fompedraza', 'Valbuena de Duero', 'Canalejas de Peñafiel',
                            'Traspinedo', 'Villabáñez', 'Herrera de Duero', 'Sardón de Duero',
                            'Olivares de Duero', 'La Parrilla', 'Villavaquerín'],
                            
  castilla_leon_leon: ['Villanueva del Condado', 'Pendilla de Arbás', 'Villamanín', 'Fontún'],
  
  andalucia_sevilla: ['Dos Hermanas', 'Montequinto', 'Coria del Río', 'Alcalá de Guadaira',
                      'Sevilla', 'Tomares', 'Mairena del Aljarafe'],
                      
  pais_vasco: ['Bilbao', 'Deusto', 'Arangoiti', 'San Ignacio'],
  
  aragon: ['Daroca', 'Mainar', 'Torralba de los Frailes', 'Villahermosa del Campo', 
           'Used', 'Lechón', 'Val de San Martín', 'Santed', 'Cubel', 'Retascón',
           'Gallocanta', 'Las Cuerlas', 'Villadoz', 'Cerveruela', 'Aldehuela de Liestos',
           'Zaragoza'],
           
  galicia: ['Vigo', 'O Porriño', 'Gondomar', 'Salvaterra de Miño', 'Leiro', 
            'Cenlle', 'O Carballiño', 'San Amaro', 'Xinzo de Limia', 'Ribadavia', 'Ourense'],
            
  madrid_cuenca: ['Madrid', 'Cuenca', 'Arcas', 'Chillarón de Cuenca', 'Señorío del Pinar',
                  'Puebla del Salvador', 'Colliguilla']
};

// Crear cajas contenedoras para cada región
var createRegionalBox = function(municipalityList, regionName) {
  var features = ee.List([]);
  
  // Obtener todos los límites municipales de la región
  municipalityList.forEach(function(name) {
    var boundary = getMunicipalityWithBuffer(name, 300);
    if (boundary) {
      features = features.add(ee.Feature(boundary));
    }
  });
  
  // Unir todos los límites y crear una caja contenedora
  var collection = ee.FeatureCollection(features);
  var union = collection.geometry().dissolve();
  return ee.Feature(union, {name: regionName});
};

// Crear las cajas regionales
var regionalBoxes = ee.FeatureCollection([
  createRegionalBox(municipalities.baleares, 'Illes Balears'),
  createRegionalBox(municipalities.catalunya_girona, 'Girona'),
  createRegionalBox(municipalities.catalunya_barcelona, 'Barcelona'),
  createRegionalBox(municipalities.castilla_leon_salamanca, 'Salamanca'),
  createRegionalBox(municipalities.castilla_leon_valladolid, 'Valladolid'),
  createRegionalBox(municipalities.castilla_leon_leon, 'León'),
  createRegionalBox(municipalities.andalucia_sevilla, 'Sevilla'),
  createRegionalBox(municipalities.pais_vasco, 'Euskadi'),
  createRegionalBox(municipalities.aragon, 'Aragón'),
  createRegionalBox(municipalities.galicia, 'Galicia'),
  createRegionalBox(municipalities.madrid_cuenca, 'Madrid-Cuenca')
]);

// Estilo visual para las cajas
var boxStyle = {
  color: '0000FF',
  fillColor: '0000FF33',
  width: 2
};

// Añadir al mapa
Map.addLayer(regionalBoxes, boxStyle, 'Regiones Municipales');

// Exportar como KML
Export.table.toDrive({
  collection: regionalBoxes,
  description: 'Regiones_Municipales_Completo',
  fileFormat: 'KML'
});

// Exportar como GeoJSON
Export.table.toDrive({
  collection: regionalBoxes,
  description: 'Regiones_Municipales_Completo_GeoJSON',
  fileFormat: 'GeoJSON'
});
