$(document).ready(function() {

    // set profile name
    document.getElementById("profile-name").innerHTML = localStorage.getItem('vpName');
    document.getElementById("profile-name2").innerHTML = localStorage.getItem('vpName');

    var topics = [];

    var markers = [];
    //get location of each VGW

    //add skycons
    var skycons = new Skycons({
      "color": "white"
    });

    vgwFile = "js/vimsen/user/" + localStorage.getItem('vpName') + ".json";
    var jqxhr = $.getJSON(vgwFile, function(data) {
      // console.log( "success:"+JSON.stringify(data));
    })

    .success(function(data) {
        $.each(data, function(index, element) {

          var topic = element.group + '/' + element.mac + '/weather/#';
          topics.push(topic);

          //insert map markers
          var marker = {
            "title": element.name,
            "lat": element.lat,
            "lng": element.lng,
            "description": element.name,
            "mac": element.mac
          }

          markers.push(marker);

          //add option to selection of controllers dropdown
          $('#controllerSelectionMapWeather').append($('<option>', {
            value: element.mac,
            text: element.name
          }));

          //add weather widget
          addWeatherWidget(element, skycons);

        });

        //
        var mapOptions = {
          center: new google.maps.LatLng(markers[0].lat, markers[0].lng),
          // zoom: 2, //Not required.
          mapTypeId: google.maps.MapTypeId.TERRAIN,
        };

        //
        var options = {
          mapTypeControlOptions: {
            mapTypeIds: ['Styled']
          },
          disableDefaultUI: true,
          center: new google.maps.LatLng(markers[0].lat, markers[0].lng),
          mapTypeId: 'Styled'
        };
        var div = document.getElementById('googleMap');
        var map = new google.maps.Map(div, options);
        var styledMapType = new google.maps.StyledMapType(mapstyles, {
          name: 'Styled'
        });
        map.mapTypes.set('Styled', styledMapType);
        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        //add select options div
        var selectVGWControlDiv = document.createElement('div');
        var selectVGWControl = new SelectVGWControl(selectVGWControlDiv, map, 'controllerSelectionMapWeather');
        selectVGWControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(selectVGWControlDiv);
        //add reset button
        var resetControlDiv = document.createElement('div');
        var resetControl = new ResetControl(resetControlDiv, map, hideWeatherDivs);
        resetControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(resetControlDiv);
        //
        var infoWindow = new google.maps.InfoWindow();
        //var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

        //Create LatLngBounds object.
        //var latlngbounds = new google.maps.LatLngBounds();
        //Get the boundaries of the Map.
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < markers.length; i++) {
          var data = markers[i]
          var myLatlng = new google.maps.LatLng(data.lat, data.lng);
          var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon: '../../img/vimsen/location.png',
            title: data.title
          });
          (function(marker, data) {
            google.maps.event.addListener(marker, "click", function(e) {
              infoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + data.description + ':' + data.mac + "</div>");
              infoWindow.open(map, marker);
              $("#controllerSelectionMapWeather").val(data.mac);
              //hide other divs
              hideWeatherDivs(data.mac);
              map.setZoom(15);
              map.setCenter(marker.getPosition());
            });
          })(marker, data);

          //Extend each marker's position in LatLngBounds object.
          // console.log("marker.position::"+marker.position);
          bounds.extend(marker.position);
        };

        jQuery(document).on('change', '#controllerSelectionMapWeather', function() {
          //console.log("marker:"+$("#controllerSelectionMapWeather").val());
          findByMac(markers, $("#controllerSelectionMapWeather").val(), map);

        });

        //Center map and adjust Zoom based on the position of all markers.

        map.fitBounds(bounds);

        google.maps.event.addListener(map, 'idle', function(event) {
          var center = map.getCenter();
          map.setCenter(center);
        });

        //Connect Options
        var optionsWeather = {
          timeout: 3,
          //Gets Called if the connection has sucessfully been established
          onSuccess: function() {
            $.each(topics, function(index, value) {
              //console.log( "topic:"+value);
              client.subscribe(value, {
                qos: 0
              })
            });

          },
          //Gets Called if the connection could not be established
          onFailure: function(message) {
            alert("Connection failed: " + message.errorMessage);
          }
        };

        client.connect(optionsWeather);

      })
      .then(function() {
        // console.log(" then objItem15555555555::"+JSON.stringify(objItem));
      })
      .fail(function(message) {
        console.log("error:::" + message);
      })
      .always(function(data) {
        // console.log( "finished"+JSON.stringify(data));
      });

    // if you're using the Forecast API, you can also supply
    // strings: "partly-cloudy-day" or "rain".

    // start animation!
    skycons.play();

  })
  //
  /*   var mapOptions = {
            center: new google.maps.LatLng(markers[0].lat, markers[0].lng),
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
 
        //Create and open InfoWindow.
        var infoWindow = new google.maps.InfoWindow();
 
        for (var i = 0; i < markers.length; i++) {
            var data = markers[i];
            var myLatlng = new google.maps.LatLng(data.lat, data.lng);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: data.title
            });
 
            //Attach click event to the marker.
            (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (e) {
                    //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                    infoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + data.description + "</div>");
                    infoWindow.open(map, marker);
                    map.setZoom(15);
                    map.setCenter(marker.getPosition());
                });
            })(marker, data);
        }
}*/