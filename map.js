var geoloc_array=[];
var address_array=[];
//var coordinate_array=[];
function el(id){
  return document.getElementById(id);
};
var zoomLevel=5;
//var center = ol.proj.transform([80,20], 'EPSG:4326', 'EPSG:3857');
var center=[80,20]
var view = new ol.View({
  center: center,
  zoom: zoomLevel,
  projection:'EPSG:4326'
});



// var routeRequest=ajaxFunction();
// var source_targetRequest = ajaxFunction();
// var parkingRequest=ajaxFunction();



var featureSource = new ol.source.Vector({});
var osmSource = new ol.source.OSM();

var featureLayer=new ol.layer.Tile({
  source: osmSource
});
var osmLayer=new ol.layer.Vector({
  source:featureSource
});
var layer = [featureLayer,osmLayer];


// var overlay1=new ol.Overlay({
//   element:el('overlay'),
//   positioning:'bottom-center'
// });
window.app = {};
  var app = window.app;

  /**
   * @constructor
   * @extends {ol.control.Control}
   * @param {Object=} opt_options Control options.
   */
  app.Route = function(opt_options) {
    var options = opt_options || {};

    var anchor = document.createElement('a');
    anchor.href = '#GetRoute';
    anchor.innerHTML = 'Show Route';

    var this_ = this;




    // anchor.addEventListener('click', ajax_route, false);
    // anchor.addEventListener('touchstart', ajax_route, false);

    var element = document.createElement('div');
    element.className = 'getroute ol-unselectable ol-control';
    element.appendChild(anchor);

    ol.control.Control.call(this, {
      element: element,
      target: options.target
    });
};
  ol.inherits(app.Route, ol.control.Control);

  app.GeoCenter = function(opt_options) {
    var options = opt_options || {};

    var anchor = document.createElement('a');
    anchor.href = '#GeoCenter';
    anchor.innerHTML = 'Center -> Geo-Location';

    var this_ = this;

    anchor.addEventListener('click', setGeoAsCenter, false);
    anchor.addEventListener('touchstart', setGeoAsCenter, false);

    var element = document.createElement('div');
    element.className = 'geocenter ol-unselectable ol-control';
    element.appendChild(anchor);

    ol.control.Control.call(this, {
      element: element,
      target: options.target
    });
};
  ol.inherits(app.GeoCenter, ol.control.Control);

var map = new ol.Map({
  //renderer can be set to 'canvas', 'dom' or 'webgl'
  renderer: 'canvas',
  target: 'map',
  layers: layer,
  controls: ol.control.defaults().extend([
        new app.Route(),new app.GeoCenter()
      ]),
  view: view
});







  var createTextStyle = function(feature, resolution, dom) {
          var align = 'Center';
          var baseline = 'Baseline';
          var size = '12';
          var offsetX = 0;
          var offsetY = 0;
          var weight = 'Normal';
          var rotation = 0;
          var font = weight + ' ' + size + ' ' + 'Arial';
          var fillColor = '#aa3300';
          var outlineColor = '#ffffff';
          var outlineWidth = 3;

          return new ol.style.Text({
            textAlign: align,
            textBaseline: baseline,
            font: font,
            text: feature.get('name')+"-"+feature.get("vacancy"),
            fill: new ol.style.Fill({color: fillColor}),
            stroke: new ol.style.Stroke({color: outlineColor, width: outlineWidth}),
            offsetX: offsetX,
            offsetY: offsetY,
            rotation: rotation
          });
        };



  var ParkingStyleFunction = function(feature) {
    return new ol.style.Style({
        image: new ol.style.Circle({
              radius: 5,
              fill: new ol.style.Fill({
                color: 'red'
              }),
              stroke: new ol.style.Stroke({color: 'red', width: 1})
            }),
            //text: createTextStyle(feature, resolution, myDom.points)
            text: createTextStyle(feature)

      });
  };

  map.on('moveend', checknewzoom);

  function checknewzoom(evt)
  {
     var newZoomLevel = map.getView().getZoom();
     if (newZoomLevel != zoomLevel)
     {
        zoomLevel = newZoomLevel;
        // $(document).trigger("zoomend", parking_layer);
     }
  }

