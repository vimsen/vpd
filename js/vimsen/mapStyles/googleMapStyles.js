/*var mapstyles = [
    {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
            { color: '#adc9b8' }
        ]
    },{
        featureType: 'landscape.natural',
        elementType: 'all',
        stylers: [
            { hue: '#809f80' },
            { lightness: -35 }
        ]
    },
    {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
        { hue: '#f9e0b7' },
        { lightness: 30 }
    ]
    },{
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
        { hue: '#d5c18c' },
        { lightness: 14 }
    ]
    },{
    featureType: 'road.local',
    elementType: 'all',
    stylers: [
        { hue: '#ffd7a6' },
        { saturation: 100 },
        { lightness: -12 }
    ]
    }
];
*/
//created with http://www.evoluted.net/thinktank/web-design/custom-google-maps-style-tool
var mapstyles = [
    {
        "featureType": "landscape",
        "stylers": [
            {
                "hue": "#0093FF"
            },
            {
                "saturation": -34.93975903614461
            },
            {
                "lightness": -53.64705882352943
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "hue": "#0093FF"
            },
            {
                "saturation": -35.39999999999999
            },
            {
                "lightness": -35
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "hue": "#0093FF"
            },
            {
                "saturation": -34
            },
            {
                "lightness": -51.4
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "hue": "#0093FF"
            },
            {
                "saturation": 0
            },
            {
                "lightness": 0
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "hue": "#00EAFF"
            },
            {
                "saturation": 90.19999999999999
            },
            {
                "lightness": 0
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "hue": "#0093FF"
            },
            {
                "saturation": -31.200000000000003
            },
            {
                "lightness": -49.2
            },
            {
                "gamma": 1
            }
        ]
    }
];

function SelectVGWControl(controlDiv, map, controllerSelectionID) {

        

        var controlUISelect = document.getElementById(controllerSelectionID);
        
         // Set CSS for the control border.
        controlUISelect.style.backgroundColor = 'rgba(250,250,250,.7)';
        controlUISelect.style.border = '2px solid rgba(250,250,250,.9)';
        controlUISelect.style.borderRadius = '3px';
        controlUISelect.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUISelect.style.cursor = 'pointer';
        controlUISelect.style.marginBottom = '22px';
        controlUISelect.style.textAlign = 'center';
        controlUISelect.title = 'Click to select a VGW';
        controlDiv.appendChild(controlUISelect);

        // Set CSS for the control interior.
        var controlTextSelect = document.createElement('div');
        controlTextSelect.style.color = 'rgb(25,25,25)';
        controlTextSelect.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlTextSelect.style.fontSize = '16px';
        controlTextSelect.style.lineHeight = '28px';
        controlTextSelect.style.paddingLeft = '5px';
        controlTextSelect.style.paddingRight = '5px';
        controlTextSelect.innerHTML = 'Reset';
        controlUISelect.appendChild(controlTextSelect);

    
}

function ResetControl(controlDiv, map, hideFunction) {

       
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.id = 'resetMapButton';
        controlUI.style.backgroundColor = 'rgba(250,250,250,.7)';
        controlUI.style.border = '2px solid rgba(250,250,250,.9)';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '28px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Reset';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
        $(".selectVGW").val('all');
         hideFunction('all');
          map.setZoom(8);
        });

}

function findByMac(markers, mac, map) {
     var infoWindow = new google.maps.InfoWindow();
  for (var i = 0; i < markers.length; i++) {
    if(mac==='all') {
        map.setZoom(8);
     } else  if (markers[i].mac === mac) {
     //var mark = markers[i];
      //console.log('found marker::'+JSON.stringify(markers[i]));   
      var myLatlng = new google.maps.LatLng(markers[i].lat, markers[i].lng);   
     // infoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + markers[i].description +':'+markers[i].mac+ "</div>");
      //infoWindow.open(map, JSON.stringify(markers[i]));
      map.setZoom(15);
      map.setCenter(myLatlng);

    }
  }  

  //throw "Couldn't find object with id: " + mac;
}