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

//   app.GeoCenter = function(opt_options) {
//     var options = opt_options || {};
//
//     var anchor = document.createElement('a');
//     anchor.href = '#GeoCenter';
//     anchor.innerHTML = 'Center -> Geo-Location';
//
//     var this_ = this;
//
//     anchor.addEventListener('click', setGeoAsCenter, false);
//     anchor.addEventListener('touchstart', setGeoAsCenter, false);
//
//     var element = document.createElement('div');
//     element.className = 'geocenter ol-unselectable ol-control';
//     element.appendChild(anchor);
//
//     ol.control.Control.call(this, {
//       element: element,
//       target: options.target
//     });
// };
//   ol.inherits(app.GeoCenter, ol.control.Control);

var map = new ol.Map({
  //renderer can be set to 'canvas', 'dom' or 'webgl'
  renderer: 'canvas',
  target: 'map',
  layers: layer,
  // controls: ol.control.defaults().extend([
  //       new app.GeoCenter()
  //     ]),
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

console.log('controller js');
var selectedService = document.getElementById('serviceType');
var selectedServer = document.getElementById('serverURL');
var controller = document.getElementById('controller');
var layers=null;
var xmlDOM = document.getElementById('xmlDOM');
var capabilities = null
var BASE_SERVER_GetCap_URL = null;
var BASE_REQUEST_URL = null;
var request_URL = null;
var capability=null;
var serviceChoice=null;

selectedService.selectedIndex = 0;
selectedServer.selectedIndex = 0;

$("#serverURL").change(function() {
  // console.log(selectedServer.value);
  selectedService.selectedIndex = 0;
  if($('#capabilities')){
    $('#capabilities').remove()
  }
  switch (selectedServer.value) {
    case('GeoServer'):
      BASE_SERVER_GetCap_URL = 'http://localhost:8080/geoserver/ows?service=';
      break;
    case('OpenGIS'):
      BASE_SERVER_GetCap_URL = 'http://schemas.opengis.net/';
      break;
  }
  // console.log(BASE_SERVER_GetCap_URL);
});

$("#serviceType").change(function() {
  // console.log(selectedService.value);
  switch (selectedService.value) {
    case('WMS'):
      BASE_REQUEST_URL = 'wms';
      break;
    case('WFS'):
      BASE_REQUEST_URL = 'wfs';
      break;
    case('WCS'):
      BASE_REQUEST_URL = 'wcs';
      break;
  }
  switch (selectedServer.value) {
    case('GeoServer'):
      // console.log(BASE_SERVER_GetCap_URL+'%s&version=1.1.1&request=GetCapabilities', BASE_REQUEST_URL);
      request_URL = BASE_SERVER_GetCap_URL + BASE_REQUEST_URL + '&version=1.1.1&request=GetCapabilities'
      break;
    case('OpenGIS'):
      request_URL = BASE_SERVER_GetCap_URL + BASE_REQUEST_URL + '/1.1.1/capabilities_1_1_1.xml'
      break;
  }
  console.log(request_URL);
  $.ajax({
    url: request_URL,
    dataType: 'text',
    success: function(result) {
      // console.log('parsing string to xml');
      switch (selectedService.value) {
        case('WMS'):
          parseWMS(result);
          break;
        case('WFS'):
          parseWFS(result)
          break;
        case('WCS'):
          parseWCS(result)
          break;
      }
      displayCaps()
    },
    error: function(xhr, staus, error) {
      console.log('error in ajax',status, error)
    }
  });
  // console.log(BASE_REQUEST_URL);
})



function StringToXMLDom(string) {
  var xmlDoc = null;
  if (window.DOMParser) {
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(string, "text/xml");
  } else { // Internet Explorer
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");xmlDoc. async = "false"; xmlDoc. loadXML(string);
  }
  return xmlDoc;
}

function displayCaps() {
  var html = '<select id="capabilities">';
  html += "<option value='' selected disabled hidden>Capabilities</option>";
   for(i = 0; i < capabilities.length; i++) {
     console.log(capabilities[i].value)
       html += "<option value='"+i+"'>"+capabilities[i].label+"</option>";
   }
   html += '</select>';
   console.log(html)
   if($('#capabilities')){
     $('#capabilities').remove()
   }
   $('#controller').append(html);
   html = '<select id="layers">';
   html += "<option value='' selected disabled hidden>Layers</option>";
    for(i = 1; i < layers.length; i++) {
        html += "<option value='"+layers[i]+"'>"+layers[i].children[1].innerHTML+"</option>";
    }
    html += '</select>';
   // console.log(html);

   if($('#layers')){
     $('#layers').remove()
   }
   $('#controller').append(html);
   $('#capabilities').selectedIndex = 0;
   $('#layers').selectedIndex = 0;
   // console.log($('#controller').find('#capabilities'))
   $('#capabilities').change(function() {
     switch (selectedService.value) {
       case('WMS'):
       // console.log(document.getElementById('capabilities').value)
         serviceChoice='bbox=-130,24,-66,50&styles=population&Format=image/png&request='+capabilities[document.getElementById('capabilities').value].label
         console.log(serviceChoice)
         break;
       case('WFS'):
         displayWFSParams(capabilities[document.getElementById('capabilities').selectedIndex-1].value)
         break;
       case('WCS'):
         displayWCSParams(capabilities[document.getElementById('capabilities').selectedIndex-1].value)
         break;
     }
     // getRequestParams(capabilities[document.getElementById('capabilities').selectedIndex-1].value)
     // console.log('cap',document.getElementById('capabilities').selectedIndex);
     })
     $('#layers').change(function() {
       console.log('firing query');
       URL=serviceChoice+'&layers='+layers[document.getElementById('layers').value]+'&width=550&height=250&srs=EPSG:4326'
       console.log(URL);
     })
}

function displayWMSParams(req) {
  console.log('wms',req.childElementCount);

  reqChildren=req.children;
  console.log(reqChildren)
}


function parseWMS(xml) {

        var dom = StringToXMLDom(xml);
        // console.log(dom);
        var requestsTag = dom.getElementsByTagName('Request')[0]
        // console.log(requestsTag)
        var caps = requestsTag.children;
        var arr = [];
        for (var i = 1; i < caps.length; i++) {
          arr.push({label:caps[i].nodeName,value:caps[i]});
        }
        // console.log(arr);
        capabilities=arr;
        console.log(dom.getElementsByTagName('Layer'))
        layers=dom.getElementsByTagName('Layer')

}

function parseWFS(xml) {
  var dom = StringToXMLDom(xml);
  // console.log(dom);
  var requestsTag = dom.getElementsByTagName('ows:OperationsMetadata')[0]
  // console.log(requestsTag)
  var caps = requestsTag.children;
  var arr = [];
  for (var i = 1; i < caps.length; i++) {
    // console.log(caps[i].attributes[0].nodeValue)
    arr.push({label:caps[i].attributes[0].nodeValue,value:caps[i]});
  }
  // console.log(arr);
  capabilities=arr;
}

function parseWCS(xml) {
  var dom = StringToXMLDom(xml);
  // console.log(dom);
  var requestsTag = dom.getElementsByTagName('ows:OperationsMetadata')[0]
  // console.log(requestsTag)
  var caps = requestsTag.children;
  var arr = [];
  for (var i = 1; i < caps.length; i++) {
    // console.log(caps[i].attributes[0].nodeValue)
    arr.push({label:caps[i].attributes[0].nodeValue,value:caps[i]});
  }
  // console.log(arr);
  capabilities=arr;
}
