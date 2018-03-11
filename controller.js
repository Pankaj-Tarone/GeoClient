console.log('controller js');
var selectedService = document.getElementById('serviceType');
var selectedServer = document.getElementById('serverURL');
var controller = document.getElementById('controller');

var xmlDOM = document.getElementById('xmlDOM');
var capabilities = null
var BASE_SERVER_GetCap_URL = null;
var BASE_REQUEST_URL = null;
var request_URL = null;
var capability=null;

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
       html += "<option value='"+capabilities[i].value+"'>"+capabilities[i].label+"</option>";
   }
   html += '</select>';
   // console.log(html);
   if($('#capabilities')){
     $('#capabilities').remove()
   }
   $('#controller').append(html);
   $('#capabilities').selectedIndex = 0;
   // console.log($('#controller').find('#capabilities'))
   $('#capabilities').change(function() {
     switch (selectedService.value) {
       case('WMS'):
         displayWMSParams(capabilities[document.getElementById('capabilities').selectedIndex-1].value);
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
