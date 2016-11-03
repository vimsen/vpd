$(document).ready(function () {
  //var vgwFile = localStorage.getItem("vgwFile");
   // console.log(" VGW::::: vgw file::"+vgwFile);
   
     var topics = [];
    
     var markers = [];
     //get location of each VGW

     console.log( "success:client"+JSON.stringify(options));
    
     var jqxhr = $.getJSON( vgwFile, function(data) {
     // console.log( "success:"+JSON.stringify(data));
    })

    .success(function(data) {
       // var obj = jQuery.parseJSON( data.item );

       // console.log( "second success Length"+JSON.stringify(data.item.length));
         $.each(data, function(index, element) {

          if(element.group.indexOf("hedno") > -1) {
           var topic = element.name+'/'+element.mac+'/VGW/#';
          } else {
           var topic = element.group+'/'+element.mac+'/VGW/#';
          }
          topics.push(topic);
           
               console.log( "element:"+JSON.stringify(element));
              //  $.when( getAppliances(element) ).done(function() {
               //   console.log("objItem1::"+JSON.stringify(objItem));
              //  });

            // client.subscribe(topic, {qos: 0})

        
          //insert map markers
           var marker = {
            "title":element.name,
            "lat": element.lat,
            "lng": element.lng,
            "description": element.name,
            "mac":element.mac
          }

          markers.push(marker);

           //add option to selection of controllers dropdown
          $('#controllerSelectionMapVGW').append($('<option>', {
            value: element.mac,
            text: element.name
          }));


                    //add addVGWInfoWidget widget
          addVGWInfoWidget(element);
          
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
          var styledMapType = new google.maps.StyledMapType(mapstyles, { name: 'Styled' });
          map.mapTypes.set('Styled', styledMapType);
           // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
            //add select options div
           var selectVGWControlDiv = document.createElement('div');
           var selectVGWControl = new SelectVGWControl(selectVGWControlDiv, map, 'controllerSelectionMapVGW');
           selectVGWControlDiv.index = 1;
           map.controls[google.maps.ControlPosition.TOP_CENTER].push(selectVGWControlDiv);
            //add reset button
           var resetControlDiv = document.createElement('div');
           var resetControl = new ResetControl(resetControlDiv, map, hideVGWDivs);
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
             (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + data.description +':'+data.mac+ "</div>");
                    infoWindow.open(map, marker);
                    $("#controllerSelectionMapVGW").val(data.mac);
                    //hide other divs
                    hideVGWDivs(data.mac);
                    map.setZoom(15);
                    map.setCenter(marker.getPosition());
                });
            })(marker, data);
 
            //Extend each marker's position in LatLngBounds object.
           // console.log("marker.position::"+marker.position);
            bounds.extend(marker.position);
         };
 
       
          jQuery(document).on('change','#controllerSelectionMapVGW',function() {
                    console.log("marker:"+$("#controllerSelectionMapVGW").val());
                    findByMac(markers, $("#controllerSelectionMapVGW").val(),map);
                   
          });
 
        //Center map and adjust Zoom based on the position of all markers.
       
          map.fitBounds(bounds); 

          google.maps.event.addListener(map, 'idle', function (event) {
            var center = map.getCenter();
            map.setCenter(center);
          });



             //Connect Options
             var optionsWeather = {
               timeout: 3,
              //Gets Called if the connection has sucessfully been established
                 onSuccess: function () {
                    console.log("Connected");
                      $.each(topics, function( index, value ) {
                      console.log( "topic:"+value);
                      client.subscribe(value, {qos: 0})
                    });

                 },
                 //Gets Called if the connection could not be established
                 onFailure: function (message) {
                   alert("Connection failed: " + message.errorMessage);                  
                 }
             };     

             client.connect(optionsWeather);
          

     })
    .then(function() {
      // console.log(" then objItem15555555555::"+JSON.stringify(objItem));
     })
    .fail(function(message) {
      console.log( "error:::" +message);
     })
     .always(function(data) {
     // console.log( "finished"+JSON.stringify(data));
    });

 

    
})
  