console.log('controller js');
var selectedService = document.getElementById('serviceType');
var selectedServer = document.getElementById('serverURL');
var controller = document.getElementById('controller');

var xmlDOM = document.getElementById('xmlDOM');
var capabilities = null
var BASE_SERVER_GetCap_URL = null;
var BASE_REQUEST_URL = null;
var request_URL = null;

selectedService.selectedIndex = 0;
selectedServer.selectedIndex = 0;

$("#serverURL").change(function() {
  console.log(selectedServer.value);
  selectedService.selectedIndex = 0;
  switch (selectedServer.value) {
    case('GeoServer'):
      BASE_SERVER_GetCap_URL = 'http://localhost:8080/geoserver/ows?service=';
      break;
    case('OpenGIS'):
      BASE_SERVER_GetCap_URL = 'http://schemas.opengis.net/';
      break;
  }
  console.log(BASE_SERVER_GetCap_URL);
});

$("#serviceType").change(function() {
  console.log(selectedService.value);
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
    success: function(result) {
      console.log('parsing string to xml');
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
    }
  });
  console.log(BASE_REQUEST_URL);
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
   for(i = 0; i < capabilities.length; i++) {
       html += "<option value='"+capabilities[i].label+"'>"+capabilities[i].label+"</option>";
   }
   html += '</select>';
   console.log(html);
   $('#controller').append(html);
}

function parseWMS(xml) {

        var dom = StringToXMLDom(xml);
        console.log(dom);
        var requestsTag = dom.getElementsByTagName('Request')[0]
        // console.log(requestsTag)
        var caps = requestsTag.children;
        var arr = [];
        for (var i = 1; i < caps.length; i++) {
          arr.push({label:caps[i].nodeName,value:caps[i]});
        }
        console.log(arr);
        capabilities=arr;
}

function parseWFS(xml) {
  var dom = StringToXMLDom(xml);
  console.log(dom);
  var requestsTag = dom.getElementsByTagName('Request')[0]
  // console.log(requestsTag)
  var caps = requestsTag.children;
  var arr = [];
  for (var i = 1; i < caps.length; i++) {
    arr.push({label:caps[i].nodeName,value:caps[i]});
  }
  console.log(arr);
  capabilities=arr;
}

function parseWCS(xml) {
  var dom = StringToXMLDom(xml);
  console.log(dom);
  var requestsTag = dom.getElementsByTagName('Request')[0]
  // console.log(requestsTag)
  var caps = requestsTag.children;
  var arr = [];
  for (var i = 1; i < caps.length; i++) {
    arr.push({label:caps[i].nodeName,value:caps[i]});
  }
  console.log(arr);
  capabilities=arr;
}