var geo_accuracy = new ol.Feature({
    name:"geo_accuracy"
  });
  geo_accuracy.setId('geo_accuracy');
  var geo_location = new ol.Feature({
    name:"geo_location"
  });
  geo_location.setId('geo_location');
  var address_location = new ol.Feature({
    name:"address_location"
  });
  address_location.setId('address_location');
  var pointStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: '#3399CC'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2
      })
    })
  })
  var SelectedPointStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: '#f5f788'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2
      })
    })
  })

  var image = new ol.style.Circle({
        radius: 20,
        fill: new ol.style.Fill({
          color: 'red'
        }),
        stroke: new ol.style.Stroke({color: 'red', width: 1})
      });

      var styles = {
        'Point': new ol.style.Style({
          image: image
        }),
        'LineString': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'green',
            width: 10
          })
        }),
        'MultiLineString': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'green',
            width: 5
          })
        })
      };

      var styleFunction = function(feature) {
        return styles[feature.getGeometry().getType()];
      };

  // select interaction working on "pointerclick"
  var selectClick = new ol.interaction.Select({
    layers:[osmLayer,featureLayer],
    condition: ol.events.condition.pointerMove,
    multi: false
  })

  map.addInteraction(selectClick);
  var value = parseInt('0', 10);
  selectClick.setHitTolerance(value);
  var numOfPoints=0;
  geo_location.setStyle(pointStyle);
  address_location.setStyle(pointStyle);
  var geolocation = new ol.Geolocation({
    // take the projection to use from the map's view
    projection: view.getProjection()
  });
  // listen to changes in position
  geolocation.on('change', function(evt) {
    var coordinates=geolocation.getPosition();
    //var degrees = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
    geo_location.setGeometry(coordinates ?
      new ol.geom.Point(coordinates) : null);
      zoom=14;
    // window.console.log(coordinates);
    doPan(coordinates);
    if(geoloc_array.length==0){
      geoloc_array.push(coordinates);
      numOfPoints+=1;
    }
    else if (geoloc_array==2) {
      geoloc_array.pop();
      geoloc_array.pop();
      geoloc_array.push(coordinates);
    };
    // console.log(geoloc_array);
  });
  geolocation.on('change:accuracyGeometry', function(){
    geo_accuracy.setGeometry(geolocation.getAccuracyGeometry());
  });
  geolocation.setTracking(true);
  featureSource.addFeature(geo_accuracy);
  featureSource.addFeature(geo_location);
  // map.addControl(geocoder);
  var p="point";


  var SelectedFeature=[];
  var SelectedID="";
  var Selected="false";
  function MapClick(event,Sel){
    console.log(SelectedFeature);
    if(Sel=="false"){
      console.log('hi')
      var coordinates=event.coordinate;
      numOfPoints+=1;
      var point= new ol.Feature();
      point.setId(p.concat(numOfPoints.toString()));
      point.setStyle(pointStyle);
      point.setGeometry(coordinates ?
        new ol.geom.Point(coordinates) : null);
        zoom=14;
      featureSource.addFeature(point);

      console.log(point.getGeometry().getCoordinates());
    }
    else if(Sel=="true"){
      if(SelectedID!="geo_location" && SelectedID!="geo_accuracy"){
        featureSource.removeFeature(SelectedFeature[0]);
        //console.log(coordinate_array)
        console.log(SelectedID);
      }
    }
  };
  map.on('click', function(event){
    console.log('click')
    MapClick(event,Selected);
  });
selectClick.on('select', function(e){
  //console.log('point select');
  console.log(e.selected);
  SelectedFeature=e.selected;
  if(SelectedFeature.length==0){
    console.log('length=0');
    e.deselected[0].setStyle(pointStyle);
    Selected="false";
    SelectedID="";
    SelectedFeature=[];
    return;
  }else if(SelectedFeature.length!=0){
    SelectedFeature=e.selected;
    SelectedID=SelectedFeature[0].getId()
    console.log(SelectedFeature[0].getId());
    Selected="true";
    SelectedFeature[0].setStyle(SelectedPointStyle);
      return;
    }
  });

    function setGeoAsCenter(event){
      var coordinates=geolocation.getPosition();
      doPan(coordinates);
    }
    function setCurrentLoc(){
      var coordinates=geolocation.getPosition();
      el('source_box').value=coordinates;
      location[0]=coordinates;
      window.console.log(location)
    };

    function doPan(location) {
      view.animate({
  		zoom: 12,
  		center: location,
	  });
    };
