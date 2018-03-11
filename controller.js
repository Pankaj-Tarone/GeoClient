var geoloc_array = [];
var address_array = [];
//var coordinate_array=[];
function el(id) {
  return document.getElementById(id);
};
var zoomLevel = 5;
var center = [80, 20]
var view = new ol.View({center: center, zoom: zoomLevel, projection: 'EPSG:4326'});

var osmSource = new ol.source.OSM();

var osmLayer = new ol.layer.Tile({source: osmSource});

var layer = [osmLayer];

window.app = {};
var app = window.app;

var map = new ol.Map({renderer: 'canvas', target: 'map', layers: layer, view: view});
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
    text: feature.get('name') + "-" + feature.get("vacancy"),
    fill: new ol.style.Fill({color: fillColor}),
    stroke: new ol.style.Stroke({color: outlineColor, width: outlineWidth}),
    offsetX: offsetX,
    offsetY: offsetY,
    rotation: rotation
  });
};

map.on('moveend', checknewzoom);

function checknewzoom(evt) {
  var newZoomLevel = map.getView().getZoom();
  if (newZoomLevel != zoomLevel) {
    zoomLevel = newZoomLevel;
    // $(document).trigger("zoomend", parking_layer);
  }
}

console.log('controller js');
var selectedService = el('serviceType');
var selectedServer = el('serverURL');
var controller = el('controller');
var layers = null;
var xmlDOM = el('xmlDOM');
var capabilities = null
var BASE_SERVER_GetCap_URL = null;
var BASE_REQUEST_URL = null;
var request_URL = null;
var capability = null;
var serviceChoice = null;

selectedService.selectedIndex = 0;
selectedServer.selectedIndex = 0;

$("#serverURL").change(function() {
  // console.log(selectedServer.value);
  selectedService.selectedIndex = 0;
  if ($('#capabilities')) {
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
      request_URL = BASE_SERVER_GetCap_URL + BASE_REQUEST_URL + '&version=1.1.1&request=GetCapabilities';
      break;
    case('OpenGIS'):
      request_URL = BASE_SERVER_GetCap_URL + BASE_REQUEST_URL + '/1.1.1/capabilities_1_1_1.xml';
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
          parseWFS(result);
          break;
        case('WCS'):
          parseWCS(result);
          break;
      }
      displayCaps()
    },
    error: function(xhr, staus, error) {
      console.log('error in ajax', status, error);
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
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = "false";
    xmlDoc.loadXML(string);
  }
  return xmlDoc;
}

function displayCaps() {
  var html = '<select id="capabilities">';
  html += "<option value='' selected disabled hidden>Capabilities</option>";
  for (i = 0; i < capabilities.length; i++) {
    console.log(capabilities[i].value)
    html += "<option value='" + i + "'>" + capabilities[i].label + "</option>";
  }
  html += '</select>';
  console.log(html)
  if ($('#capabilities')) {
    $('#capabilities').remove()
  }
  $('#controller').append(html);
  html = '<select id="layers">';
  html += "<option value='' selected disabled hidden>Layers</option>";
  for (i = 1; i < layers.length; i++) {
    html += "<option value='" + i + "'>" + layers[i].children[1].innerHTML + "</option>";
  }
  html += '</select>';
  // console.log(html);

  if ($('#layers')) {
    $('#layers').remove()
  }
  $('#controller').append(html);
  html = '<button id="button">fire</button>'
  $('#controller').append(html);
  $('#capabilities').selectedIndex = 0;
  $('#layers').selectedIndex = 0;
  // console.log($('#controller').find('#capabilities'))
  $('#capabilities').change(function() {
    switch (selectedService.value) {
      case('WMS'):
        serviceChoice = 'bbox=-130,24,-66,50&Format=image/png&request=' + capabilities[el('capabilities').value].label
        console.log(serviceChoice);
        break;
      case('WFS'):
        displayWFSParams(capabilities[el('capabilities').selectedIndex - 1].value);
        break;
      case('WCS'):
        displayWCSParams(capabilities[el('capabilities').selectedIndex - 1].value);
        break;
    }
  })
  var URL = ''
  $('#layers').change(function() {
    console.log('firing query');
    URL = 'http://localhost:8080/geoserver/wms?' + serviceChoice + '&layers=' + layers[el('layers').value].children[0].innerHTML + '&width=550&height=250&srs=EPSG:4326'
    console.log(URL);
  })
  $('#button').click(function() {
    console.log('fire', URL)
    $.ajax({
      url: URL,
      success: function(result) {
        // console.log('parsing string to xml');
        // console.log(result);
        var newlayer = new ol.layer.Image({
          source: new ol.source.ImageStatic({
            attributions: '© <a href="http://xkcd.com/license.html">xkcd</a>',
            url: URL,
            projection: 'EPSG:4326',
            imageExtent: [-130, 24, -66, 50]
          })
        })

        console.log('adding');
        map.addLayer(newlayer);

      },
      error: function(xhr, staus, error) {
        console.log('error in fire ajax', status, error)
      }
    });
  })
}

function displayWMSParams(req) {
  console.log('wms', req.childElementCount);

  reqChildren = req.children;
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
    arr.push({label: caps[i].nodeName, value: caps[i]});
  }
  // console.log(arr);
  capabilities = arr;
  console.log(dom.getElementsByTagName('Layer'))
  layers = dom.getElementsByTagName('Layer')
  console.log(layers)

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
    arr.push({label: caps[i].attributes[0].nodeValue, value: caps[i]});
  }
  // console.log(arr);
  capabilities = arr;
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
    arr.push({label: caps[i].attributes[0].nodeValue, value: caps[i]});
  }
  // console.log(arr);
  capabilities = arr;
}
